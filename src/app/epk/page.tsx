'use client'
import { useState, useRef, useEffect } from 'react'

export default function EPK() {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)
  const [activeProjectSlide, setActiveProjectSlide] = useState(0)
  const [activeReleaseSlide, setActiveReleaseSlide] = useState(0)
  
  const projectSliderRef = useRef<HTMLDivElement>(null)
  const releaseSliderRef = useRef<HTMLDivElement>(null)

  // Touch handling for sliders
  const handleTouchStart = (e: React.TouchEvent, sliderType: 'project' | 'release') => {
    const touch = e.touches[0]
    const startX = touch.clientX
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const diffX = startX - touch.clientX
      
      if (Math.abs(diffX) > 50) {
        if (sliderType === 'project') {
          if (diffX > 0 && activeProjectSlide < 2) {
            setActiveProjectSlide(activeProjectSlide + 1)
          } else if (diffX < 0 && activeProjectSlide > 0) {
            setActiveProjectSlide(activeProjectSlide - 1)
          }
        } else {
          if (diffX > 0 && activeReleaseSlide < 2) {
            setActiveReleaseSlide(activeReleaseSlide + 1)
          } else if (diffX < 0 && activeReleaseSlide > 0) {
            setActiveReleaseSlide(activeReleaseSlide - 1)
          }
        }
        
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (activeProjectSlide > 0) setActiveProjectSlide(activeProjectSlide - 1)
        if (activeReleaseSlide > 0) setActiveReleaseSlide(activeReleaseSlide - 1)
      } else if (e.key === 'ArrowRight') {
        if (activeProjectSlide < 2) setActiveProjectSlide(activeProjectSlide + 1)
        if (activeReleaseSlide < 2) setActiveReleaseSlide(activeReleaseSlide + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeProjectSlide, activeReleaseSlide])

  const handleAudioPlay = (index: number) => {
    setPlayingTrack(index)
  }

  const handleAudioPause = () => {
    setPlayingTrack(null)
  }

  const handleAudioEnded = () => {
    setPlayingTrack(null)
  }

  return (
    <main className="min-h-screen bg-black text-gray-300 font-mono">
      {/* Header */}
      <div className="text-center py-16 px-5 border-b border-gray-800 bg-black relative">
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
          <div className="inline-block border p-8 bg-gray-900/20 rounded relative" style={{ borderColor: 'rgba(220, 38, 38, 0.15)' }}>
            <div className="relative">
              <img 
                src="/floraluz-cover.jpg" 
                alt="floraluz - Cover Art" 
                className="w-96 h-72 object-cover border border-dashed relative z-10"
                style={{ 
                  borderColor: 'rgba(220, 38, 38, 0.2)',
                  filter: 'sepia(0.3) saturate(0.8) contrast(1.1) brightness(0.9)',
                }}
              />
              
              {/* Rust overlay effects */}
              <div 
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: `
                    radial-gradient(circle at 10% 20%, rgba(139, 69, 19, 0.15) 0%, transparent 30%),
                    radial-gradient(circle at 90% 80%, rgba(220, 38, 38, 0.1) 0%, transparent 25%),
                    radial-gradient(circle at 30% 90%, rgba(184, 115, 51, 0.08) 0%, transparent 20%),
                    linear-gradient(45deg, transparent 0%, rgba(139, 69, 19, 0.05) 50%, transparent 100%)
                  `,
                  mixBlendMode: 'multiply'
                }}
              />
              
              {/* Analog scan lines */}
              <div 
                className="absolute inset-0 pointer-events-none z-20 opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(139, 69, 19, 0.3) 1px, rgba(139, 69, 19, 0.3) 2px)',
                  animation: 'scanlines 4s linear infinite'
                }}
              />
              
              {/* VHS distortion */}
              <div 
                className="absolute inset-0 pointer-events-none z-20 opacity-10"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(220, 38, 38, 0.2) 2%, transparent 4%)',
                  backgroundSize: '100px 100%',
                  animation: 'vhsDistortion 6s infinite linear'
                }}
              />
              
              {/* Corner wear effects */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-br from-red-900/30 to-transparent rounded-full z-20"></div>
              <div className="absolute bottom-2 right-3 w-2 h-4 bg-gradient-to-tl from-orange-800/20 to-transparent z-20"></div>
              <div className="absolute top-3 right-4 w-1 h-6 bg-red-800/15 transform rotate-12 z-20"></div>
              
              {/* Original red dot */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full opacity-60 z-30"></div>
            </div>
          </div>
        </div>

        {/* Project Description Slider */}
        <div className="bg-black border p-10 rounded mb-16 relative overflow-hidden" style={{ borderColor: 'rgba(220, 38, 38, 0.12)' }}>
          {/* Slider Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {[
                { label: "PROYECTO", lang: "ES" },
                { label: "PROJECT", lang: "EN" },
                { label: "项目", lang: "中文" }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveProjectSlide(index)}
                  className={`px-4 py-2 text-xs tracking-widest font-bold transition-all ${
                    activeProjectSlide === index 
                      ? 'text-white border-b border-red-500' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {item.label}
                  <span className="ml-2 text-[10px] opacity-60">{item.lang}</span>
                  {activeProjectSlide === index && (
                    <div className="inline-block ml-3 w-1 h-1 bg-red-500 rounded-full opacity-40"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Slider Content */}
          <div 
            className="relative select-none cursor-grab active:cursor-grabbing"
            onTouchStart={(e) => handleTouchStart(e, 'project')}
            ref={projectSliderRef}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out touch-scroll scrollbar-hide sm:overflow-x-auto md:overflow-hidden"
              style={{ transform: `translateX(-${activeProjectSlide * 100}%)` }}
            >
              {/* Spanish */}
              <div className="w-full flex-shrink-0 px-4 min-w-full">
                <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
                  <strong className="text-white">floraluz</strong> navega entre electronic dance y ambient. 
                  Una propuesta que documenta estados emocionales a través de paisajes sonoros que fusionan lo crudo con lo visionario.
                  <br/><br/>
                  Nuestro sonido está marcado por el frenesí del mundo moderno donde todo parece ir tan rápido, pero al mismo tiempo toma mucha inspiración de la naturaleza y la sutileza de los detalles que pasan desapercibidos para alguien que vive la mayoría del tiempo en una ciudad con una vida que va deprisa.
                  <br/><br/>
                  Grooves hipnóticos procesados digitalmente con texturas que evocan nostalgia y calidez. 
                  Future soul y electronic R&B desde una propuesta latinoamericana.
                  <div className="text-xs text-red-900/40 mt-4 opacity-60 tracking-widest">
                    [ analog_saturation.enabled ]
                  </div>
                </div>
              </div>
              
              {/* English */}
              <div className="w-full flex-shrink-0 px-4 min-w-full">
                <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
                  <strong className="text-white">floraluz</strong> navigates between electronic dance and ambient. 
                  A proposal that documents emotional states through soundscapes that fuse the raw with the visionary.
                  <br/><br/>
                  Our sound is marked by the frenzy of the modern world where everything seems to move so fast, but at the same time draws much inspiration from nature and the subtlety of details that go unnoticed by someone who spends most of their time in a city living a fast-paced life.
                  <br/><br/>
                  Hypnotic grooves digitally processed with textures that evoke nostalgia and warmth. 
                  Future soul and electronic R&B from a Latin American perspective.
                  <div className="text-xs text-red-900/40 mt-4 opacity-60 tracking-widest">
                    [ analog_saturation.enabled ]
                  </div>
                </div>
              </div>

              {/* Chinese */}
              <div className="w-full flex-shrink-0 px-4 min-w-full">
                <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
                  <strong className="text-white">floraluz</strong> 在电子舞曲和环境音乐之间航行。
                  这是一个通过声音景观记录情感状态的提案，将原始与幻想融合在一起。
                  <br/><br/>
                  我们的声音被现代世界的狂热所标记，一切似乎都在快速运转，但同时从自然中汲取大量灵感，关注那些对于大部分时间生活在城市快节奏生活中的人来说容易被忽视的细微之处。
                  <br/><br/>
                  数字化处理的催眠节拍，带有唤起怀旧和温暖感的纹理。
                  来自拉丁美洲视角的未来灵魂乐和电子R&B。
                  <div className="text-xs text-red-900/40 mt-4 opacity-60 tracking-widest">
                    [ analog_saturation.enabled ]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-4 pointer-events-none">
            <button
              onClick={() => activeProjectSlide > 0 && setActiveProjectSlide(activeProjectSlide - 1)}
              className={`pointer-events-auto p-2 rounded-full border transition-all ${
                activeProjectSlide > 0
                  ? 'border-red-500/30 text-red-400 hover:border-red-500/60 hover:bg-red-950/20'
                  : 'border-gray-700/30 text-gray-600 cursor-not-allowed'
              }`}
            >
              ←
            </button>
            <button
              onClick={() => activeProjectSlide < 2 && setActiveProjectSlide(activeProjectSlide + 1)}
              className={`pointer-events-auto p-2 rounded-full border transition-all ${
                activeProjectSlide < 2
                  ? 'border-red-500/30 text-red-400 hover:border-red-500/60 hover:bg-red-950/20'
                  : 'border-gray-700/30 text-gray-600 cursor-not-allowed'
              }`}
            >
              →
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setActiveProjectSlide(index)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  activeProjectSlide === index 
                    ? 'bg-red-500 opacity-80' 
                    : 'bg-gray-600 opacity-30 hover:opacity-50'
                }`}
              ></button>
            ))}
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
              { track: "01. ERES TÚ", duration: "3:19", accent: true, file: "eres-tu.mp3" },
              { track: "02. ITERACIONES", duration: "3:15", accent: false, file: "iteraciones.mp3" },
              { track: "03. XTAL CLEAR", duration: "1:17", accent: true, file: "xtal-clear.mp3" }
            ].map((item, i) => (
              <div key={i} className={`p-4 border ${item.accent ? 'bg-red-950/10 border-red-900/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-bold text-sm tracking-wide">{item.track}</div>
                    <div className="text-gray-500 text-xs">{item.duration}</div>
                  </div>
                  <div className="text-gray-600 text-xs tracking-widest">
                    [ {playingTrack === i ? 'STOP • 停止' : 'PLAY • 播放'} ]
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
                  onPlay={() => handleAudioPlay(i)}
                  onPause={handleAudioPause}
                  onEnded={handleAudioEnded}
                >
                  <source src={`/${item.file}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Release Slider */}
        <div 
          className="bg-black border p-10 rounded mb-16 relative overflow-hidden"
          style={{ borderColor: 'rgba(139, 69, 19, 0.15)' }}
        >
          {/* Slider Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {[
                { label: "ÚLTIMO LANZAMIENTO", lang: "ES" },
                { label: "LATEST RELEASE", lang: "EN" },
                { label: "最新发布", lang: "中文" }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveReleaseSlide(index)}
                  className={`px-4 py-2 text-xs tracking-widest font-bold transition-all ${
                    activeReleaseSlide === index 
                      ? 'text-white border-b border-orange-600' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {item.label}
                  <span className="ml-2 text-[10px] opacity-60">{item.lang}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slider Content */}
          <div 
            className="relative select-none cursor-grab active:cursor-grabbing"
            onTouchStart={(e) => handleTouchStart(e, 'release')}
            ref={releaseSliderRef}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out touch-scroll scrollbar-hide sm:overflow-x-auto md:overflow-hidden"
              style={{ transform: `translateX(-${activeReleaseSlide * 100}%)` }}
            >
              {/* Spanish */}
              <div className="w-full flex-shrink-0 px-4 min-w-full">
                <div className="text-center">
                  <div className="text-2xl text-white mb-3 tracking-widest">
                    EP &quot;ITERACIONES&quot;
                  </div>
                  <div className="text-sm text-gray-400 mb-6">
                    Agosto 2025 • YouTube Music
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                    Electronic Dance / Future Beats Latinoamericano<br/>
                    El EP &quot;Iteraciones&quot; nace de sesiones de producción mayormente digital.
                  </div>
                </div>
              </div>
              
              {/* English */}
              <div className="w-full flex-shrink-0 px-4 min-w-full">
                <div className="text-center">
                  <div className="text-2xl text-white mb-3 tracking-widest">
                    EP &quot;ITERACIONES&quot;
                  </div>
                  <div className="text-sm text-gray-400 mb-6">
                    August 2025 • YouTube Music
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                    Electronic Dance / Latin American Future Beats<br/>
                    The EP &quot;Iterations&quot; emerges from mostly digital production sessions.
                  </div>
                </div>
              </div>

              {/* Chinese */}
              <div className="w-full flex-shrink-0 px-4 min-w-full">
                <div className="text-center">
                  <div className="text-2xl text-white mb-3 tracking-widest">
                    EP &quot;ITERACIONES&quot;
                  </div>
                  <div className="text-sm text-gray-400 mb-6">
                    2025年8月 • YouTube Music
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                    电子舞曲 / 拉丁美洲未来节拍<br/>
                    EP《迭代》诞生于主要的数字制作会话。
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shared EP Cover Image and Track List (always visible) */}
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block border p-8 bg-gray-900/20 rounded relative" style={{ borderColor: 'rgba(220, 38, 38, 0.15)' }}>
                <div className="relative">
                  <img 
                    src="/floraluz-ep-cover.jpg" 
                    alt="EP ITERACIONES - Cover Art" 
                    className="w-96 h-72 object-cover border border-dashed relative z-10"
                    style={{ 
                      borderColor: 'rgba(220, 38, 38, 0.2)',
                      filter: 'sepia(0.2) saturate(0.9) contrast(1.05) brightness(0.95)',
                    }}
                  />
                  
                  {/* Subtle rust overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-20 opacity-60"
                    style={{
                      background: `
                        radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.08) 0%, transparent 25%),
                        radial-gradient(circle at 85% 75%, rgba(220, 38, 38, 0.06) 0%, transparent 20%)
                      `,
                      mixBlendMode: 'multiply'
                    }}
                  />
                  
                  {/* Small red indicator */}
                  <div className="absolute top-1 right-1 w-1 h-1 bg-red-600 rounded-full opacity-70 z-30"></div>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-black/40 p-8 mx-auto max-w-md border border-dashed"
              style={{ borderColor: 'rgba(139, 69, 19, 0.3)' }}
            >
              <div className="text-sm text-gray-400 mb-4 tracking-wider">
                {activeReleaseSlide === 0 ? "CONTENIDO" : 
                 activeReleaseSlide === 1 ? "TRACKLIST" : "曲目单"}
              </div>
              {["01. ERES TÚ", "02. ITERACIONES", "03. XTAL CLEAR"].map((track, i) => (
                <div key={i} className="text-sm text-gray-500 my-2">
                  ▶ {track}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-4 pointer-events-none">
            <button
              onClick={() => activeReleaseSlide > 0 && setActiveReleaseSlide(activeReleaseSlide - 1)}
              className={`pointer-events-auto p-2 rounded-full border transition-all ${
                activeReleaseSlide > 0
                  ? 'border-orange-600/30 text-orange-400 hover:border-orange-600/60 hover:bg-orange-950/20'
                  : 'border-gray-700/30 text-gray-600 cursor-not-allowed'
              }`}
            >
              ←
            </button>
            <button
              onClick={() => activeReleaseSlide < 2 && setActiveReleaseSlide(activeReleaseSlide + 1)}
              className={`pointer-events-auto p-2 rounded-full border transition-all ${
                activeReleaseSlide < 2
                  ? 'border-orange-600/30 text-orange-400 hover:border-orange-600/60 hover:bg-orange-950/20'
                  : 'border-gray-700/30 text-gray-600 cursor-not-allowed'
              }`}
            >
              →
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setActiveReleaseSlide(index)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  activeReleaseSlide === index 
                    ? 'bg-orange-600 opacity-80' 
                    : 'bg-gray-600 opacity-30 hover:opacity-50'
                }`}
              ></button>
            ))}
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