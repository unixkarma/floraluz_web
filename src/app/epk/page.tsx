export default function EPK() {
  return (
    <main className="min-h-screen bg-black text-gray-300 font-mono">
      {/* Header */}
      <div className="text-center py-16 px-5 border-b border-gray-800 bg-gradient-to-b from-black to-gray-950 relative">
        {/* Psychedelic Text Left */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-900/20 text-xs tracking-widest opacity-30 rotate-90 hidden md:block">
          ◊ ∞ ◦ ∆ ◊ ∞ ◦ ∆ ◊ ∞ ◦ ∆
        </div>
        {/* Psychedelic Text Right */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-900/20 text-xs tracking-widest opacity-30 -rotate-90 hidden md:block">
          ∇ ◈ ∴ ◊ ∇ ◈ ∴ ◊ ∇ ◈ ∴ ◊
        </div>
        
        <div 
          className="text-5xl md:text-6xl text-white font-bold mb-4 tracking-tighter"
          style={{ 
            textShadow: '2px 2px 0 rgba(139, 69, 19, 0.4)',
            fontFamily: 'Courier New, monospace' 
          }}
        >
          floraluz
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block border p-8 bg-gray-900/20 rounded" style={{ borderColor: 'rgba(220, 38, 38, 0.15)' }}>
            <div className="relative">
              <img 
                src="/floraluz-cover.jpg" 
                alt="floraluz - Cover Art" 
                className="w-96 h-72 object-cover border border-dashed"
                style={{ borderColor: 'rgba(220, 38, 38, 0.2)' }}
              />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-black border p-10 rounded mb-16" style={{ borderColor: 'rgba(220, 38, 38, 0.12)' }}>
          {/* Spanish */}
          <div className="mb-12">
            <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
              PROYECTO
              <div className="inline-block ml-3 w-1 h-1 bg-red-500 rounded-full opacity-40"></div>
            </div>
            <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
              <strong className="text-white">floraluz</strong> navega entre electronic dance y ambient. 
              Una propuesta que documenta estados emocionales a través de paisajes sonoros que fusionan lo crudo con lo visionario.
              <br/><br/>
              Grooves hipnóticos procesados digitalmente con texturas que evocan nostalgia y calidez. 
              Future soul y electronic R&B desde una perspectiva latinoamericana genuina.
              <div className="text-xs text-red-900/40 mt-4 opacity-60 tracking-widest">
                [ analog_saturation.enabled ]
              </div>
            </div>
          </div>
          
          {/* English */}
          <div className="mb-12 border-t border-gray-800 pt-8">
            <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
              PROJECT
            </div>
            <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
              <strong className="text-white">floraluz</strong> navigates between electronic dance and ambient. 
              A proposal that documents emotional states through soundscapes that fuse the raw with the visionary.
              <br/><br/>
              Hypnotic grooves digitally processed with textures that evoke nostalgia and warmth. 
              Future soul and electronic R&B from a genuine Latin American perspective.
            </div>
          </div>

          {/* Chinese */}
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
              项目
            </div>
            <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
              <strong className="text-white">floraluz</strong> 在电子舞曲和环境音乐之间航行，采用明确的低保真美学。
              这是一个通过声音景观记录情感状态的提案，将原始与幻想融合在一起。
              <br/><br/>
              数字化处理的催眠节拍，带有唤起怀旧和温暖感的纹理。
              来自真正拉丁美洲视角的未来灵魂乐和电子R&B。
            </div>
          </div>
        </div>

        {/* Tracklist Player */}
        <div className="bg-black border border-dashed p-10 rounded mb-16" style={{ borderColor: 'rgba(220, 38, 38, 0.15)' }}>
          <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
            ESCUCHAR • LISTEN • 收听 EP
            <div className="text-xs text-red-900/30 mt-2 tracking-wider">
              [ audio_stream.ready ]
            </div>
            <div className="text-xs text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
              Demos 2023 • Digitally remastered after original stems were lost • 2023年样本，原始音轨丢失后数字重制
            </div>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { track: "01. ERES TÚ", duration: "3:42", accent: true, file: "eres-tu.mp3" },
              { track: "02. ITERACIONES", duration: "4:18", accent: false, file: "iteraciones.mp3" },
              { track: "03. XTAL CLEAR", duration: "5:27", accent: true, file: "xtal-clear.mp3" }
            ].map((item, i) => (
              <div key={i} className={`p-4 border ${item.accent ? 'bg-red-950/10 border-red-900/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-bold text-sm tracking-wide">{item.track}</div>
                    <div className="text-gray-500 text-xs">{item.duration}</div>
                  </div>
                  <div className="text-gray-600 text-xs tracking-widest">
                    [ PLAY • 播放 ]
                  </div>
                </div>
                <audio 
                  controls 
                  preload="none"
                  className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity"
                  style={{
                    filter: 'sepia(1) hue-rotate(320deg) saturate(0.8)',
                    background: 'transparent'
                  }}
                >
                  <source src={`/${item.file}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Release */}
        <div 
          className="bg-black border p-10 rounded mb-16"
          style={{ borderColor: 'rgba(139, 69, 19, 0.15)' }}
        >
          {/* Spanish */}
          <div className="mb-12">
            <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
              ÚLTIMO LANZAMIENTO
            </div>
            <div className="text-center">
              <div className="text-2xl text-white mb-3 tracking-widest">
                EP &quot;ITERACIONES&quot;
              </div>
              <div className="text-sm text-gray-400 mb-6">
                Agosto 2025 • YouTube Music
              </div>
              <div className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                Electronic Dance Experimental / Future Beats Latinoamericano<br/>
                El EP &quot;Iteraciones&quot; nace de sesiones de producción mayormente digital.
              </div>
              
              <div 
                className="bg-black/40 p-8 mx-auto max-w-md border border-dashed"
                style={{ borderColor: 'rgba(139, 69, 19, 0.3)' }}
              >
                <div className="text-sm text-gray-400 mb-4 tracking-wider">CONTENIDO</div>
                {["01. ERES TÚ", "02. ITERACIONES", "03. XTAL CLEAR"].map((track, i) => (
                  <div key={i} className="text-sm text-gray-500 my-2">
                    ▶ {track}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* English */}
          <div className="mb-12 border-t border-gray-800 pt-8">
            <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
              LATEST RELEASE
            </div>
            <div className="text-center">
              <div className="text-2xl text-white mb-3 tracking-widest">
                EP &quot;ITERACIONES&quot;
              </div>
              <div className="text-sm text-gray-400 mb-6">
                August 2025 • YouTube Music
              </div>
              <div className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                Experimental Electronic Dance / Latin American Future Beats<br/>
                The EP &quot;Iterations&quot; emerges from mostly digital production sessions.
              </div>
            </div>
          </div>

          {/* Chinese */}
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
              最新发布
            </div>
            <div className="text-center">
              <div className="text-2xl text-white mb-3 tracking-widest">
                EP &quot;ITERACIONES&quot;
              </div>
              <div className="text-sm text-gray-400 mb-6">
                2025年8月 • YouTube Music
              </div>
              <div className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                实验电子舞曲 / 拉丁美洲未来节拍<br/>
                EP《迭代》诞生于主要的数字制作会话。
              </div>
            </div>
          </div>
        </div>

        {/* Platform Links */}
        <div className="bg-black border border-gray-700 p-10 text-center rounded mb-16">
          <div className="text-lg text-gray-400 mb-8 tracking-widest font-bold">
            PLATAFORMAS • PLATFORMS • 平台
          </div>
          <div className="space-x-3 space-y-3">
            <a
              href="https://music.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-gray-400 text-xs tracking-wider border border-gray-600 bg-gray-900/80 hover:bg-gray-800 transition-all"
            >
              [YOUTUBE MUSIC]
            </a>
            <a
              href="https://www.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-gray-400 text-xs tracking-wider border border-gray-600 bg-gray-900/80 hover:bg-gray-800 transition-all"
            >
              [YOUTUBE]
            </a>
            <a
              href="https://music.apple.com/us/artist/floraluz/1782261856"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-gray-400 text-xs tracking-wider border border-gray-600 bg-gray-900/80 hover:bg-gray-800 transition-all"
            >
              [APPLE MUSIC]
            </a>
          </div>
        </div>

        {/* Binary Message */}
        <div 
          className="border border-dashed bg-black/80 p-10 text-center rounded"
          style={{ borderColor: 'rgba(139, 69, 19, 0.3)' }}
        >
          <div className="text-gray-600 text-xs leading-relaxed tracking-widest opacity-80">
            01100101 01101100 00100000 01100001 01101101<br/>
            01101111 01110010 00100000 01100101 01110011<br/>
            00100000 01110100 01101111 01100100 01101111<br/>
            00100000 01101100 01101111 00100000 01110001<br/>
            01110101 01100101 00100000 01101000 01100001<br/>
            01111001
          </div>
        </div>

        {/* Contact */}
        <div className="text-center py-12 relative">
          {/* Psychedelic Text Left */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-red-900/15 text-xs tracking-widest opacity-40 rotate-12 hidden md:block">
            ◊∞◦∆◊∞◦∆◊∞◦∆<br/>
            ∇◈∴◊∇◈∴◊∇◈∴◊<br/>
            ◦∴∞◊◦∴∞◊◦∴∞◊
          </div>
          {/* Psychedelic Text Right */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-900/15 text-xs tracking-widest opacity-40 -rotate-12 hidden md:block">
            ∆◦∞◊∆◦∞◊∆◦∞◊<br/>
            ◊∴◈∇◊∴◈∇◊∴◈∇<br/>
            ◦∞∴◊◦∞∴◊◦∞∴◊
          </div>
          
          <div className="text-xs text-gray-600 tracking-wider opacity-70 mb-8">
            floraluz333@gmail.com
          </div>
          <div className="text-xs text-gray-600 tracking-widest opacity-20">
            [ .420 ]
          </div>
        </div>
      </div>
    </main>
  )
}