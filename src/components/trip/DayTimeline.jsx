import React, { useState } from 'react'
import GlassCard from '../common/GlassCard'
import { 
  ChevronUp, ChevronDown, Trash2, GripVertical, 
  Clock, MapPin, Edit3, Plus, Minus
} from 'lucide-react'
import { formatDuration, formatCurrency } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const DayTimeline = ({
  day,
  dayIndex,
  onMoveUp,
  onMoveDown,
  onRemove,
  onUpdateDuration,
  onAddPOI,
  editable = true,
  className = ''
}) => {
  const navigate = useNavigate()
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const typeColors = {
    attraction: 'from-purple-500 to-indigo-500',
    restaurant: 'from-orange-500 to-amber-500',
    hotel: 'from-blue-500 to-cyan-500',
    shopping: 'from-pink-500 to-rose-500',
    transport: 'from-cyan-500 to-teal-500'
  }

  const typeBgColors = {
    attraction: 'bg-purple-100',
    restaurant: 'bg-orange-100',
    hotel: 'bg-blue-100',
    shopping: 'bg-pink-100',
    transport: 'bg-cyan-100'
  }

  const typeDotColors = {
    attraction: 'bg-purple-500',
    restaurant: 'bg-orange-500',
    hotel: 'bg-blue-500',
    shopping: 'bg-pink-500',
    transport: 'bg-cyan-500'
  }

  const typeLabels = {
    attraction: '景点',
    restaurant: '餐饮',
    hotel: '住宿',
    shopping: '购物',
    transport: '交通'
  }

  const handleDragStart = (index) => {
    if (!editable) return
    setDragIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (!editable) return
    setDragOverIndex(index)
  }

  const handleDrop = (e, toIndex) => {
    e.preventDefault()
    if (!editable || dragIndex === null) return
    
    if (dragIndex !== toIndex) {
      onMoveUp?.(dragIndex, toIndex)
    }
    
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleItemClick = (item) => {
    if (item.poiId) {
      navigate(`/poi/${item.poiId}`)
    }
  }

  const handleDurationChange = (index, delta) => {
    const item = day.items[index]
    const newDuration = Math.max(30, (item.duration || 60) + delta)
    onUpdateDuration?.(index, newDuration)
  }

  if (!day) {
    return (
      <GlassCard className={`p-8 text-center ${className}`}>
        <p className="text-gray-400">暂无行程数据</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard className={`overflow-hidden ${className}`}>
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              第 {day.dayNumber} 天
            </h3>
            <p className="text-sm text-gray-500">
              {day.items?.length || 0} 个行程安排
            </p>
          </div>
          {editable && onAddPOI && (
            <button
              onClick={onAddPOI}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              <Plus size={16} />
              添加
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        {!day.items || day.items.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">还没有行程安排</p>
            <p className="text-sm text-gray-400">点击上方「添加」按钮开始规划</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200" />

            <div className="space-y-4">
              {day.items.map((item, index) => (
                <div
                  key={item.id}
                  draggable={editable}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    relative pl-14 transition-all duration-200
                    ${dragIndex === index ? 'opacity-50' : ''}
                    ${dragOverIndex === index && dragIndex !== index ? 'transform -translate-y-1' : ''}
                  `}
                >
                  <div className={`
                    absolute left-3 top-4 w-5 h-5 rounded-full border-4 border-white shadow-md
                    ${typeDotColors[item.type] || 'bg-gray-400'}
                  `} />

                  <div className={`
                    relative group ${editable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                  `}>
                    <div
                      className={`
                        ${typeBgColors[item.type] || 'bg-gray-100'}
                        rounded-2xl p-4 transition-all duration-200
                        hover:shadow-lg hover:shadow-black/5
                        ${dragOverIndex === index && dragIndex !== index ? 'ring-2 ring-purple-400 ring-offset-2' : ''}
                      `}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex items-start gap-3">
                        {editable && (
                          <div className="pt-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={16} />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-gray-800">
                                  {item.startTime}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-white/80 ${
                                  item.type === 'attraction' ? 'text-purple-700' :
                                  item.type === 'restaurant' ? 'text-orange-700' :
                                  item.type === 'hotel' ? 'text-blue-700' :
                                  item.type === 'shopping' ? 'text-pink-700' :
                                  'text-cyan-700'
                                }`}>
                                  {typeLabels[item.type]}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {item.name}
                              </h4>
                              {item.address && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin size={12} />
                                  <span className="truncate">{item.address}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {item.price > 0 && (
                                <span className="text-sm font-bold text-indigo-600">
                                  {formatCurrency(item.price)}
                                </span>
                              )}

                              {editable && onUpdateDuration && (
                                <div className="flex items-center gap-1 bg-white/80 rounded-full px-2 py-1">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDurationChange(index, -30) }}
                                    className="p-0.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <div className="flex items-center gap-1 text-xs text-gray-600 min-w-[60px] justify-center">
                                    <Clock size={12} />
                                    <span>{formatDuration(item.duration)}</span>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDurationChange(index, 30) }}
                                    className="p-0.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {editable && (
                        <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveUp?.(index, index - 1) }}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg hover:bg-white/80 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveDown?.(index, index + 1) }}
                            disabled={index === day.items.length - 1}
                            className="p-1.5 rounded-lg hover:bg-white/80 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onRemove?.(index) }}
                            className="p-1.5 rounded-lg hover:bg-white/80 text-gray-500 hover:text-rose-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export default DayTimeline
