import React, { useState } from 'react'
import GlassCard from '../common/GlassCard'
import { 
  MapPin, Calendar, Users, ChevronRight, 
  MoreHorizontal, Copy, Trash2, Share2 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useTripStore from '../../store/useTripStore'
import useUIStore from '../../store/useUIStore'
import { formatDate } from '../../utils/helpers'

const TripCard = ({ trip, variant = 'default', onDelete, onCopy, className = '' }) => {
  const navigate = useNavigate()
  const { setCurrentTrip } = useTripStore()
  const { showToast, successToast, errorToast } = useUIStore()
  const [showMenu, setShowMenu] = useState(false)

  const totalPOIs = trip.days?.reduce((sum, day) => sum + (day.items?.length || 0), 0) || 0

  const handleClick = () => {
    setCurrentTrip(trip.id)
    navigate(`/trip/${trip.id}`)
  }

  const handleCopy = (e) => {
    e.stopPropagation()
    onCopy?.(trip.id)
    successToast('行程已复制')
    setShowMenu(false)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这个行程吗？')) {
      onDelete?.(trip.id)
      successToast('行程已删除')
    }
    setShowMenu(false)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    successToast('分享链接已复制')
    setShowMenu(false)
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const statusColors = {
    planning: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-gray-100 text-gray-700'
  }

  const statusLabels = {
    planning: '规划中',
    ongoing: '进行中',
    completed: '已完成'
  }

  if (variant === 'compact') {
    return (
      <GlassCard
        variant="sm"
        hover
        className={`cursor-pointer ${className}`}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-gray-800 flex-1 truncate">{trip.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${statusColors[trip.status]}`}>
              {statusLabels[trip.status]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{trip.cityName || '未设置'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{trip.days?.length || 0}天</span>
            </div>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard
      hover
      className={`cursor-pointer overflow-hidden group ${className}`}
      onClick={handleClick}
    >
      <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs px-3 py-1 rounded-full bg-white/90 backdrop-blur-md font-medium ${statusColors[trip.status]}`}>
              {statusLabels[trip.status]}
            </span>
            <div className="relative">
              <button
                onClick={handleMenuClick}
                className="p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white transition-colors"
              >
                <MoreHorizontal size={18} className="text-gray-700" />
              </button>
              
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-36 py-2 rounded-xl bg-white shadow-xl border border-gray-100 z-20">
                    <button
                      onClick={handleCopy}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Copy size={16} />
                      复制行程
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Share2 size={16} />
                      分享行程
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      删除行程
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{trip.name}</h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-600">{trip.days?.length || 0}</p>
            <p className="text-xs text-gray-500">天数</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-purple-600">{totalPOIs}</p>
            <p className="text-xs text-gray-500">景点</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-pink-600">{trip.travelers || 1}</p>
            <p className="text-xs text-gray-500">人数</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{trip.cityName || '未设置目的地'}</span>
          </div>
          {trip.startDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(trip.startDate, 'MM/DD')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            查看详情
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </GlassCard>
  )
}

export default TripCard
