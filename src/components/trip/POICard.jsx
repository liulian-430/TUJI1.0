import React from 'react'
import GlassCard from '../common/GlassCard'
import { Star, MapPin, Clock, Heart } from 'lucide-react'
import { formatDuration, formatCurrency } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const POICard = ({ poi, variant = 'default', onFavoriteToggle, isFavorite, className = '' }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/poi/${poi.id}`)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onFavoriteToggle?.(poi.id)
  }

  const typeColors = {
    attraction: 'bg-purple-100 text-purple-700',
    restaurant: 'bg-orange-100 text-orange-700',
    hotel: 'bg-blue-100 text-blue-700',
    shopping: 'bg-pink-100 text-pink-700',
    transport: 'bg-cyan-100 text-cyan-700'
  }

  const typeLabels = {
    attraction: '景点',
    restaurant: '餐饮',
    hotel: '住宿',
    shopping: '购物',
    transport: '交通'
  }

  if (variant === 'compact') {
    return (
      <GlassCard
        variant="sm"
        hover
        className={`overflow-hidden cursor-pointer ${className}`}
        onClick={handleClick}
      >
        <div className="flex gap-3 p-3">
          {poi.images?.[0] ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={poi.images[0]}
                alt={poi.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏞️</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-gray-800 truncate">{poi.name}</h4>
              {onFavoriteToggle && (
                <button
                  onClick={handleFavoriteClick}
                  className="flex-shrink-0 p-1 -m-1 rounded-full hover:bg-rose-50 transition-colors"
                >
                  <Heart
                    size={18}
                    className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}
                  />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[poi.type] || 'bg-gray-100 text-gray-700'}`}>
                {typeLabels[poi.type]}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={12} className="fill-current" />
                <span className="text-xs font-medium">{poi.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
              <MapPin size={12} />
              <span className="truncate">{poi.cityName}</span>
            </div>
            {poi.price > 0 && (
              <p className="text-sm font-bold text-indigo-600 mt-1">
                {formatCurrency(poi.price)}
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard
      hover
      className={`overflow-hidden cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      <div className="relative h-40 overflow-hidden">
        {poi.images?.[0] ? (
          <img
            src={poi.images[0]}
            alt={poi.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center">
            <span className="text-5xl">🏞️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2.5 py-1 rounded-full backdrop-blur-md bg-white/80 font-medium ${typeColors[poi.type] || 'bg-gray-100 text-gray-700'}`}>
            {typeLabels[poi.type]}
          </span>
        </div>

        {onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md bg-white/80 hover:bg-white transition-colors"
          >
            <Heart
              size={18}
              className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}
            />
          </button>
        )}

        {poi.price > 0 && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md">
            <span className="text-sm font-bold text-indigo-600">{formatCurrency(poi.price)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{poi.name}</h3>
        
        <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-500 fill-current" />
            <span className="font-medium">{poi.rating}</span>
            <span className="text-gray-400 text-xs">({poi.reviewCount || 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDuration(poi.duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} />
          <span className="truncate">{poi.address}</span>
        </div>

        {poi.tags && poi.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {poi.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export default POICard
