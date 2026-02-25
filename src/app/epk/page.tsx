'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function EPK() {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)
  const [activeProjectSlide, setActiveProjectSlide] = useState(0)
  const [activeReleaseSlide, setActiveReleaseSlide] = useState(0)
  const glyphPool = '0123456789!@#$%&*[]{}|<>?/\\ΩΨΦΣΠΛΘΔαβγδ∞∑√∫≠←→↑↓◊∆∇◈∴'

  const scramble = (text: string) =>
    text.split('').map(char =>
      char === ' ' || char === ',' ? char :
      Math.random() < 0.04
        ? glyphPool[Math.floor(Math.random() * glyphPool.length)]
        : char
    ).join('')

  const [s1, setS1] = useState('floraluz')
  const [s2, setS2] = useState('[ NOCHES EN VELA, VOL. II ]')
  const [s3, setS3] = useState('EP')
  const [s4, setS4] = useState('ÚLTIMO LANZAMIENTO')

  useEffect(() => {
    const interval = setInterval(() => {
      setS1(scramble('floraluz'))
      setS2(scramble('[ NOCHES EN VELA, VOL. II ]'))
      setS3(scramble('EP'))
      setS4(scramble('ÚLTIMO LANZAMIENTO'))
    }, 200)
    return () => clearInterval(interval)
  }, [])
  
  const projectSliderRef = useRef<HTMLDivElement>(null)

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
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-900/20 text-xs tracking-widest opacity-30 rotate-90 hidden md:block">
          ◊ ∞ ◦ ∆ ◊ ∞ ◦ ∆ ◊ ∞ ◦ ∆
        </div>
        {/* Psychedelic Text Right */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-900/20 text-xs tracking-widest opacity-30 -rotate-90 hidden md:block">
          ∇ ◈ ∴ ◊ ∇ ◈ ∴ ◊ ∇ ◈ ∴ ◊
        </div>
        
        <div
          className="text-5xl md:text-6xl text-white font-bold mb-4 tracking-widest inline-block"
          style={{
            fontFamily: 'Courier New, monospace',
            transform: 'scaleX(1.6)',
            transformOrigin: 'center',
            letterSpacing: '0.3em',
          }}
        >
          {s1}
        </div>

        {/* Single Title */}
        <div
          className="text-2xl md:text-3xl text-gray-300 font-mono tracking-widest mt-4 opacity-90"
          style={{ textShadow: '1px 1px 0 rgba(59, 130, 246, 0.3)' }}
        >
          {s2}
        </div>

        {/* Subtitle */}
        <div className="text-base text-gray-400 font-mono tracking-wider mt-2 opacity-80">
          {s3}
        </div>

        {/* Latest Release Label */}
        <div className="text-sm text-gray-300 font-mono tracking-wider mt-3 opacity-70">
          {s4}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block border p-8 bg-gray-900/20 rounded relative" style={{ borderColor: 'rgba(220, 38, 38, 0.15)' }}>
            <div className="relative">
              <Image
                src="/floraluz-cover.jpg"
                alt="floraluz - Cover Art"
                width={384}
                height={384}
                className="w-96 h-96 object-cover border border-dashed relative z-10"
                style={{
                  borderColor: 'rgba(220, 38, 38, 0.2)',
                  filter: 'sepia(0.3) saturate(0.8) contrast(1.1) brightness(0.9)',
                }}
              />

              {/* Red overlay effects */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: `
                    radial-gradient(circle at 10% 20%, rgba(220, 38, 38, 0.15) 0%, transparent 30%),
                    radial-gradient(circle at 90% 80%, rgba(185, 28, 28, 0.1) 0%, transparent 25%),
                    radial-gradient(circle at 30% 90%, rgba(248, 113, 113, 0.08) 0%, transparent 20%),
                    linear-gradient(45deg, transparent 0%, rgba(220, 38, 38, 0.05) 50%, transparent 100%)
                  `,
                  mixBlendMode: 'multiply'
                }}
              />

              {/* Analog scan lines */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(220, 38, 38, 0.3) 1px, rgba(220, 38, 38, 0.3) 2px)',
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
              <div className="absolute bottom-2 right-3 w-2 h-4 bg-gradient-to-tl from-red-800/20 to-transparent z-20"></div>
              <div className="absolute top-3 right-4 w-1 h-6 bg-red-800/15 transform rotate-12 z-20"></div>

              {/* Red dot */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full opacity-60 z-30"></div>
            </div>
          </div>
        </div>

        {/* Project Description Slider */}
        <div className="bg-black border p-10 rounded mb-16 relative overflow-hidden" style={{ borderColor: 'rgba(59, 130, 246, 0.12)' }}>
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
                      ? 'text-white border-b border-blue-500' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {item.label}
                  <span className="ml-2 text-[10px] opacity-60">{item.lang}</span>
                  {activeProjectSlide === index && (
                    <div className="inline-block ml-2 w-1 h-1 bg-blue-500 rounded-full opacity-60 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Slider Content */}
          <div 
            className="relative select-none cursor-grab active:cursor-grabbing w-full overflow-hidden"
            onTouchStart={(e) => handleTouchStart(e, 'project')}
            ref={projectSliderRef}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${activeProjectSlide * 33.333}%)`,
                width: '300%'
              }}
            >
              {/* Spanish */}
              <div className="flex-shrink-0 px-4" style={{ width: '33.333%' }}>
                <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
                  <strong className="text-white">floraluz</strong> es el proyecto musical de una persona encantada por las computadoras, la programación y los dispositivos electrónicos. El proyecto nace dentro de una vida donde se debe balancear el estar detrás de un ordenador con la necesidad creativa de expresar música.
                  <br/><br/>
                  El último EP de floraluz, <em>noches en vela, Vol. II</em>, de forma similar al Vol. I, expresa lo que se sienten días que son largos pero parecen cortos, y noches cortas que se sienten largas por el tiempo que se dedica a expresar emociones a través de sonidos, ritmos, melodías y armonías.
                </div>
              </div>

              {/* English */}
              <div className="flex-shrink-0 px-4" style={{ width: '33.333%' }}>
                <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
                  <strong className="text-white">floraluz</strong> is the musical project of someone fascinated by computers, programming, and electronic devices. The project emerges from a life where being in front of a screen must be balanced with the creative need to express music.
                  <br/><br/>
                  floraluz&apos;s latest EP, <em>noches en vela, Vol. II</em>, similarly to Vol. I, captures what it feels like to live days that are long but seem short, and short nights that feel long because of the time spent channeling emotions through sounds, rhythms, melodies, and harmonies.
                </div>
              </div>

              {/* Chinese */}
              <div className="flex-shrink-0 px-4" style={{ width: '33.333%' }}>
                <div className="text-sm text-gray-300 leading-relaxed max-w-4xl mx-auto text-justify">
                  <strong className="text-white">floraluz</strong> 是一个深深着迷于计算机、编程和电子设备的人的音乐项目。这个项目诞生于一种需要在屏幕前的工作与通过音乐表达创造力之间寻求平衡的生活之中。
                  <br/><br/>
                  floraluz 的最新 EP，<em>noches en vela, Vol. II</em>，与第一卷相似，表达了那种感觉——漫长却似乎转瞬即逝的白昼，以及因为用来通过声音、节奏、旋律和和声倾注情感而显得格外漫长的短暂夜晚。
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
                  ? 'border-blue-500/30 text-blue-400 hover:border-blue-500/60 hover:bg-blue-950/20'
                  : 'border-gray-700/30 text-gray-600 cursor-not-allowed'
              }`}
            >
              ←
            </button>
            <button
              onClick={() => activeProjectSlide < 2 && setActiveProjectSlide(activeProjectSlide + 1)}
              className={`pointer-events-auto p-2 rounded-full border transition-all ${
                activeProjectSlide < 2
                  ? 'border-blue-500/30 text-blue-400 hover:border-blue-500/60 hover:bg-blue-950/20'
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
                    ? 'bg-blue-500 opacity-80' 
                    : 'bg-gray-600 opacity-30 hover:opacity-50'
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Single Player */}
        <div className="bg-black border border-dashed p-10 rounded mb-16" style={{ borderColor: 'rgba(59, 130, 246, 0.15)' }}>
          <div className="text-center text-lg text-gray-400 mb-8 tracking-widest font-bold">
            ESCUCHAR • LISTEN • 收听 EP
            <div className="text-xs text-blue-900/30 mt-2 tracking-wider">
              [ audio_stream.ready ]
            </div>
            <div className="text-xs text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
              EP 2025 • NOCHES EN VELA, VOL. II • 2025年EP
            </div>
          </div>
          
          {/* Single Cover Image */}
          <div className="text-center mb-8">
            <div className="inline-block border p-6 bg-gray-900/20 rounded relative" style={{ borderColor: 'rgba(59, 130, 246, 0.15)' }}>
              <div className="relative">
                <Image
                  src="/floranevIIdef.png"
                  alt="noches en vela, Vol. II - Cover Art"
                  width={320}
                  height={320}
                  className="w-80 h-80 object-cover border border-dashed relative z-10"
                  style={{
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                    filter: 'sepia(0.2) saturate(0.9) contrast(1.05) brightness(0.95)',
                  }}
                />
                
                {/* Golden overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-20 opacity-60"
                  style={{
                    background: `
                      radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 25%),
                      radial-gradient(circle at 85% 75%, rgba(37, 99, 235, 0.06) 0%, transparent 20%)
                    `,
                    mixBlendMode: 'multiply'
                  }}
                />
                
                {/* Small golden indicator */}
                <div className="absolute top-1 right-1 w-1 h-1 bg-blue-500 rounded-full opacity-70 z-30"></div>
              </div>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { track: "1. hasta mañana, te amo", accent: true, file: "1.- hasta mañana, te amo.wav" },
              { track: "2. Bucles Abiertos", accent: false, file: "2.- Bucles Abiertos.wav" },
              { track: "3. Untitled 7 (floraluz Remix)", accent: false, file: "3.- Untitled 7 (floraluz Remix).wav" },
              { track: "4. Cerezo", accent: false, file: "4.- Cerezo.wav" },
              { track: "5. MBP2012", accent: false, file: "5.- macbookpro2012.wav" },
              { track: "6. si la noche tuviese más horas", accent: false, file: "6.- si la noche tuviese más horas.wav" },
            ].map((item, i) => (
              <div key={i} className={`p-4 border ${item.accent ? 'bg-blue-950/10 border-blue-900/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-bold text-sm tracking-wide">{item.track}</div>
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
                    filter: 'sepia(1) hue-rotate(40deg) saturate(0.8)',
                    background: 'transparent'
                  }}
                  onPlay={() => handleAudioPlay(i)}
                  onPause={handleAudioPause}
                  onEnded={handleAudioEnded}
                >
                  <source src={`/${encodeURIComponent(item.file)}`} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
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
          style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
        >
          <div className="text-gray-600 text-xs leading-relaxed tracking-widest opacity-80">
            01110010 01110101 01100111 01101001 01100100<br/>
            01101111 00100000 01100100 01101111 01110010<br/>
            01100001 01100100 01101111 00100000 01100101<br/>
            01101110 00100000 01101100 01100001 00100000<br/>
            01101111 01110011 01100011 01110101 01110010<br/>
            01101001 01100100 01100001 01100100
          </div>
        </div>

        {/* Contact */}
        <div className="text-center py-12 relative">
          {/* Psychedelic Text Left */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-blue-900/15 text-xs tracking-widest opacity-40 rotate-12 hidden md:block">
            ◊∞◦∆◊∞◦∆◊∞◦∆<br/>
            ∇◈∴◊∇◈∴◊∇◈∴◊<br/>
            ◦∴∞◊◦∴∞◊◦∴∞◊
          </div>
          {/* Psychedelic Text Right */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-blue-900/15 text-xs tracking-widest opacity-40 -rotate-12 hidden md:block">
            ∆◦∞◊∆◦∞◊∆◦∞◊<br/>
            ◊∴◈∇◊∴◈∇◊∴◈∇<br/>
            ◦∞∴◊◦∞∴◊◦∞∴◊
          </div>
          
          <div className="text-xs text-gray-600 tracking-wider opacity-70 mb-8">
            floraluz333@gmail.com
          </div>
          <div className="text-[9px] text-gray-600 tracking-wider opacity-40">
            [ 420 :: floraluz.floraluz.floraluz ]
          </div>
        </div>
      </div>
    </main>
  )
}