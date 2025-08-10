'use client';

import { useEffect, useState } from 'react';

interface PageLoaderProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export default function PageLoader({ isLoading, progress = 0, message = "Loading amazing features..." }: PageLoaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isLoading) {
      // Animate progress bar smoothly
      const interval = setInterval(() => {
        setDisplayProgress(prev => {
          const target = progress || Math.min(prev + Math.random() * 15, 95);
          return prev < target ? prev + 2 : target;
        });
      }, 100);

      // Animate dots
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);

      return () => {
        clearInterval(interval);
        clearInterval(dotsInterval);
      };
    } else {
      setDisplayProgress(100);
      setTimeout(() => setDisplayProgress(0), 500);
    }
  }, [isLoading, progress]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20 backdrop-blur-sm">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40 animate-pulse"></div>
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${
              i % 4 === 0 ? 'from-blue-400 to-indigo-500' :
              i % 4 === 1 ? 'from-purple-400 to-pink-500' :
              i % 4 === 2 ? 'from-emerald-400 to-teal-500' :
              'from-amber-400 to-orange-500'
            } rounded-full opacity-60`}
            style={{
              left: `${10 + (i * 10)}%`,
              top: `${20 + (i * 5)}%`,
              animation: `float-${i % 3} 3s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Spinning Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
            {/* Inner counter-rotating ring */}
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-500 border-l-amber-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Center logo */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Pulsing Glow Effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-xl animate-pulse"></div>
        </div>

        {/* Brand Name with Typewriter Effect */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-2">
          RoomSplit
        </h2>

        {/* Loading Message */}
        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
          {message}{dots}
        </p>

        {/* Progress Bar */}
        <div className="relative mb-6">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${displayProgress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="text-center mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            {Math.round(displayProgress)}%
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className={`flex items-center gap-2 transition-opacity duration-500 ${displayProgress > 20 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-2 h-2 rounded-full ${displayProgress > 20 ? 'bg-emerald-500' : 'bg-slate-300'} transition-colors`}></div>
            <span>Initializing components...</span>
          </div>
          <div className={`flex items-center gap-2 transition-opacity duration-500 ${displayProgress > 50 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-2 h-2 rounded-full ${displayProgress > 50 ? 'bg-emerald-500' : 'bg-slate-300'} transition-colors`}></div>
            <span>Loading analytics engine...</span>
          </div>
          <div className={`flex items-center gap-2 transition-opacity duration-500 ${displayProgress > 80 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-2 h-2 rounded-full ${displayProgress > 80 ? 'bg-emerald-500' : 'bg-slate-300'} transition-colors`}></div>
            <span>Preparing premium experience...</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
