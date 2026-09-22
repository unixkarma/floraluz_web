# artnet-bridge — tubos pixel (WLED)

Visión completa del sistema: [`docs/visuals.md`](../../docs/visuals.md).

```
/visuals (browser) ──WS 9500──▶ bridge (Node) ──Art-Net UDP──▶ ESP32/WLED ──▶ tiras WS2811
```

## Correr

```sh
npm run dev                          # el control page en /visuals
WLED_IP=192.168.x.x npm run bridge   # en otra terminal
```

El badge "tubos ● conectado" en `/visuals` confirma el WS. Env: `TUBES` (4),
`PPT` píxeles por tubo (30), `UNIVERSE` (0), `FPS` (40), `FLIPPED` ("1,3").

## Primera prueba de hardware (sin browser)

```sh
TEST=1 WLED_IP=192.168.x.x TUBES=1 PPT=60 npm run bridge
```

Manda un patrón fijo: degradado de color a lo largo de la tira + un punto
blanco que da una vuelta cada 2 s. Sirve para confirmar cableado, WLED y
Art-Net antes de meter el browser en la ecuación.

- No prende nada → red/IP, o Art-Net no activado en WLED.
- Prende pero los colores están cambiados → orden GRB vs RGB en WLED.
- El punto no llega al final → `length` en WLED menor que `TUBES × PPT`.
- Parpadea o se pone loco al subir el brillo → falta capacitor / GND común,
  o la señal de datos necesita el level shifter.

## WLED (una vez, en la web del ESP32)

- **Config → LED Preferences**: tipo WS2811 (o WS2812B), length = TUBES×PPT,
  GPIO 2 (o el que uses), limitar corriente según la fuente.
- **Config → Sync Interfaces → Realtime**: ✔ Receive UDP realtime,
  **Art-Net**, port 6454, **DMX mode: Multi RGB**, start universe = `UNIVERSE`,
  timeout 2500 ms.
- **Config → WiFi**: ideal red propia (router del show o hotspot). Sin red,
  WLED levanta su AP `WLED-AP` (pass `wled1234`) en `4.3.2.1` — sirve para
  probar pero el laptop pierde internet.

## Cableado (por tubo, tira 12V WS2811)

- Tira dentro del tubo opal, DIN al extremo del piso (o marca el tubo en `FLIPPED`).
- 3 hilos entre tubos: +12V, GND, DATA. Datos en serie tubo 1 → 2 → 3 → 4.
- ESP32: GND común con la fuente, DATA por level shifter (74AHCT125) o
  resistencia 330Ω si el cable es corto. Alimenta el ESP32 con un buck 12→5V
  o USB, **nunca** 12V directo.
- Fuente 12V: ~0.6 A por metro a 30 LED/m a full blanco → 4 tubos ≈ 2.5 A;
  una 12V 5A sobra. Inyecta +12V en ambos extremos si pasas de 4 tubos.
