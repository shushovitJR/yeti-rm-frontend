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

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      case 'info':
        return 'text-green-600'
      default:
        return 'text-gray-600'
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

  const getCloseButtonColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 hover:bg-green-100'
      case 'error':
        return 'text-red-600 hover:bg-red-100'
      case 'warning':
        return 'text-yellow-600 hover:bg-yellow-100'
      case 'info':
        return 'text-green-600 hover:bg-green-100'
      default:
        return 'text-gray-600 hover:bg-gray-100'
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
            className={`ml-auto p-1.5 rounded transition-colors ${getCloseButtonColor(toast.type)}`}
            title="Close"
            aria-label="Close toast"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
