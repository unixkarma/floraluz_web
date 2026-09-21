# floraluz live visuals — cómo funciona todo

Sistema de luces para las tocadas: reacciona solo a la música, se toca en
vivo con un controlador MIDI y sigue el set de Ableton (clock, escenas,
automatización). Un solo motor alimenta el proyector (WebGL), los tubos
pixel (WLED / Art-Net) y, más adelante, los PAR (DMX).

```
                 ┌──────────────── laptop ────────────────────────────────┐
 Ableton ─audio─▶ BlackHole ─▶ /visuals (Chrome) ─BroadcastChannel─▶ /visuals/output ─▶ proyector
    │                          │  motor + panel                            (WebGL)
    ├─MIDI (IAC)──────────────▶│  clock · notas · CC
 Launch Control ──MIDI────────▶│
                               └─WebSocket 9500─▶ npm run bridge ─Art-Net UDP─▶ ESP32/WLED ─▶ tubos
                                                                 └─(pendiente)─▶ USB-DMX ─▶ PARs
```

Rama de trabajo: `visuals-engine`. Nada de esto está enlazado desde la web
pública; se entra directo a `/visuals`.

---

## 1. Estructura del repo

| Ruta | Qué es | Depende de |
|---|---|---|
| `engine/` | Motor puro TS: modelo de datos, clock, análisis de audio, escenas, render de píxeles. **Sin DOM, sin WebGL, sin MIDI** — corre igual en el browser y en Node. | nada |
| `engine/types.ts` | `LightState` (bus global + zonas) y `Frame` (lo que se manda a cada renderer por cuadro). | |
| `engine/clock.ts` | Tap tempo, `createMidiClock` (24 ppqn), `chasePhase` (fase musical o libre). | |
| `engine/audio/` | Bandas, RMS, detector de beats + BPM, envolventes, auto-gain, mapping bandas→zonas. | |
| `engine/scenes.ts` | Snapshots de `LightState` + `lerpLightState` (crossfade). | |
| `engine/pixel/` | `PixelLayout` + `renderPixels`: `Frame` → bytes RGB de los tubos. | |
| `renderers/webgl/` | Dibuja las zonas como barras en un canvas (proyector). | engine |
| `renderers/artnet/packet.ts` | Arma paquetes ArtDmx (puro, sin sockets). | |
| `src/app/visuals/page.tsx` | **Panel de control.** Corre el motor, el audio, el MIDI, las escenas; emite un `Frame` por cuadro. | todo |
| `src/app/visuals/output/page.tsx` | **Salida limpia** para el proyector: solo canvas, escucha frames. | webgl |
| `src/app/visuals/use*.ts` | Hooks: `useAudioAnalysis`, `useMidiControl`, `useScenes`, `useBridge`. | |
| `tools/artnet-bridge/` | Proceso Node: WebSocket → render de píxeles → Art-Net UDP al ESP32. | engine, renderers/artnet |

---

## 2. Modelo de datos

### `LightState` — el estado de la luz, todo 0–1

```ts
bus: { master, blackout, strobe, chaseSpeed, energy, movement, spread, hue, saturation }
zones: [ { intensity, hue, saturation, offset }, … ]   // 4 zonas: bpm · low · mid · high
```

- **Zonas** son grupos lógicos, no fixtures. Cada renderer decide qué hace
  con ellas: en el proyector son 4 barras, en los tubos cada tubo es una
  zona, en los PAR serán izquierda = bpm+low y derecha = mid+high.
- `offset` desplaza la fase del chase por zona (para que la onda "viaje").
- `energy` lo llena el análisis de audio; `hue`/`saturation` del bus son
  el color base cuando una escena no fija color por zona.

### `Frame` — lo que viaja a los renderers cada cuadro

```ts
{ state: LightState, beatPulse: 0–1, chasePhase: number }
```

- `beatPulse`: golpe que decae (ataque 5 ms, release 150 ms) por cada beat.
  Viene del detector de audio **y/o** del MIDI clock — se toma el mayor (HTP).
- `chasePhase`: fase del chase en ciclos. Con clock de Ableton es
  `(beat + beatPhase) / beatsPorCiclo`, o sea **anclada al compás**; sin
  clock, corre libre con el tiempo. Los renderers usan esto para todo lo
  rítmico, nunca el reloj de pared (salvo el strobe).

---

## 3. Flujo por cuadro (`page.tsx`, loop de `requestAnimationFrame`)

1. `base` = estado manual (sliders/MIDI). Si hay crossfade de escena en
   curso, `base = lerp(from, to, t)` y los sliders se actualizan a ~10 Hz.
2. Si hay audio conectado → `analysis = audio.tick(t)` (bandas, beat, energy).
3. `clock.snapshot(t)`: si Ableton manda clock, `beatPulse = max(audio, clock)`,
   `bpm = clock.bpm`, `isBeat |= clock.beatHit`.
4. Si `AUDIO ON` → `live = applyAudioReactive(base, analysis)`:
   zona 0 ← beatPulse, zona 1 ← low, zona 2 ← mid, zona 3 ← high. El
   color y todo lo demás sigue siendo el manual (los sliders son la paleta).
5. `frame = { live, beatPulse, chasePhase(clock, live.bus.chaseSpeed, t) }`.
6. `frame` → WebGL local, → `BroadcastChannel` (ventana de salida),
   → WebSocket (bridge de tubos).

Trampa conocida: el loop se monta una vez, así que todo lo que cambia
(`audioMode`, `connected`, `tick`, `bridge.send`…) se lee por `ref`, no
por el valor del render.

---

## 4. Audio reactivo

### Routing (macOS)

- Ableton → salida **`floraluz-out`** (Multi-Output Device en Audio MIDI
  Setup = interfaz M-Track + **BlackHole 2ch**). El mismo audio va a los
  parlantes y al análisis.
- Si la M-Track no está conectada, el multi-output se queda mudo: hay que
  re-apuntarlo a External Headphones / MacBook Speakers y reabrir la salida
  en Ableton.
- BlackHole a veces no carga tras reiniciar: `sudo killall coreaudiod`.

### En `/visuals`

`list devices` → permiso de micrófono → elegir **BlackHole 2ch** → `AUDIO ON`.
Nada reacciona hasta hacer los dos pasos.

### Análisis (`engine/audio/`, `useAudioAnalysis`)

- FFT → bandas sub/low/mid/high/air, normalizadas con **auto-gain
  adaptativo por banda** (`normalize.ts`) + slider `gain`.
- `energy`: envolvente del RMS (ataque 15 ms, release 300 ms).
- Beat: flujo espectral de la banda del bombo (30–200 Hz) en un
  AnalyserNode sin suavizado, umbral media + 1.5σ, flanco de subida; BPM =
  mediana de intervalos, doblado a 70–180.
- `beatPulse`: envolvente 5/150 ms de `isBeat`.

---

## 5. MIDI

Todo pasa por **Web MIDI → Chrome/Edge** (Safari no lo tiene). Ableton y
el browser pueden leer el mismo controlador a la vez.

### Learn (`useMidiControl`)

Clic en el badge de cualquier slider/botón → mover un knob o tocar un pad
→ queda mapeado (CC → slider 0–1, Note-on → trigger). Se guarda en
`localStorage`. `borrar mapeos` limpia todo.

Recomendación de reparto: knobs libres del Launch Control X para luces;
el Launchpad se queda en Ableton (si lo mapeas aquí también, cada clip
dispararía además una luz).

### IAC Driver: la vía Ableton → luces

Puerto MIDI virtual de macOS. Una vez activo, Ableton lo ve como salida y
el browser como entrada.

1. Audio MIDI Setup → MIDI Studio → IAC Driver → ✔ *Device is online*.
2. Ableton → Preferences → Link/Tempo/MIDI → fila **Out: IAC Driver Bus 1**
   → **Track ON** (notas/CC) y **Sync ON** (clock).
3. Pista MIDI **LIGHTS** → *MIDI To: IAC Driver Bus 1*.

Con eso:
- **Clock** (`createMidiClock`): 0xF8 cada 1/24 de negra, 0xFA/0xFB/0xFC
  transporte. BPM = mediana de los últimos 24 ticks; `beatHit` una vez por
  negra; se declara muerto tras 1 s sin ticks. Badge `midi clock ▶ 128.0`.
- **Automatización**: clips con CC en la pista LIGHTS → learn sobre
  `master`, `hue`, `strobe`, `chaseSpeed`… Ableton mueve los sliders.
- **Escenas por nota**: learn sobre un slot → tocar/dibujar la nota →
  cada vez que suena, dispara la escena.

### `chaseSpeed` con clock

El slider deja de ser velocidad libre y elige un valor musical:

| slider | 0–.17 | .17–.33 | .33–.5 | .5–.67 | .67–.83 | .83–1 |
|---|---|---|---|---|---|---|
| ciclo cada | 4 compases | 2 compases | 1 compás | 2 negras | 1 negra | corchea |

---

## 6. Escenas (`engine/scenes.ts`, `useScenes`)

- 8 slots, persisten en `localStorage`.
- **Disparar**: clic en el slot (o pad/nota mapeados) → crossfade al
  snapshot con el tiempo del slider `fade` (0–4 s). El hue va por el camino
  corto del círculo; `blackout` cambia a mitad del fade.
- **Guardar**: `guardar` → clic en un slot = snapshot del estado manual actual.
- **Borrar**: clic derecho en el slot.
- El audio reactivo sigue aplicándose encima de la escena activa (la
  escena fija colores/chase/master; el audio mueve las intensidades).

Pendiente (fase 3 completa): profundidades de audio por escena, mezcla
HTP/LTP explícita, botón OVERRIDE, bancos y setlist.

---

## 7. Renderers

### Proyector — `renderers/webgl` + `/visuals/output`

Cada zona = barra vertical en su color. Brillo = intensidad × master ×
chase (onda entre barras según `movement`/`spread`, posición por
`chasePhase`) + lift blanco por `beatPulse`. Strobe y blackout iguales al
resto.

Uso: botón **abrir salida ↗** en `/visuals` → arrastrar la ventana al
proyector → pantalla completa. No tiene lógica propia: solo escucha
`BroadcastChannel("floraluz-visuals")`.

### Tubos pixel — `engine/pixel` + `tools/artnet-bridge` + WLED

```
/visuals ──WS 9500──▶ bridge (Node) ──Art-Net UDP 6454──▶ ESP32 (WLED) ──▶ WS2812B
```

- El browser no puede mandar UDP, por eso existe el bridge. Corre al lado
  de `next dev`: `WLED_IP=192.168.x.x TUBES=4 PPT=60 npm run bridge`.
- Env: `WLED_IP` (default `4.3.2.1`, el AP de WLED), `TUBES`, `PPT`
  (píxeles por tubo), `UNIVERSE` (0), `FPS` (40), `FLIPPED` ("1,3": tubos
  cableados al revés), `WS_PORT` (9500).
- Guarda el último frame y lo sigue mandando si la página se traba; a los
  2 s sin frames manda negro.
- Badge en `/visuals`: `tubos ● conectado` / `○ sin bridge`. Reconecta solo.

`renderPixels` por tubo (una zona cada uno):
- **VU**: la intensidad de la zona enciende esa fracción del tubo desde el
  piso; el resto queda a 6 % para que el tubo se vea como objeto.
- **Onda**: seno que viaja con `chasePhase` + `offset`, mezclado por
  `movement`; `spread` = cuántos ciclos caben en un tubo.
- **Beat**: ráfaga blanca desde el centro hacia afuera en todos los tubos.
- Gamma 2.2 antes de salir (sin eso las tiras se ven lavadas).

Config de WLED (una vez, en la web del ESP32):
- *LED Preferences*: WS2812B, length = TUBES × PPT, GPIO 2, **Maximum
  current = 9000 mA** con fuente de 10 A (WLED escala solo).
- *Sync Interfaces → Realtime*: ✔ UDP realtime, **Art-Net**, port 6454,
  **DMX mode: Multi RGB**, start universe = `UNIVERSE`, timeout 2500 ms.
- *WiFi*: red propia (hotspot del celular o router del show). El AP
  `WLED-AP` / `wled1234` en `4.3.2.1` sirve para probar pero deja al laptop
  sin internet.
- Flasheo inicial: https://install.wled.me en Chrome, con el ESP32 por USB.

### PARs — DMX (pendiente, fase 5)

2× American Xtreme AX-PAR1818 (6 ch: R G B W A UV). Plan: perfil de
fixture + salida por interfaz USB-DMX desde el mismo bridge (el
empaquetado DMX ya existe en `renderers/artnet/packet.ts`). Mapeo:
izquierda = bpm+low, derecha = mid+high, flash blanco HTP en el beat.

---

## 8. Hardware de los tubos

Por tubo: 1 m de WS2812B 5V 60 LED/m pegada a la pared interna de un tubo
opal Ø30–40 mm, tapas en los extremos.

Eléctrico:
- **Potencia en estrella**: par +5V/GND desde la bornera a **cada** tubo
  (18 AWG, ≤ 2 m). La corriente no se encadena tubo a tubo — a 5 V se cae.
- **Datos en cadena**: ESP32 GPIO2 → tubo 1 DIN … DOUT → tubo 2 DIN … (22 AWG).
- En la entrada de cada tubo: capacitor 1000 µF entre +5V y GND,
  resistencia 330 Ω en serie en DATA, fusible 5 A en +5V.
- ESP32 alimentado por USB desde la misma fuente 5 V; **GND común** con la
  bornera. Sin level shifter: ESP32 a ≤ 30 cm del tubo 1. Si parpadea:
  74AHCT125 (pedido a AliExpress) o "píxel de sacrificio" (primer LED a
  ~4.3 V vía diodo 1N4007).
- Consumo: 60 LED × 60 mA = 3.6 A por tubo a blanco pleno; en show real
  con gamma y colores, ~1 A. Fuente 5V 10A + límite de WLED = seguro.

Compra hecha (Megatrónica, proforma 4309 v2, $115.19 con envío): cinta,
ESP32, fuente, capacitores, resistencias, fusibles + portafusibles aéreos,
bornera, caja, USB-C. Falta: tubos opal, tapas, cable, JST, bases, gaffer.

---

## 9. Día del show — checklist

1. Laptop: `npm run dev` y `npm run bridge` (con `WLED_IP` de la red del show).
2. Audio MIDI Setup: `floraluz-out` apunta a la interfaz correcta; IAC online.
3. Ableton: salida `floraluz-out`; IAC Bus 1 con Track + Sync; pista LIGHTS a IAC.
4. Chrome → `/visuals`: `list devices` → BlackHole → `AUDIO ON`. Ver
   `midi clock ▶` al dar play y `tubos ● conectado`.
5. `abrir salida ↗` → proyector → pantalla completa.
6. Cargar escenas (ya están en `localStorage` del mismo Chrome; si es otro
   laptop, hay que rehacerlas — export/import es pendiente).
7. Probar blackout desde el pad. Es el botón que siempre tiene que responder.

---

## 10. Estado y pendientes

Hecho: motor, WebGL, salida separada, audio reactivo con auto-gain y beat,
MIDI learn, MIDI clock, chases anclados al compás, escenas con crossfade,
render de tubos + bridge Art-Net (probado con listener UDP local, **no aún
con WLED real**).

Pendiente, en orden:
1. Probar bridge contra el ESP32 real y armar tubo 1.
2. Export/import de escenas y mapeos MIDI (JSON) para no depender de `localStorage`.
3. Fase 3 completa: HTP/LTP explícito, OVERRIDE, profundidades de audio por escena.
4. Fase 5: renderer DMX para los PAR (cuando haya interfaz USB-DMX).
5. Ableton Link (si el MIDI clock se queda corto) y empaquetado Electron.
