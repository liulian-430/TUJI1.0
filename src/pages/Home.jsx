import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import Button from '../components/common/Button'
import TripCard from '../components/trip/TripCard'
import POICard from '../components/trip/POICard'
import { 
  Sparkles, MapPin, Calendar, TrendingUp, 
  ChevronRight, Search, Plus, Compass
} from 'lucide-react'
import useTripStore from '../store/useTripStore'
import useUIStore from '../store/useUIStore'
import useUserStore from '../store/useUserStore'
import { CITIES, pois, POI_TYPES } from '../data/pois'
import { formatDate } from '../utils/helpers'

const Home = () => {
  const navigate = useNavigate()
  const { trips, favorites, deleteTrip, copyTrip } = useTripStore()
  const { openCreateModal, addSearchHistory } = useUIStore()
  const { user, isGuest } = useUserStore()
  const [hotCities, setHotCities] = useState([])
  const [recommendedPOIs, setRecommendedPOIs] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    setHotCities(CITIES.slice(0, 8))
    setRecommendedPOIs(pois.filter(p => p.type === POI_TYPES.ATTRACTION).slice(0, 4))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      addSearchHistory(searchKeyword.trim())
      navigate(`/search?q=${encodeURIComponent(searchKeyword.trim())}`)
    }
  }

  const handleCityClick = (city) => {
    navigate(`/search?city=${city.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                你好{user?.nickname ? `，${user.nickname}` : ''} 👋
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                {isGuest ? '开启你的旅行之旅吧' : '准备好探索世界了吗？'}
              </p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Compass className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索城市、景点、美食..."
                className="w-full pl-12 pr-4 py-4 md:py-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-300 transition-all text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                搜索
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard hover className="p-5 md:p-6 cursor-pointer" onClick={() => navigate('/ai')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">AI 智能规划</h3>
                <p className="text-sm text-gray-500">一键生成个性化行程</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </GlassCard>

          <GlassCard hover className="p-5 md:p-6 cursor-pointer" onClick={() => navigate('/map')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">地图探索</h3>
                <p className="text-sm text-gray-500">发现周边景点</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </GlassCard>

          <GlassCard hover className="p-5 md:p-6 cursor-pointer" onClick={openCreateModal}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">新建行程</h3>
                <p className="text-sm text-gray-500">开始规划你的旅行</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </GlassCard>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">我的行程</h2>
            <button
              onClick={openCreateModal}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              全部
              <ChevronRight size={16} />
            </button>
          </div>

          {trips.length === 0 ? (
            <GlassCard className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">还没有行程</h3>
              <p className="text-gray-500 mb-6">创建你的第一个旅行行程吧</p>
              <Button onClick={openCreateModal} icon={Plus}>
                新建行程
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.slice(0, 3).map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={deleteTrip}
                  onCopy={copyTrip}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              热门城市
            </h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {hotCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityClick(city)}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                  {city.name[0]}
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700">{city.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">精选推荐</h2>
            <button
              onClick={() => navigate('/search')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              查看更多
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedPOIs.map((poi) => (
              <POICard
                key={poi.id}
                poi={poi}
                isFavorite={favorites.includes(poi.id)}
                onFavoriteToggle={(id) => {
                  useTripStore.getState().toggleFavorite(id)
                }}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                AI 智能行程规划
              </h2>
              <p className="text-white/80 mb-6">
                告诉我们你的旅行偏好，AI 帮你一键生成专属行程，省时又省心
              </p>
              <Button
                variant="secondary"
                icon={Sparkles}
                onClick={() => navigate('/ai')}
              >
                立即体验
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
