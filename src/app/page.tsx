export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-16">
          <div>
            <h1 
              className="text-7xl md:text-8xl font-light tracking-wider mb-8"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              floraluz
            </h1>
            <div className="h-px bg-white/20 w-48 mx-auto"></div>
          </div>
          
          {/* Multilingual description */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-gray-400 text-sm tracking-widest uppercase">
                Electronic Music Producer
              </p>
              <p className="text-gray-400 text-sm tracking-widest uppercase">
                Productor de Música Electrónica
              </p>
              <p className="text-gray-400 text-sm tracking-widest">
                电子音乐制作人
              </p>
            </div>
            
            
            <div className="flex space-x-6 justify-center text-xs mt-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                MUSIC • MÚSICA • 音乐
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                CONTACT • CONTACTO • 联系
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 text-xs text-gray-600 tracking-widest">
          floraluz333@gmail.com
        </div>
      </div>
    </main>
  )
}