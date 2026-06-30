import React, { useState } from 'react'
import GlassCard from './common/GlassCard'
import Button from './common/Button'
import { X, MapPin, Calendar, Users, Sparkles } from 'lucide-react'
import useUIStore from '../store/useUIStore'
import useTripStore from '../store/useTripStore'
import { CITIES } from '../data/pois'
import { useNavigate } from 'react-router-dom'

const CreateTripModal = () => {
  const navigate = useNavigate()
  const { isCreateModalOpen, closeCreateModal, showToast, successToast, errorToast } = useUIStore()
  const { createTrip } = useTripStore()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    cityName: '',
    days: 3,
    nights: 2,
    travelers: 2,
    startDate: ''
  })
  const [citySearch, setCitySearch] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  const filteredCities = CITIES.filter(city => 
    city.name.includes(citySearch) || city.country.includes(citySearch)
  )

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      if (field === 'days' && value > 0) {
        if (newData.nights >= value) {
          newData.nights = value - 1
        }
      }
      return newData
    })
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

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value) || 0
    const days = Math.max(1, Math.min(30, value))
    handleInputChange('days', days)
  }

  const handleNightsChange = (e) => {
    const value = parseInt(e.target.value) || 0
    const nights = Math.max(0, Math.min(formData.days, value))
    handleInputChange('nights', nights)
  }

  const handleNext = () => {
    if (!formData.city) {
      errorToast('请选择目的地城市')
      return
    }
    if (formData.days < 1) {
      errorToast('旅行天数不能少于1天')
      return
    }
    if (formData.nights > formData.days) {
      errorToast('夜数不能大于天数')
      return
    }
    setStep(2)
  }

  const handleCreate = () => {
    const tripName = formData.name || `${formData.cityName} ${formData.days}日游`
    const newTrip = createTrip({
      ...formData,
      name: tripName
    })
    
    successToast('行程创建成功！')
    closeCreateModal()
    navigate(`/trip/${newTrip.id}`)
    
    setFormData({
      name: '',
      city: '',
      cityName: '',
      days: 3,
      nights: 2,
      travelers: 2,
      startDate: ''
    })
    setCitySearch('')
    setStep(1)
  }

  const handleCreateWithAI = () => {
    closeCreateModal()
    navigate('/ai', {
      state: {
        presetCity: formData.city,
        presetDays: formData.days
      }
    })
  }

  const handleClose = () => {
    closeCreateModal()
    setStep(1)
    setFormData({
      name: '',
      city: '',
      cityName: '',
      days: 3,
      nights: 2,
      travelers: 2,
      startDate: ''
    })
    setCitySearch('')
  }

  if (!isCreateModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-md animate-slide-up">
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {step === 1 ? '新建行程' : '完善信息'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex gap-2 mt-4">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    s <= step
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            {step === 1 ? (
              <div className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      placeholder="搜索城市..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white/50"
                    />
                    {showCityDropdown && filteredCities.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-10">
                        {filteredCities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city)}
                            className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center justify-between transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            <span className="font-medium text-gray-800">{city.name}</span>
                            <span className="text-sm text-gray-500">{city.country}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={14} className="inline mr-1" />
                    旅行天数
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/50">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={formData.days}
                          onChange={handleDaysChange}
                          className="w-12 text-center text-2xl font-bold text-gray-800 bg-transparent outline-none"
                        />
                        <span className="text-gray-600 font-medium">天</span>
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-1">天数</p>
                    </div>
                    
                    <span className="text-2xl text-gray-300">/</span>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/50">
                        <input
                          type="number"
                          min="0"
                          max={formData.days}
                          value={formData.nights}
                          onChange={handleNightsChange}
                          className="w-12 text-center text-2xl font-bold text-gray-800 bg-transparent outline-none"
                        />
                        <span className="text-gray-600 font-medium">夜</span>
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-1">夜数</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    提示：夜数不能大于天数
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users size={14} className="inline mr-1" />
                    出行人数
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleInputChange('travelers', Math.max(1, formData.travelers - 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-gray-800 w-16 text-center">
                      {formData.travelers}
                    </span>
                    <button
                      onClick={() => handleInputChange('travelers', Math.min(20, formData.travelers + 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    行程名称（可选）
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={`${formData.cityName} ${formData.days}日游`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出发日期（可选）
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white/50"
                  />
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">AI 智能规划</p>
                      <p className="text-sm text-gray-600">
                        让 AI 为你自动生成个性化行程，省时又省心
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 pt-0 space-y-3">
            {step === 1 ? (
              <Button fullWidth onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <>
                <Button fullWidth onClick={handleCreate}>
                  创建空白行程
                </Button>
                <Button fullWidth variant="outline" icon={Sparkles} onClick={handleCreateWithAI}>
                  用 AI 智能规划
                </Button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3 text-center text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  返回上一步
                </button>
              </>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default CreateTripModal
