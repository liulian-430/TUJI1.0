import React from 'react'
import GlassCard from './common/GlassCard'
import Button from './common/Button'
import { X, Download, RefreshCw, Sparkles, CheckCircle } from 'lucide-react'
import useUIStore from '../store/useUIStore'
import { APP_VERSION } from '../config/version'

const UpdateModal = () => {
  const { isUpdateModalOpen, updateInfo, closeUpdateModal, showToast, successToast } = useUIStore()

  const handleUpdate = () => {
    successToast('正在下载更新...')
    setTimeout(() => {
      closeUpdateModal()
      if (window.location) {
        window.location.reload()
      }
    }, 1500)
  }

  const handleLater = () => {
    closeUpdateModal()
  }

  if (!isUpdateModalOpen) return null

  const mockUpdate = updateInfo || {
    version: '1.1.0',
    buildNumber: 2,
    releaseDate: '2026-07-01',
    features: [
      '新增 AI 对话式规划功能',
      '优化行程编辑体验',
      '修复若干已知问题',
      '提升应用性能'
    ],
    size: '12.5 MB',
    isForce: false
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${mockUpdate.isForce ? 'pointer-events-none' : ''}`}
        onClick={!mockUpdate.isForce ? handleLater : undefined}
      />
      
      <div className="relative w-full max-w-sm animate-slide-up">
        <GlassCard className="overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-bold text-lg">发现新版本</p>
              </div>
            </div>
            
            {!mockUpdate.isForce && (
              <button
                onClick={handleLater}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="p-6">
            <div className="text-center mb-4">
              <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                v{mockUpdate.version}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                大小：{mockUpdate.size} · {mockUpdate.releaseDate}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">更新内容：</p>
              {mockUpdate.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Button fullWidth icon={Download} onClick={handleUpdate}>
                立即更新
              </Button>
              
              {!mockUpdate.isForce && (
                <button
                  onClick={handleLater}
                  className="w-full py-3 text-center text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  稍后再说
                </button>
              )}
            </div>

            <p className="text-xs text-center text-gray-400 mt-4">
              当前版本 v{APP_VERSION}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default UpdateModal
