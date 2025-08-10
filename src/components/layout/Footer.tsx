'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  const features = [
    { icon: '⚡', text: 'Real-time Updates', color: 'from-yellow-400 to-orange-500' },
    { icon: '🔓', text: 'No Auth Required', color: 'from-emerald-400 to-teal-500' },
    { icon: '🌐', text: 'Open Source', color: 'from-blue-400 to-indigo-500' },
    { icon: '📱', text: 'Mobile Ready', color: 'from-purple-400 to-pink-500' },
  ];

  return (
    <footer 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${
                i % 4 === 0 ? 'from-blue-400 to-indigo-500' :
                i % 4 === 1 ? 'from-purple-400 to-pink-500' :
                i % 4 === 2 ? 'from-emerald-400 to-teal-500' :
                'from-amber-400 to-orange-500'
              } rounded-full opacity-60`}
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i * 3)}%`,
                animationDelay: `${i * 0.5}s`,
                transform: isHovered ? `translate(${Math.sin(i) * 20}px, ${Math.cos(i) * 20}px)` : 'translate(0, 0)',
                transition: 'transform 2s ease-out',
              }}
            />
          ))}
        </div>
      </div>

      {/* Glassmorphism Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 border-t border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="group cursor-pointer">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
                      <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                      RoomSplit
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Split expenses beautifully
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                  The most elegant way to manage shared expenses. Real-time collaboration, 
                  beautiful analytics, and zero hassle.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Features</h4>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-4 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        {feature.icon}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social & Links */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Connect</h4>
              <div className="flex gap-4 mb-8">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group relative w-12 h-12 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </div>
                  </a>
                ))}
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">System Status</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">All Systems Operational</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Latest Update</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">v2.0.0 - Analytics Dashboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-white/20 dark:border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span>© 2025 RoomSplit</span>
                <span className="hidden md:block">•</span>
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>for better expense sharing</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Terms of Service
                </a>
                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      />
    </footer>
  );
}
