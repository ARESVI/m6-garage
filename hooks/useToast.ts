'use client';

import { useState, useCallback } from 'react';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: useCallback((message: string) => showToast(message, 'success'), [showToast]),
    error: useCallback((message: string) => showToast(message, 'error'), [showToast]),
    info: useCallback((message: string) => showToast(message, 'info'), [showToast]),
    warning: useCallback((message: string) => showToast(message, 'warning'), [showToast]),
  };
}
