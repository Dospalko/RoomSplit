'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import PageTransition from './loading/PageTransition';

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
  const previousPathname = useRef(pathname);

  const startTransition = () => {
    setIsTransitioning(true);
  };

  const completeTransition = () => {
    setIsTransitioning(false);
  };

  // Auto-trigger transition only when navigating TO rooms pages
  useEffect(() => {
    const isCurrentRoomsPage = pathname.startsWith('/rooms');
    const wasPreviousRoomsPage = previousPathname.current.startsWith('/rooms');
    
    // Only trigger transition when going TO a rooms page (not when leaving)
    const shouldTransition = isCurrentRoomsPage && !wasPreviousRoomsPage;
    
    if (shouldTransition && pathname !== previousPathname.current) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);

      // Update previous pathname after transition starts
      previousPathname.current = pathname;

      return () => clearTimeout(timer);
    } else {
      // Update without transition
      previousPathname.current = pathname;
    }
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
