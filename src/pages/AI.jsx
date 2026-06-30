import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import Button from '../components/common/Button'
import { 
  Sparkles, MapPin, Calendar, Users, Wallet, 
  Mountain, Landmark, Utensils, Sun,
  ShoppingBag, Compass, ChevronRight, Wand,
  Loader2
} from 'lucide-react'
import useTripStore from '../store/useTripStore'
import useUIStore from '../store/useUIStore'
import { CITIES, TRAVEL_PREFERENCES } from '../data/pois'

const AI = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { generateAItinerary, setCurrentTrip } = useTripStore()
  const { showLoading, hideLoading, successToast, errorToast, addSearchHistory } = useUIStore()
  
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [formData, setFormData] = useState({
    city: '',
    cityName: '',
    days: 3,
    travelers: 2,
    preferences: [],
    budget: 'medium'
  })

  useEffect(() => {
    if (location.state?.presetCity) {
      const city = CITIES.find(c => c.id === location.state.presetCity)
      if (city) {
        setFormData(prev => ({
          ...prev,
          city: city.id,
          cityName: city.name
        }))
        setCitySearch(city.name)
      }
    }
    if (location.state?.presetDays) {
      setFormData(prev => ({
        ...prev,
        days: location.state.presetDays
      }))
    }
  }, [location.state])

  const filteredCities = CITIES.filter(city => 
    city.name.includes(citySearch) || city.country.includes(citySearch)
  )

  const preferenceIcons = {
    nature: Mountain,
    culture: Landmark,
    food: Utensils,
    relax: Sun,
    shopping: ShoppingBag,
    adventure: Compass
  }

  const handleCitySelect = (city) => {
    setFormData(prev => ({
      ...prev,
      city: city.id,
      cityName: city.name
    }))
    setCitySearch(city.name)
    setShowCityDropdown(false)
  }

  const togglePreference = (prefId) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(p => p !== prefId)
        : [...prev.preferences, prefId]
    }))
  }

  const handleNext = () => {
    if (step === 1 && !formData.city) {
      errorToast('请选择目的地城市')
      return
    }
    if (step === 1 && formData.days < 1) {
      errorToast('旅行天数不能少于1天')
      return
    }
    setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleGenerate = async () => {
    if (!formData.city) {
      errorToast('请选择目的地城市')
      return
    }

    setIsGenerating(true)
    showLoading('AI 正在为你规划行程...')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const trip = generateAItinerary({
        city: formData.city,
        days: formData.days,
        preferences: formData.preferences,
        budget: formData.budget,
        travelers: formData.travelers
      })

      successToast('行程生成成功！')
      setCurrentTrip(trip.id)
      
      setTimeout(() => {
        navigate(`/trip/${trip.id}`)
      }, 500)
    } catch (error) {
      errorToast('生成失败，请重试')
    } finally {
      setIsGenerating(false)
      hideLoading()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/30 animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI 智能规划
          </h1>
          <p className="text-gray-500">告诉我们你的喜好，一键生成专属行程</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                transition-all duration-300
                ${s < step ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' :
                  s === step ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white scale-110 shadow-lg shadow-purple-500/30' :
                  'bg-gray-200 text-gray-500'
                }
              `}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`w-12 md:w-20 h-1 mx-1 rounded-full transition-all duration-300 ${
                  s < step ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <GlassCard className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={14} className="inline mr-1" />
                  目的地城市
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value)
                      setShowCityDropdown(true)
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="搜索或选择城市..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white/50"
                  />
                  {showCityDropdown && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-10">
                      {filteredCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                          className={`w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center justify-between transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            formData.city === city.id ? 'bg-indigo-50 text-indigo-600' : ''
                          }`}
                        >
                          <span className="font-medium">{city.name}</span>
                          <span className="text-sm text-gray-500">{city.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Calendar size={14} className="inline mr-1" />
                  旅行天数
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, days: Math.max(1, prev.days - 1) }))}
                    className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {formData.days}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">天</p>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, days: Math.min(30, prev.days + 1) }))}
                    className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {[3, 5, 7, 10].map((d) => (
                    <button
                      key={d}
                      onClick={() => setFormData(prev => ({ ...prev, days: d }))}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.days === d
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d}天
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Users size={14} className="inline mr-1" />
                  出行人数
                </label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-800 w-16 text-center">
                    {formData.travelers} 人
                  </span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, travelers: Math.min(20, prev.travelers + 1) }))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  旅行偏好（可多选）
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TRAVEL_PREFERENCES.map((pref) => {
                    const Icon = preferenceIcons[pref.id]
                    const isSelected = formData.preferences.includes(pref.id)
                    return (
                      <button
                        key={pref.id}
                        onClick={() => togglePreference(pref.id)}
                        className={`
                          p-4 rounded-2xl text-left transition-all duration-200
                          ${isSelected
                            ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-400 shadow-md'
                            : 'bg-white/50 border-2 border-transparent hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className={`w-10 h-10 rounded-xl mb-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {Icon && <Icon size={20} />}
                        </div>
                        <p className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {pref.label}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Wallet size={14} className="inline mr-1" />
                  预算范围
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'low', label: '经济实惠', price: '¥2000以下', icon: '💰' },
                    { id: 'medium', label: '舒适体验', price: '¥2000-5000', icon: '✨' },
                    { id: 'high', label: '奢华享受', price: '¥5000以上', icon: '👑' }
                  ].map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setFormData(prev => ({ ...prev, budget: budget.id }))}
                      className={`
                        p-4 rounded-2xl text-center transition-all duration-200
                        ${formData.budget === budget.id
                          ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-400 shadow-md'
                          : 'bg-white/50 border-2 border-transparent hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="text-2xl mb-2">{budget.icon}</div>
                      <p className={`font-medium text-sm ${formData.budget === budget.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {budget.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{budget.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                <h4 className="font-semibold text-gray-800 mb-3">行程预览</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>目的地</span>
                    <span className="font-medium text-gray-800">{formData.cityName || '未选择'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>天数</span>
                    <span className="font-medium text-gray-800">{formData.days} 天</span>
                  </div>
                  <div className="flex justify-between">
                    <span>出行人数</span>
                    <span className="font-medium text-gray-800">{formData.travelers} 人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>偏好</span>
                    <span className="font-medium text-gray-800">
                      {formData.preferences.length > 0
                        ? formData.preferences.map(p => TRAVEL_PREFERENCES.find(x => x.id === p)?.label).join('、')
                        : '无'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>预算</span>
                    <span className="font-medium text-gray-800">
                      {{ low: '经济实惠', medium: '舒适体验', high: '奢华享受' }[formData.budget]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button variant="secondary" onClick={handlePrev}>
                上一步
              </Button>
            )}
            {step < 3 ? (
              <Button fullWidth onClick={handleNext}>
                下一步
                <ChevronRight size={18} className="ml-1" />
              </Button>
            ) : (
              <Button
                fullWidth
                icon={isGenerating ? Loader2 : Wand}
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={isGenerating}
              >
                {isGenerating ? '生成中...' : '开始生成行程'}
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default AI
