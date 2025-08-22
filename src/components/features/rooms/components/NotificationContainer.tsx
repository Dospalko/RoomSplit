  import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle, FiInfo, FiCheckCircle } from '@/lib/icons';
import { Notification } from '../types';

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const iconMap = {
  success: FiCheckCircle,
  error: FiX,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const colorMap = {
  success: {
    bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    text: 'text-white',
    icon: 'text-white',
    progress: 'bg-emerald-300'
  },
  error: {
    bg: 'bg-gradient-to-r from-red-500 to-red-600',
    text: 'text-white',
    icon: 'text-white',
    progress: 'bg-red-300'
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
    text: 'text-white',
    icon: 'text-white',
    progress: 'bg-amber-300'
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    text: 'text-white',
    icon: 'text-white',
    progress: 'bg-blue-300'
  },
};

const ToastItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
  index: number;
}> = ({ notification, onRemove, index }) => {
  const [progress, setProgress] = useState(100);
  const IconComponent = iconMap[notification.type];
  const colors = colorMap[notification.type];

  useEffect(() => {
    const duration = notification.duration || 5000; // Default 5 seconds
    if (duration > 0) {
      // Use setTimeout for auto-removal instead of calling onRemove in setInterval
      const autoRemoveTimeout = setTimeout(() => {
        onRemove(notification.id);
      }, duration);

      // Progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => {
        clearTimeout(autoRemoveTimeout);
        clearInterval(interval);
      };
    }
  }, [notification.duration, notification.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        y: index * -8, // Subtle stacking effect
      }}
      exit={{ 
        opacity: 0, 
        x: 300, 
        scale: 0.9,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: index * 0.05
      }}
      className={`
        relative overflow-hidden rounded-xl shadow-xl backdrop-blur-md border border-white/20
        ${colors.bg} ${colors.text}
        min-w-[320px] max-w-[400px]
      `}
      style={{ zIndex: 1000 - index }}
    >
      {/* Progress bar */}
      {(notification.duration || 5000) > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${colors.progress}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className={`flex-shrink-0 p-1.5 rounded-full bg-white/20 ${colors.icon}`}
          >
            <IconComponent className="w-4 h-4" />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.h4 
              className="text-sm font-bold tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {notification.title}
            </motion.h4>
            <motion.p 
              className="text-xs mt-1 opacity-90 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {notification.message}
            </motion.p>
          </div>

          {/* Close button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(notification.id);
            }}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            aria-label="Close notification"
          >
            <FiX className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ 
          duration: 1.5, 
          delay: 0.3,
          repeat: Infinity, 
          repeatDelay: 3
        }}
        style={{ transform: 'skewX(-20deg)' }}
      />
    </motion.div>
  );
};

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onRemove 
}) => {
  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <div key={notification.id} className="pointer-events-auto">
            <ToastItem
              notification={notification}
              onRemove={onRemove}
              index={index}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
