'use client';

import { useEffect, useState } from 'react';

interface PageTransitionProps {
  isLoading: boolean;
  onComplete?: () => void;
  direction?: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
  duration?: number;
}

export default function PageTransition({ 
  isLoading, 
  onComplete, 
  direction = 'horizontal',
  duration = 800 
}: PageTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(elapsed / duration, 1);
        setProgress(newProgress);
        
        if (newProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 200);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isLoading, duration, onComplete]);

  if (!isVisible) return null;

  const getTransitionStyle = () => {
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    switch (direction) {
      case 'horizontal':
        return {
          transform: `translateX(${-100 + easeOut * 100}%)`,
        };
      case 'vertical':
        return {
          transform: `translateY(${-100 + easeOut * 100}%)`,
        };
      case 'diagonal':
        return {
          transform: `translate(${-100 + easeOut * 100}%, ${-100 + easeOut * 100}%)`,
        };
      case 'radial':
        return {
          clipPath: `circle(${easeOut * 150}% at 50% 50%)`,
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Main transition overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"
        style={getTransitionStyle()}
      >
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"
            style={{
              transform: `translateX(${progress * 100}px)`,
            }}
          />
        </div>
        
        {/* Loading content */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            {/* Animated logo */}
            <div className="relative mb-6">
              <div 
                className="w-20 h-20 mx-auto rounded-full border-4 border-white/30 border-t-white animate-spin"
                style={{ animationDuration: '1s' }}
              />
              <div className="absolute inset-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            {/* Brand text */}
            <h2 className="text-3xl font-bold">RoomSplit</h2>
            <p className="text-white/80 text-lg">Loading your experience...</p>
            
            {/* Progress bar */}
            <div className="w-64 mx-auto mt-6">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/80 rounded-full transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="text-sm text-white/60 mt-2">
                {Math.round(progress * 100)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: `${10 + (i * 8)}%`,
                top: `${20 + (i * 5)}%`,
                animation: `float 2s ease-in-out infinite`,
                animationDelay: `${i * 150}ms`,
                transform: `translateY(${Math.sin(progress * Math.PI * 2 + i) * 20}px)`,
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
