'use client';

interface PageLoaderProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-gray-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-24 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-emerald-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Premium loading animation */}
        <div className="relative mb-8">
          {/* Outer rotating rings */}
          <div className="absolute inset-0 w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500/60 border-r-purple-500/60 animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-emerald-500/60 border-l-pink-500/60 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-amber-500/60 border-r-cyan-500/60 animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>

          {/* Center icon with glow */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-slate-800 via-gray-800 to-black flex items-center justify-center shadow-2xl border border-slate-600/50 backdrop-blur-sm">
              <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Pulsing glow effect */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 blur-xl animate-pulse"></div>
          </div>
        </div>

        {/* Elegant brand name with gradient */}
        <div className="relative">
          <h2 className="text-4xl font-bold font-mono bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent mb-2 tracking-wider">
            RoomSplit
          </h2>
          
          {/* Animated underline */}
          <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"></div>
        </div>

        {/* Floating loading dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <style jsx>{`
        @keyframes simple-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
