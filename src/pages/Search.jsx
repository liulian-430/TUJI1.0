import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import POICard from '../components/trip/POICard'
import { 
  Search as SearchIcon, X, Clock, TrendingUp, MapPin,
  Filter, ChevronDown, Star
} from 'lucide-react'
import useUIStore from '../store/useUIStore'
import useTripStore from '../store/useTripStore'
import { pois, CITIES, POI_TYPES, POI_TYPE_LABELS } from '../data/pois'

const Search = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchHistory, addSearchHistory, clearSearchHistory, removeSearchHistory } = useUIStore()
  const { favorites, toggleFavorite } = useTripStore()
  
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [showTypeFilter, setShowTypeFilter] = useState(false)
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(!!searchParams.get('q'))

  const hotKeywords = ['故宫', '西湖', '长城', '熊猫', '外滩', '兵马俑']

  useEffect(() => {
    if (keyword || selectedCity) {
      performSearch()
    }
  }, [selectedCity, selectedType, sortBy])

  const performSearch = () => {
    let filtered = [...pois]

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filtered = filtered.filter(poi =>
        poi.name.toLowerCase().includes(lowerKeyword) ||
        poi.cityName.includes(keyword) ||
        poi.tags?.some(tag => tag.includes(keyword)) ||
        poi.description.includes(keyword)
      )
    }

    if (selectedCity) {
      filtered = filtered.filter(poi => poi.city === selectedCity)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(poi => poi.type === selectedType)
    }

    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    setResults(filtered)
    setHasSearched(true)
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    if (keyword.trim()) {
      addSearchHistory(keyword.trim())
      performSearch()
    }
  }

  const handleKeywordClick = (kw) => {
    setKeyword(kw)
    addSearchHistory(kw)
    performSearch()
  }

  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId)
    setShowCityPicker(false)
    if (keyword) {
      performSearch()
    }
  }

  const clearAll = () => {
    setKeyword('')
    setSelectedCity('')
    setSelectedType('all')
    setHasSearched(false)
    setResults([])
    setSearchParams({})
  }

  const selectedCityName = CITIES.find(c => c.id === selectedCity)?.name || '全部城市'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pb-20 md:pb-0">
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索景点、美食、酒店..."
                autoFocus
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/80 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              搜索
            </button>
          </form>

          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0
                ${selectedCity ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-white/80 text-gray-600 border border-gray-200'}
              `}
            >
              <MapPin size={14} />
              {selectedCityName}
              <ChevronDown size={14} />
            </button>

            <button
              onClick={() => setShowTypeFilter(!showTypeFilter)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0
                ${selectedType !== 'all' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-white/80 text-gray-600 border border-gray-200'}
              `}
            >
              <Filter size={14} />
              {selectedType === 'all' ? '类型' : POI_TYPE_LABELS[selectedType]}
              <ChevronDown size={14} />
            </button>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 flex-shrink-0">
              <Star size={14} className="text-amber-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
              >
                <option value="rating">评分最高</option>
                <option value="price_asc">价格从低到高</option>
                <option value="price_desc">价格从高到低</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {showCityPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowCityPicker(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 animate-slide-down">
            <GlassCard className="p-4 max-h-96 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700 mb-3">选择城市</p>
              <button
                onClick={() => handleCitySelect('')}
                className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                  !selectedCity ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                }`}
              >
                全部城市
              </button>
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.id)}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                    selectedCity === city.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                  }`}
                >
                  {city.name}
                  <span className="text-sm text-gray-400 ml-2">{city.country}</span>
                </button>
              ))}
            </GlassCard>
          </div>
        </div>
      )}

      {showTypeFilter && (
        <div className="fixed inset-0 z-40" onClick={() => setShowTypeFilter(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-32 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 animate-slide-down">
            <GlassCard className="p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">选择类型</p>
              <button
                onClick={() => { setSelectedType('all'); setShowTypeFilter(false) }}
                className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                  selectedType === 'all' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                }`}
              >
                全部类型
              </button>
              {Object.entries(POI_TYPE_LABELS).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setShowTypeFilter(false) }}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                    selectedType === type ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </GlassCard>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!hasSearched && !keyword && (
          <div className="space-y-6">
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Clock size={18} className="text-gray-500" />
                    搜索历史
                  </h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    清空
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleKeywordClick(item)}
                      className="group flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 text-gray-600 text-sm hover:bg-white hover:shadow-sm transition-all"
                    >
                      {item}
                      <X
                        size={14}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500"
                        onClick={(e) => { e.stopPropagation(); removeSearchHistory(item) }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-purple-500" />
                热门搜索
              </h3>
              <div className="flex flex-wrap gap-2">
                {hotKeywords.map((kw, index) => (
                  <button
                    key={index}
                    onClick={() => handleKeywordClick(kw)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-medium hover:from-indigo-100 hover:to-purple-100 transition-all"
                  >
                    {index + 1}. {kw}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">热门城市</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {CITIES.slice(0, 10).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.id)}
                    className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {city.name[0]}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{city.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                共找到 <span className="font-semibold text-indigo-600">{results.length}</span> 个结果
              </p>
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={14} />
                清空筛选
              </button>
            </div>

            {results.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">未找到相关结果</h3>
                <p className="text-gray-500">试试其他关键词或调整筛选条件</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((poi) => (
                  <POICard
                    key={poi.id}
                    poi={poi}
                    isFavorite={favorites.includes(poi.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
