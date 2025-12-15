import React from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

function Toast() {
  const { toasts, removeToast } = useToast()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600" />
      case 'info':
        return <Info size={20} className="text-green-600" />
      default:
        return null
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="fixed top-6 right-6 space-y-3 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-hover pointer-events-auto animate-slide-in ${getBgColor(
            toast.type
          )}`}
        >
          {getIcon(toast.type)}
          <span className="text-sm font-medium text-gray-800">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
