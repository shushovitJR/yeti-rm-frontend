import React from 'react'
import { AlertCircle } from 'lucide-react'

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-hover w-full max-w-sm animate-slide-in">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isDangerous ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <AlertCircle size={18} className={isDangerous ? 'text-red-600' : 'text-yellow-600'} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-600 mt-1">{message}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-3 py-1.5 text-white rounded-lg text-sm font-medium transition-colors ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-primary hover:bg-green-900'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
