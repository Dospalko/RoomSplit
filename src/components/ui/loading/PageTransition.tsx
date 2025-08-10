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
          duration = 400, 
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
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"
        style={getTransitionStyle()}
      >
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"
            style={{
              transform: `translateX(${progress * 100}px)`,
            }}
          />
        </div>
        
        {/* Loading content */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            {/* Simple animated icon */}
            <div className="relative mb-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full border-2 border-gray-600 border-t-gray-300 animate-spin"
                style={{ animationDuration: '0.8s' }}
              />
              <div className="absolute inset-4 rounded-full bg-gray-800/40 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
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
