import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import Button from '../components/common/Button'
import { 
  Heart, Share2, MapPin, Star, Clock, 
  Ticket, ChevronLeft, Plus, Navigation,
  MessageCircle, ThumbsUp, ChevronRight,
  Image as ImageIcon
} from 'lucide-react'
import useTripStore from '../store/useTripStore'
import useUIStore from '../store/useUIStore'
import { pois, POI_TYPE_LABELS, getPOIById } from '../data/pois'
import { formatDuration, formatCurrency, formatDate } from '../utils/helpers'

const POIDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite, trips, addItemToDay, currentTripId, currentDayIndex } = useTripStore()
  const { successToast, showToast, openCreateModal } = useUIStore()
  
  const [poi, setPoi] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAddToTrip, setShowAddToTrip] = useState(false)
  const [reviews, setReviews] = useState([])
  const [relatedPOIs, setRelatedPOIs] = useState([])

  useEffect(() => {
    const foundPOI = getPOIById(id)
    if (foundPOI) {
      setPoi(foundPOI)
      
      const related = pois.filter(p => 
        p.city === foundPOI.city && 
        p.id !== foundPOI.id &&
        p.type === foundPOI.type
      ).slice(0, 4)
      setRelatedPOIs(related)
    }

    setReviews([
      { id: 'r1', userName: '旅行家小明', avatar: '', rating: 5, content: '非常棒的景点，值得一去！建议早上早点去，人少体验更好。', images: [], date: Date.now() - 86400000, likes: 128 },
      { id: 'r2', userName: '背包客阿杰', avatar: '', rating: 4, content: '景色很美，就是人有点多。提前网上订票比较方便。', images: [], date: Date.now() - 172800000, likes: 56 },
    ])
  }, [id])

  const handleFavorite = () => {
    const isFav = toggleFavorite(id)
    successToast(isFav ? '已添加到收藏' : '已取消收藏')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poi.name,
          text: poi.description,
          url: window.location.href
        })
      } catch (e) {}
    } else {
      successToast('链接已复制')
    }
  }

  const handleAddToTrip = (tripId, dayIndex) => {
    addItemToDay(tripId, dayIndex, poi)
    successToast(`已添加到第 ${dayIndex + 1} 天`)
    setShowAddToTrip(false)
  }

  if (!poi) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  const typeColor = {
    attraction: 'bg-purple-100 text-purple-700',
    restaurant: 'bg-orange-100 text-orange-700',
    hotel: 'bg-blue-100 text-blue-700',
    shopping: 'bg-pink-100 text-pink-700',
    transport: 'bg-cyan-100 text-cyan-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pb-24 md:pb-0">
      <div className="relative h-72 md:h-96">
        {poi.images?.[currentImageIndex] ? (
          <img
            src={poi.images[currentImageIndex]}
            alt={poi.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center">
            <ImageIcon className="w-20 h-20 text-white/50" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleFavorite}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Heart size={20} className={isFavorite(id) ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>

        {poi.images?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {poi.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${typeColor[poi.type] || 'bg-gray-100 text-gray-700'}`}>
            {POI_TYPE_LABELS[poi.type]}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{poi.name}</h1>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-amber-400 fill-current" />
              <span className="font-semibold">{poi.rating}</span>
              <span className="opacity-80">({poi.reviewCount}条评价)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{poi.cityName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative z-10">
        <GlassCard className="p-5 mb-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-xl font-bold text-gray-800">{poi.rating}</span>
              </div>
              <p className="text-xs text-gray-500">评分</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-xl font-bold text-gray-800">{Math.floor(poi.duration / 60)}h</span>
              </div>
              <p className="text-xs text-gray-500">建议游玩</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Ticket className="w-5 h-5 text-emerald-500" />
                <span className="text-xl font-bold text-gray-800">
                  {poi.price === 0 ? '免费' : `¥${poi.price}`}
                </span>
              </div>
              <p className="text-xs text-gray-500">门票</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <span className="text-xl font-bold text-gray-800">{poi.reviewCount}</span>
              </div>
              <p className="text-xs text-gray-500">评价</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">景点简介</h2>
          <p className="text-gray-600 leading-relaxed">{poi.description}</p>
          {poi.tags && poi.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {poi.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">实用信息</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">地址</p>
                <p className="text-sm text-gray-500 mt-0.5">{poi.address}</p>
              </div>
              <button className="text-indigo-600 text-sm font-medium flex items-center gap-1">
                <Navigation size={14} />
                导航
              </button>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">开放时间</p>
                <p className="text-sm text-gray-500 mt-0.5">{poi.openTime}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Ticket className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">门票价格</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {poi.price === 0 ? '免费开放' : `成人票 ${formatCurrency(poi.price)}`}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {relatedPOIs.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">相关推荐</h2>
              <button
                onClick={() => navigate(`/search?city=${poi.city}`)}
                className="text-sm font-medium text-indigo-600 flex items-center gap-1"
              >
                更多
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedPOIs.map((relatedPoi) => (
                <div
                  key={relatedPoi.id}
                  onClick={() => navigate(`/poi/${relatedPoi.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-2">
                    {relatedPoi.images?.[0] ? (
                      <img
                        src={relatedPoi.images[0]}
                        alt={relatedPoi.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-300 to-purple-300" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 truncate">{relatedPoi.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={12} className="text-amber-500 fill-current" />
                    <span className="text-xs text-gray-500">{relatedPoi.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <GlassCard className="p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">用户评价</h2>
            <button className="text-sm font-medium text-indigo-600">查看全部</button>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.userName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">{review.userName}</p>
                      <span className="text-xs text-gray-400">{formatDate(review.date, 'MM-DD')}</span>
                    </div>
                    <div className="flex items-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{review.content}</p>
                    <button className="flex items-center gap-1 mt-2 text-xs text-gray-400 hover:text-rose-500 transition-colors">
                      <ThumbsUp size={12} />
                      {review.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 md:relative md:max-w-4xl md:mx-auto md:mt-6 md:px-4 md:pb-8">
        <div className="backdrop-blur-xl bg-white/90 border border-white/50 rounded-2xl shadow-xl p-3 flex gap-3">
          <Button
            variant="outline"
            icon={Heart}
            onClick={handleFavorite}
            className="flex-1"
          >
            {isFavorite(id) ? '已收藏' : '收藏'}
          </Button>
          <Button
            icon={Plus}
            onClick={() => {
              if (trips.length > 0) {
                setShowAddToTrip(true)
              } else {
                openCreateModal()
              }
            }}
            className="flex-1"
          >
            加入行程
          </Button>
        </div>
      </div>

      {showAddToTrip && (
        <div className="fixed inset-0 z-50" onClick={() => setShowAddToTrip(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 animate-slide-up">
            <GlassCard className="rounded-b-none max-h-[70vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">选择行程</h3>
                <button
                  onClick={() => setShowAddToTrip(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {trips.map((trip) => (
                  <div key={trip.id} className="space-y-2">
                    <div className="font-semibold text-gray-800">{trip.name}</div>
                    <div className="flex gap-2 flex-wrap">
                      {trip.days.map((day, dayIndex) => (
                        <button
                          key={day.id}
                          onClick={() => handleAddToTrip(trip.id, dayIndex)}
                          className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors"
                        >
                          第{day.dayNumber}天
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  )
}

export default POIDetail
