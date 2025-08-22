import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType, 
    title: string, 
    message: string, 
    duration: number = 6000 // Increased default duration for better UX
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = { 
      id, 
      type, 
      title, 
      message, 
      duration, 
      timestamp: new Date() 
    };
    
    setNotifications(prev => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};
