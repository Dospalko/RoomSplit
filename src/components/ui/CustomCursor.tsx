'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, textarea, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * { cursor: none !important; }
      `}</style>

      {/* Enhanced classic cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))'
        }}
        animate={{
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
      >
        {/* Classic arrow shape */}
        <motion.svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          animate={{
            transform: isHovering ? 'rotate(-10deg)' : 'rotate(0deg)',
          }}
        >
          <motion.path 
            d="M4.227 4.227L11.298 20.414L13.414 13.414L20.414 11.298L4.227 4.227Z"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            animate={{
              fill: isHovering ? '#3b82f6' : '#0F172A',
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.svg>
      </motion.div>
    </>
  );
}
