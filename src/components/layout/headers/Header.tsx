'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      setShowScrollTop(scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Morphing Background Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className={`absolute inset-0 transition-all duration-1000 ${
            isScrolled 
              ? 'bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5' 
              : 'bg-gradient-to-br from-emerald-500/3 via-blue-500/3 to-purple-500/3'
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'h-16 bg-white/70 dark:bg-black/50 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-2xl shadow-black/5' 
          : 'h-20 bg-transparent backdrop-blur-md'
      }`}>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-bounce delay-200 opacity-40" />
          <div className="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-500 opacity-50" />
        </div>

        <div className="relative w-full px-4 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo with Morphing Animation */}
          <div className="group flex items-center gap-3 cursor-pointer">
            <div className={`relative transition-all duration-500 ${
              isScrolled ? 'w-10 h-10' : 'w-12 h-12'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-20 blur-md group-hover:blur-lg transition-all duration-500" />
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-blue-600 transition-all duration-700 transform group-hover:rotate-180">
                <svg className={`text-white transition-all duration-500 ${
                  isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-black bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent font-space-mono transition-all duration-500 ${
                isScrolled ? 'text-lg' : 'text-xl'
              }`}>
                RoomSplit
              </span>
              <span className={`text-xs text-slate-500 dark:text-slate-400 font-roboto-mono font-medium tracking-wider transition-all duration-500 ${
                isScrolled ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
              }`}>
                BETA 2.0
              </span>
            </div>
          </div>

          {/* Navigation with Morphing Indicators */}
          <nav className="hidden lg:flex items-center">
            <div className="relative flex items-center gap-1 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-full p-1 border border-white/20 dark:border-white/10">
              {['Features', 'Rooms', 'How it works'].map((item) => (
                <button
                  key={item}
                  onClick={() => smoothScrollTo(item.toLowerCase().replace(/\s+/g, '-'))}
                  onMouseEnter={() => setActiveNavItem(item)}
                  onMouseLeave={() => setActiveNavItem('')}
                  className={`relative px-6 py-2 text-sm font-medium font-roboto-mono rounded-full transition-all duration-300 ${
                    activeNavItem === item
                      ? 'text-white dark:text-black'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {activeNavItem === item && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-90 animate-pulse" />
                  )}
                  <span className="relative z-10">{item}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* CTA Button with Liquid Animation */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10">
              <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Main CTA */}
            <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-0.5 transition-all duration-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 hover:scale-105 hover:rotate-1">
              <div className="relative bg-white dark:bg-black rounded-full px-6 py-3 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-roboto-mono">
                    Start Splitting
                  </span>
                  <div className="relative">
                    <svg className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 bg-purple-600 rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
                  </div>
                </div>
              </div>
              
              {/* Liquid Animation Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse rounded-full blur-xl" />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Glow Line */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-700 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`} />
      </header>

      {/* Mobile Navigation Overlay */}
      <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300">
        <div className="absolute top-20 left-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 p-6">
          <nav className="space-y-4">
            {['Features', 'Rooms', 'How it works', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => smoothScrollTo(item.toLowerCase().replace(/\s+/g, '-'))}
                className="block w-full text-left text-lg font-medium text-slate-800 dark:text-slate-200 hover:text-purple-600 transition-colors duration-300 font-roboto-mono"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 group transition-all duration-500 ${
          showScrollTop 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse" />
          
          {/* Main button */}
          <div className="relative w-14 h-14 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full flex items-center justify-center group-hover:bg-white dark:group-hover:bg-black transition-all duration-300 transform group-hover:scale-110 group-active:scale-95">
            <svg 
              className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-purple-600 transition-all duration-300 transform group-hover:-translate-y-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          
          {/* Floating particles around button */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-pulse delay-300" />
          <div className="absolute top-1 -left-2 w-1 h-1 bg-pink-400 rounded-full opacity-50 animate-bounce delay-500" />
        </div>
      </button>
    </>
  );
}
