export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden" style={{ animation: 'colorInvert 6s infinite' }}>
      {/* Analog noise background with animation */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(139, 69, 19, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)
          `,
          filter: 'blur(40px)',
          animation: 'analogNoise 4s infinite ease-in-out'
        }}
      />
      
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            repeating-conic-gradient(from 0deg, 
              transparent 0deg, 
              rgba(255, 255, 255, 0.02) 1deg, 
              transparent 2deg, 
              rgba(220, 38, 38, 0.01) 3deg,
              transparent 4deg
            )
          `,
          backgroundSize: '4px 4px',
          animation: 'filmGrain 0.2s infinite linear'
        }}
      />
      
      {/* VHS static overlay */}
      <div 
        className="absolute inset-0 opacity-[0.008] pointer-events-none"
        style={{
          background: `
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%),
            linear-gradient(0deg, transparent 0%, rgba(220,38,38,0.02) 50%, transparent 100%)
          `,
          backgroundSize: '200px 100vh, 100vw 300px',
          animation: 'vhsStatic 8s infinite linear'
        }}
      />
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          animation: 'scanlines 8s linear infinite'
        }}
      />

      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        <div className="text-center space-y-16">
          <div className="relative">
            {/* Glitch layers for floraluz title */}
            <h1 
              className="text-7xl md:text-8xl font-light tracking-wider mb-8 relative"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              {/* Main text */}
              <span className="relative z-30">floraluz</span>
              
              {/* Glitch layer 1 - red shift */}
              <span 
                className="absolute top-0 left-0 text-red-500/30 z-10"
                style={{
                  transform: 'translate(-2px, 0)',
                  animation: 'glitch1 3s infinite',
                  clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
                }}
              >
                floraluz
              </span>
              
              {/* Glitch layer 2 - blue shift */}
              <span 
                className="absolute top-0 left-0 text-blue-400/20 z-20"
                style={{
                  transform: 'translate(2px, 0)',
                  animation: 'glitch2 3s infinite reverse',
                  clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
                }}
              >
                floraluz
              </span>
              
              {/* Static noise overlay on text */}
              <div 
                className="absolute inset-0 z-40 pointer-events-none opacity-10"
                style={{
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(220, 38, 38, 0.3) 1px, rgba(220, 38, 38, 0.3) 2px)',
                  animation: 'staticNoise 0.1s infinite'
                }}
              />
            </h1>
            
            {/* Glitched divider line */}
            <div className="relative">
              <div className="h-px bg-white/20 w-48 mx-auto"></div>
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 h-px bg-red-900/40 w-48"
                style={{ animation: 'lineGlitch 4s infinite' }}
              />
            </div>
            
            {/* Rust particles */}
            <div className="absolute -top-8 -left-8 w-2 h-2 bg-red-900/20 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -top-4 right-12 w-1 h-1 bg-orange-800/30 rounded-full opacity-40"></div>
            <div className="absolute -bottom-6 left-16 w-1 h-1 bg-red-800/40 rounded-full opacity-50"></div>
          </div>
          
          {/* Multilingual description with analog distortion */}
          <div className="space-y-8 relative">
            <div className="space-y-4">
              <p className="text-gray-400 text-sm tracking-widest uppercase relative">
                Electronic Music Producer
                <span className="absolute inset-0 text-red-900/10 transform translate-x-px">Electronic Music Producer</span>
              </p>
              <p className="text-gray-400 text-sm tracking-widest uppercase relative">
                Productor de Música Electrónica
                <span className="absolute inset-0 text-orange-900/15 transform -translate-x-px">Productor de Música Electrónica</span>
              </p>
              <p className="text-gray-400 text-sm tracking-widest relative">
                电子音乐制作人
                <span className="absolute inset-0 text-red-800/20 transform translate-y-px">电子音乐制作人</span>
              </p>
            </div>
            
            {/* More rust particles around text */}
            <div className="absolute -top-2 left-8 w-px h-px bg-red-900/30 opacity-70"></div>
            <div className="absolute top-12 -right-4 w-1 h-1 bg-orange-700/25 rounded-full opacity-60"></div>
            <div className="absolute bottom-0 left-1/3 w-px h-px bg-red-800/40"></div>
          </div>
        </div>
        
        {/* Music store links */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className="flex space-x-6 justify-center mb-8 text-xs">
            <a
              href="https://music.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors tracking-wider relative"
            >
              YOUTUBE MUSIC
              <span 
                className="absolute inset-0 text-red-900/10 transform translate-x-px opacity-0 hover:opacity-100 transition-opacity"
              >
                YOUTUBE MUSIC
              </span>
            </a>
            <span className="text-gray-800">•</span>
            <a
              href="https://www.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors tracking-wider relative"
            >
              YOUTUBE
              <span 
                className="absolute inset-0 text-red-900/10 transform translate-x-px opacity-0 hover:opacity-100 transition-opacity"
              >
                YOUTUBE
              </span>
            </a>
            <span className="text-gray-800">•</span>
            <a
              href="https://music.apple.com/us/artist/floraluz/1782261856"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors tracking-wider relative"
            >
              APPLE MUSIC
              <span 
                className="absolute inset-0 text-red-900/10 transform translate-x-px opacity-0 hover:opacity-100 transition-opacity"
              >
                APPLE MUSIC
              </span>
            </a>
          </div>
        </div>

        {/* Bottom email with analog distortion */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 tracking-widest text-center">
          <div className="relative inline-block">
            <span className="relative z-10">floraluz333@gmail.com</span>
            <span 
              className="absolute inset-0 text-red-900/15 transform translate-x-px"
              style={{ animation: 'emailGlitch 5s infinite' }}
            >
              floraluz333@gmail.com
            </span>
            
            {/* Terminal-style cursor */}
            <span 
              className="ml-1 text-red-800/60"
              style={{ animation: 'blink 1s infinite' }}
            >
              _
            </span>
          </div>
        </div>
        
        {/* Analog artifacts scattered around */}
        <div className="absolute top-20 left-10 w-px h-2 bg-red-900/20 opacity-50 transform rotate-12"></div>
        <div className="absolute top-1/3 right-20 w-1 h-px bg-orange-800/30 opacity-40"></div>
        <div className="absolute bottom-32 left-16 w-px h-3 bg-red-800/25 opacity-60 transform -rotate-6"></div>
        <div className="absolute bottom-20 right-12 w-2 h-px bg-red-900/20 opacity-50"></div>
      </div>

    </main>
  )
}