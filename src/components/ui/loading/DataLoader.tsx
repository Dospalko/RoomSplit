'use client';

import { useEffect, useState } from 'react';

interface DataLoaderProps {
  isLoading: boolean;
  type?: 'bars' | 'dots' | 'pulse' | 'wave' | 'spinner';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function DataLoader({ 
  isLoading, 
  type = 'bars', 
  size = 'md', 
  className = '' 
}: DataLoaderProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const renderLoader = () => {
    switch (type) {
      case 'bars':
        return (
          <div className={`flex items-end gap-1 ${sizeClasses[size]}`}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-bounce`}
                style={{
                  height: `${25 + (i + animationPhase) % 4 * 25}%`,
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );

      case 'dots':
        return (
          <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-full h-full animate-pulse"></div>
          </div>
        );

      case 'wave':
        return (
          <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-blue-500 via-purple-500 to-emerald-500 rounded-full"
                style={{
                  height: '100%',
                  animation: 'wave 1.5s ease-in-out infinite',
                  animationDelay: `${i * 100}ms`,
                  transform: `scaleY(${0.3 + Math.sin((animationPhase + i) * 0.5) * 0.7})`
                }}
              />
            ))}
          </div>
        );

      case 'spinner':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
            {/* Inner ring */}
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-500 border-l-amber-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}></div>
            {/* Center dot */}
            <div className="absolute inset-1/3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderLoader()}
      
      <style jsx>{`
        @keyframes wave {
          0%, 40%, 100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
