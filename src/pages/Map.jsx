import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import POICard from '../components/trip/POICard'
import { 
  MapPin, Search, Layers, Navigation, 
  Plus, Minus, Compass, Star, Filter
} from 'lucide-react'
import useTripStore from '../store/useTripStore'
import useUIStore from '../store/useUIStore'
import { pois, CITIES, POI_TYPES, POI_TYPE_LABELS } from '../data/pois'

const MapPage = () => {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useTripStore()
  const { showToast, successToast } = useUIStore()
  
  const [selectedCity, setSelectedCity] = useState(CITIES[0])
  const [selectedType, setSelectedType] = useState('all')
  const [zoom, setZoom] = useState(12)
  const [selectedPOI, setSelectedPOI] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  const cityPOIs = pois.filter(p => p.city === selectedCity.id)
  const filteredPOIs = cityPOIs.filter(poi => {
    if (selectedType !== 'all' && poi.type !== selectedType) return false
    if (searchKeyword && !poi.name.includes(searchKeyword) && !poi.address.includes(searchKeyword)) return false
    return true
  })

  const handlePOIClick = (poi) => {
    setSelectedPOI(poi)
  }

  const handleNavigate = (poi) => {
    successToast('正在规划路线...')
  }

  const handleAddToTrip = (poi) => {
    navigate(`/poi/${poi.id}`)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex flex-col md:flex-row">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-blue-100/30 to-indigo-100/50">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 800 600">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {filteredPOIs.map((poi, index) => {
            const x = 100 + (index * 137) % 600
            const y = 100 + (index * 89) % 400
            const isSelected = selectedPOI?.id === poi.id
            
            return (
              <button
                key={poi.id}
                onClick={() => handlePOIClick(poi)}
                className={`
                  absolute transform -translate-x-1/2 -translate-y-full
                  transition-all duration-300 z-10
                  ${isSelected ? 'z-20 scale-110' : 'hover:scale-105'}
                `}
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className={`
                  relative flex flex-col items-center
                  ${isSelected ? 'animate-bounce' : ''}
                `}>
                  <div className={`
                    px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
                    ${isSelected 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/30' 
                      : 'bg-white/90 backdrop-blur-sm text-gray-700 shadow-md'
                    }
                  `}>
                    {poi.name}
                  </div>
                  <div className={`
                    w-6 h-6 rounded-full border-2 border-white shadow-lg mt-1
                    ${poi.type === 'attraction' ? 'bg-purple-500' :
                      poi.type === 'restaurant' ? 'bg-orange-500' :
                      poi.type === 'hotel' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }
                    ${isSelected ? 'ring-4 ring-purple-300/50' : ''}
                  `} />
                </div>
              </button>
            )
          })}
        </div>

        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索地图上的地点..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            />
          </div>
        </div>

        <div className="absolute top-4 left-4 hidden md:block z-10">
          <GlassCard variant="sm" className="p-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">{selectedCity.name}</p>
            <div className="flex gap-2">
              {CITIES.slice(0, 5).map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCity.id === city.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={() => setZoom(Math.min(zoom + 1, 20))}
            className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 1, 5))}
            className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            <Minus size={20} />
          </button>
          <button
            onClick={() => successToast('正在定位...')}
            className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg flex items-center justify-center text-indigo-600 hover:bg-white transition-colors"
          >
            <Navigation size={20} />
          </button>
        </div>

        {showFilter && (
          <div className="absolute bottom-6 left-4 right-20 md:left-auto md:right-20 md:w-64 z-10 animate-slide-up">
            <GlassCard className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3">筛选类型</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedType === 'all'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                {Object.entries(POI_TYPE_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {selectedPOI && (
          <div className="absolute bottom-6 left-4 right-4 md:left-4 md:w-96 z-20 animate-slide-up">
            <GlassCard className="p-4">
              <div className="flex gap-4">
                {selectedPOI.images?.[0] ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={selectedPOI.images[0]}
                      alt={selectedPOI.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{selectedPOI.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedPOI.type === 'attraction' ? 'bg-purple-100 text-purple-700' :
                      selectedPOI.type === 'restaurant' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {POI_TYPE_LABELS[selectedPOI.type]}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} className="fill-current" />
                      <span className="text-xs font-medium">{selectedPOI.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{selectedPOI.address}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleNavigate(selectedPOI)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  <Navigation size={16} />
                  导航
                </button>
                <button
                  onClick={() => handleAddToTrip(selectedPOI)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  <Plus size={16} />
                  加入行程
                </button>
              </div>
              <button
                onClick={() => setSelectedPOI(null)}
                className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </GlassCard>
          </div>
        )}
      </div>

      <div className="h-64 md:h-full md:w-80 bg-white/50 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/50 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">
            周边景点 ({filteredPOIs.length})
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredPOIs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无结果</p>
            </div>
          ) : (
            filteredPOIs.map((poi) => (
              <div
                key={poi.id}
                onClick={() => handlePOIClick(poi)}
                className={`
                  p-3 rounded-xl cursor-pointer transition-all
                  ${selectedPOI?.id === poi.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 ring-2 ring-indigo-300'
                    : 'bg-white/60 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-300 to-purple-300 flex-shrink-0 overflow-hidden">
                    {poi.images?.[0] && (
                      <img src={poi.images[0]} alt={poi.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{poi.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-amber-500 fill-current" />
                      <span className="text-xs text-gray-600">{poi.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{poi.address}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MapPage
