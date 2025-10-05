"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface ToastNotificationProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
}

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
}

export function ToastNotification({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const Icon = toastIcons[type]

  useEffect(() => {
    // Анимация появления
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // Автоматическое скрытие
    const hideTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => onClose(id), 300) // Ждем завершения анимации
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [id, duration, onClose])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose(id), 300)
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 max-w-sm w-full transition-all duration-300 ease-in-out",
        isVisible && !isLeaving ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <div
        className={cn(
          "border rounded-lg p-4 shadow-lg backdrop-blur-sm",
          toastColors[type]
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{title}</h4>
            {message && (
              <p className="text-sm opacity-90 mt-1">{message}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast manager for multiple notifications
export function ToastManager() {
  const [toasts, setToasts] = useState<ToastNotificationProps[]>([])

  const addToast = (toast: Omit<ToastNotificationProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastNotificationProps = {
      ...toast,
      id,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId))
      }
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Expose addToast function globally for easy access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showToast = addToast
    }
  }, [])

  return (
    <>
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} {...toast} />
      ))}
    </>
  )
}

// Hook for using toast notifications
export function useToast() {
  const addToast = (toast: Omit<ToastNotificationProps, 'id' | 'onClose'>) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(toast)
    }
  }

  return {
    toast: addToast,
    success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
    info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
    warning: (title: string, message?: string) => addToast({ type: 'warning', title, message })
  }
}
