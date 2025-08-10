'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageTransition } from '@/components';

interface TransitionContextType {
  startTransition: () => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  startTransition: () => {},
  isTransitioning: false,
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  const startTransition = () => {
    setIsTransitioning(true);
  };

  const completeTransition = () => {
    setIsTransitioning(false);
  };

  // Auto-trigger transition on route change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}
      <PageTransition 
        isLoading={isTransitioning} 
        onComplete={completeTransition}
        direction="horizontal"
        duration={600}
      />
    </TransitionContext.Provider>
  );
}
