import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import useUIStore from '../../store/useUIStore'

const Toast = () => {
  const { toast, hideToast } = useUIStore()

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const bgColors = {
    success: 'from-emerald-50 to-teal-50 border-emerald-200',
    error: 'from-rose-50 to-red-50 border-rose-200',
    warning: 'from-amber-50 to-orange-50 border-amber-200',
    info: 'from-blue-50 to-indigo-50 border-blue-200'
  }

  if (!toast) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`
          flex items-center gap-3 px-5 py-3 rounded-2xl
          bg-gradient-to-r ${bgColors[toast.type]}
          border backdrop-blur-xl shadow-lg
          min-w-[280px] max-w-md
        `}
      >
        {icons[toast.type]}
        <p className="flex-1 text-sm font-medium text-gray-800">{toast.message}</p>
        <button
          onClick={hideToast}
          className="p-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}

export default Toast
