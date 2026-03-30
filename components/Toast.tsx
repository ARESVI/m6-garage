'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <div className="fixed top-4 right-4 z-[99999] animate-slide-in pointer-events-none">
      <div className={`${bgColor} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-2 sm:gap-3 min-w-[250px] sm:min-w-[300px] max-w-md backdrop-blur-sm pointer-events-auto`}>
        <span className="text-xl sm:text-2xl font-bold">{icon}</span>
        <p className="flex-1 font-medium text-sm sm:text-base">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
