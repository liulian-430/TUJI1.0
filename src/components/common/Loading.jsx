import React from 'react'
import { Loader2 } from 'lucide-react'
import useUIStore from '../../store/useUIStore'

const Loading = () => {
  const { loading, loadingText } = useUIStore()

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-white/90 border border-white/50 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
        </div>
        <p className="text-gray-700 font-medium">{loadingText}</p>
      </div>
    </div>
  )
}

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <Loader2 className={`animate-spin text-indigo-500 ${sizes[size]} ${className}`} />
  )
}

export const LoadingOverlay = ({ text = '加载中...' }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl z-10">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-100 relative">
        <div className="absolute inset-0 w-8 h-8 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin -m-1"></div>
      </div>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  </div>
)

export default Loading
