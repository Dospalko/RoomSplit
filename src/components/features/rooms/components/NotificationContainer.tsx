import React from 'react';
import { Notification } from '../types';

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full rounded-lg border backdrop-blur-sm shadow-lg p-4 ${
            notification.type === 'success' 
              ? 'bg-emerald-50/90 dark:bg-emerald-900/60 border-emerald-200 dark:border-emerald-700' 
              : notification.type === 'error'
              ? 'bg-red-50/90 dark:bg-red-900/60 border-red-200 dark:border-red-700'
              : notification.type === 'warning'
              ? 'bg-amber-50/90 dark:bg-amber-900/60 border-amber-200 dark:border-amber-700'
              : 'bg-blue-50/90 dark:bg-blue-900/60 border-blue-200 dark:border-blue-700'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold ${
                notification.type === 'success' 
                  ? 'text-emerald-800 dark:text-emerald-200' 
                  : notification.type === 'error'
                  ? 'text-red-800 dark:text-red-200'
                  : notification.type === 'warning'
                  ? 'text-amber-800 dark:text-amber-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {notification.title}
              </h4>
              <p className={`text-xs mt-1 ${
                notification.type === 'success' 
                  ? 'text-emerald-700 dark:text-emerald-300' 
                  : notification.type === 'error'
                  ? 'text-red-700 dark:text-red-300'
                  : notification.type === 'warning'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className={`flex-shrink-0 p-1 rounded-md transition-colors ${
                notification.type === 'success' 
                  ? 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-800' 
                  : notification.type === 'error'
                  ? 'text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-800'
                  : notification.type === 'warning'
                  ? 'text-amber-400 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-800'
                  : 'text-blue-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
