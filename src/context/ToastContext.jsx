import React, { createContext, useState, useCallback, useRef } from 'react'

export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toastCounterRef = useRef(0)

  const addToast = useCallback((message, type = 'success', duration) => {
    // Use a counter to ensure truly unique IDs
    const id = `toast-${++toastCounterRef.current}-${Date.now()}`
    
    // Set default duration based on toast type
    // Success messages dismiss after 3 seconds
    // Error and warning messages don't auto-dismiss (duration = 0) unless explicitly set
    let finalDuration = duration !== undefined ? duration : (type === 'success' ? 3000 : 0)
    
    setToasts(prev => [...prev, { id, message, type }])
    
    if (finalDuration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, finalDuration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
