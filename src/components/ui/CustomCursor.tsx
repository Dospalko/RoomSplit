'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

export function CustomCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'text'>('default');

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Add hover effects for interactive elements
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], input, textarea, select, [data-cursor="hover"]')) {
        setCursorVariant('hover');
      } else if (target.matches('h1, h2, h3, h4, h5, h6, p, span, [data-cursor="text"]')) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };

    const handleElementLeave = () => {
      setCursorVariant('default');
    };

    // Mouse events
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Hover events for all interactive elements
    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseout', handleElementLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const cursorVariants = {
    default: {
      scale: 1,
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      border: '2px solid rgba(99, 102, 241, 1)',
    },
    hover: {
      scale: 1.8,
      backgroundColor: 'rgba(168, 85, 247, 0.6)',
      border: '2px solid rgba(168, 85, 247, 1)',
    },
    text: {
      scale: 0.6,
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      border: '2px solid rgba(34, 197, 94, 1)',
    },
  };

  const trailVariants = {
    default: {
      scale: 0.6,
      backgroundColor: 'rgba(99, 102, 241, 0.3)',
    },
    hover: {
      scale: 1.2,
      backgroundColor: 'rgba(168, 85, 247, 0.3)',
    },
    text: {
      scale: 0.3,
      backgroundColor: 'rgba(34, 197, 94, 0.3)',
    },
  };

  const clickVariant = {
    scale: isClicking ? 0.6 : cursorVariants[cursorVariant].scale,
    backgroundColor: isClicking ? 'rgba(239, 68, 68, 0.9)' : cursorVariants[cursorVariant].backgroundColor,
    border: isClicking ? '2px solid rgba(239, 68, 68, 1)' : cursorVariants[cursorVariant].border,
  };

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        body {
          cursor: none !important;
        }
        
        a, button, [role="button"], input, textarea, select {
          cursor: none !important;
        }
        
        /* Ensure cursor shows on all elements */
        html, body, div, span, applet, object, iframe,
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
        a, abbr, acronym, address, big, cite, code,
        del, dfn, em, img, ins, kbd, q, s, samp,
        small, strike, strong, sub, sup, tt, var,
        b, u, i, center,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td,
        article, aside, canvas, details, embed, 
        figure, figcaption, footer, header, hgroup, 
        menu, nav, output, ruby, section, summary,
        time, mark, audio, video {
          cursor: none !important;
        }
      `}</style>

      {/* Cursor Trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: '32px',
          height: '32px',
          x: position.x - 16,
          y: position.y - 16,
        }}
        animate={trailVariants[cursorVariant]}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
          mass: 0.8,
        }}
      />

      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: '20px',
          height: '20px',
          x: position.x - 10,
          y: position.y - 10,
        }}
        animate={clickVariant}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 400,
          mass: 0.5,
        }}
      />

      {/* Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-white"
        style={{
          width: '4px',
          height: '4px',
          x: position.x - 2,
          y: position.y - 2,
        }}
        animate={{
          scale: isClicking ? 0 : 1,
          opacity: cursorVariant === 'hover' ? 0.8 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
        }}
      />

      {/* Ripple Effect on Click */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full border-2 border-red-500"
          style={{
            width: '40px',
            height: '40px',
            x: position.x - 20,
            y: position.y - 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
    </>
  );
}
