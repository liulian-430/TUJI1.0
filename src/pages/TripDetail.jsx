import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import Button from '../components/common/Button'
import DayTimeline from '../components/trip/DayTimeline'
import { 
  ChevronLeft, Share2, MoreHorizontal, 
  Calendar, MapPin, Users, Wallet,
  Map, Plus, Trash2, Copy, Edit3,
  ChevronDown, ChevronUp, TrendingUp,
  Navigation
} from 'lucide-react'
import useTripStore from '../store/useTripStore'
import useUIStore from '../store/useUIStore'
import { formatCurrency, formatDate, formatDistance } from '../utils/helpers'
import { CITIES } from '../data/pois'

const TripDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    trips, currentDayIndex, setCurrentDay,
    moveItemUp, moveItemDown, removeItemFromDay,
    updateItem, addDay, removeDay, deleteTrip, copyTrip,
    getTripStats
  } = useTripStore()
  const { successToast, errorToast, openCreateModal } = useUIStore()
  
  const [trip, setTrip] = useState(null)
  const [showDaySelector, setShowDaySelector] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const foundTrip = trips.find(t => t.id === id)
    if (foundTrip) {
      setTrip(foundTrip)
      setStats(getTripStats(id))
    }
  }, [id, trips])

  useEffect(() => {
    if (trip) {
      setStats(getTripStats(id))
    }
  }, [trip, id])

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <p className="text-gray-500 mb-4">行程不存在或已被删除</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </GlassCard>
      </div>
    )
  }

  const currentDay = trip.days?.[currentDayIndex]

  const handleMoveItem = (fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0) return
    if (toIndex < fromIndex) {
      moveItemUp(id, currentDayIndex, fromIndex)
    } else {
      moveItemDown(id, currentDayIndex, fromIndex)
    }
  }

  const handleRemoveItem = (index) => {
    if (window.confirm('确定要删除这个行程安排吗？')) {
      removeItemFromDay(id, currentDayIndex, currentDay.items[index].id)
      successToast('已删除')
    }
  }

  const handleUpdateDuration = (index, duration) => {
    updateItem(id, currentDayIndex, currentDay.items[index].id, { duration })
  }

  const handleAddDay = () => {
    addDay(id)
    successToast('已添加一天')
  }

  const handleRemoveDay = () => {
    if (trip.days.length <= 1) {
      errorToast('至少保留一天行程')
      return
    }
    if (window.confirm('确定要删除这一天的行程吗？')) {
      removeDay(id, currentDayIndex)
      successToast('已删除')
    }
  }

  const handleDeleteTrip = () => {
    if (window.confirm('确定要删除整个行程吗？此操作不可恢复。')) {
      deleteTrip(id)
      successToast('行程已删除')
      navigate('/')
    }
  }

  const handleCopyTrip = () => {
    const newTrip = copyTrip(id)
    successToast('行程已复制')
    navigate(`/trip/${newTrip.id}`)
    setShowMoreMenu(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.name,
          text: `我的${trip.cityName}旅行行程，一起来看看吧！`,
          url: window.location.href
        })
      } catch (e) {}
    } else {
      successToast('分享链接已复制')
    }
    setShowMoreMenu(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pb-20 md:pb-0">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Share2 size={20} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>
              
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl bg-white shadow-xl border border-gray-100 z-30">
                    <button
                      onClick={handleCopyTrip}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Copy size={16} />
                      复制行程
                    </button>
                    <button
                      onClick={() => { setShowMoreMenu(false); navigate('/budget') }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Wallet size={16} />
                      预算管理
                    </button>
                    <button
                      onClick={handleDeleteTrip}
                      className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
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

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{trip.cityName || '未设置目的地'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{trip.days?.length || 0}天{trip.nights || 0}夜</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{trip.travelers || 1}人</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative z-10">
        <GlassCard className="p-4 mb-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-indigo-600">{stats?.totalPOIs || 0}</p>
              <p className="text-xs text-gray-500">景点数</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">{trip.days?.length || 0}</p>
              <p className="text-xs text-gray-500">天数</p>
            </div>
            <div>
              <p className="text-lg font-bold text-pink-600">{formatDistance(stats?.totalDistance || 0)}</p>
              <p className="text-xs text-gray-500">总距离</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats?.totalCost || 0)}</p>
              <p className="text-xs text-gray-500">预估花费</p>
            </div>
          </div>
        </GlassCard>

        <div className="relative mb-4">
          <button
            onClick={() => setShowDaySelector(!showDaySelector)}
            className="w-full"
          >
            <GlassCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {(currentDayIndex + 1)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">第 {currentDayIndex + 1} 天</p>
                  <p className="text-sm text-gray-500">
                    {currentDay?.items?.length || 0} 个行程安排
                  </p>
                </div>
              </div>
              {showDaySelector ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </GlassCard>
          </button>

          {showDaySelector && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20">
              <GlassCard className="p-2 max-h-64 overflow-y-auto">
                {trip.days.map((day, index) => (
                  <button
                    key={day.id}
                    onClick={() => {
                      setCurrentDay(index)
                      setShowDaySelector(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors
                      ${index === currentDayIndex ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                      ${index === currentDayIndex 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">第 {day.dayNumber} 天</p>
                      <p className="text-xs text-gray-500">{day.items?.length || 0} 个安排</p>
                    </div>
                  </button>
                ))}
                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={handleAddDay}
                    className="flex-1 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus size={14} />
                    添加一天
                  </button>
                  <button
                    onClick={handleRemoveDay}
                    className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    删除当天
                  </button>
                </div>
              </GlassCard>
            </div>
          )}
        </div>

        {trip.days?.length > 1 && (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDay(Math.max(0, currentDayIndex - 1))}
              disabled={currentDayIndex === 0}
              className="px-4 py-2 rounded-xl bg-white/70 text-gray-600 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              上一天
            </button>
            <span className="text-sm text-gray-500">
              {currentDayIndex + 1} / {trip.days.length}
            </span>
            <button
              onClick={() => setCurrentDay(Math.min(trip.days.length - 1, currentDayIndex + 1))}
              disabled={currentDayIndex === trip.days.length - 1}
              className="px-4 py-2 rounded-xl bg-white/70 text-gray-600 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              下一天
              <ChevronLeft size={16} className="rotate-180" />
            </button>
          </div>
        )}

        <DayTimeline
          day={currentDay}
          dayIndex={currentDayIndex}
          onMoveUp={(fromIdx, toIdx) => handleMoveItem(fromIdx, toIdx)}
          onMoveDown={(fromIdx, toIdx) => handleMoveItem(fromIdx, toIdx)}
          onRemove={handleRemoveItem}
          onUpdateDuration={handleUpdateDuration}
          onAddPOI={() => navigate('/search')}
          editable={true}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={Map}
            onClick={() => navigate('/map')}
            className="flex-1"
          >
            地图
          </Button>
          <Button
            icon={Plus}
            onClick={() => navigate('/search')}
            className="flex-1"
          >
            添加景点
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TripDetail
