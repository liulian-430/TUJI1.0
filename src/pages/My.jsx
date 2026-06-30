import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import Button from '../components/common/Button'
import { 
  User, MapPin, Heart, Calendar, Settings, 
  ChevronRight, LogOut, Moon, Bell, Shield,
  HelpCircle, Info, Star, Award, Footprints
} from 'lucide-react'
import useUserStore from '../store/useUserStore'
import useTripStore from '../store/useTripStore'
import useUIStore from '../store/useUIStore'
import { APP_VERSION } from '../config/version'

const My = () => {
  const navigate = useNavigate()
  const { user, isGuest, isLoggedIn, logout, updateSettings, settings, enterGuestMode } = useUserStore()
  const { trips, favorites, footprint } = useTripStore()
  const { toggleTheme, theme, showToast, successToast } = useUIStore()

  const handleLogin = () => {
    showToast('登录功能开发中', 'info')
  }

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout()
      successToast('已退出登录')
    }
  }

  const menuGroups = [
    {
      title: '我的',
      items: [
        { icon: Calendar, label: '我的行程', value: `${trips.length} 个`, onClick: () => navigate('/') },
        { icon: Heart, label: '我的收藏', value: `${favorites.length} 个`, onClick: () => {} },
        { icon: Footprints, label: '我的足迹', value: `${footprint.length} 个`, onClick: () => {} },
      ]
    },
    {
      title: '设置',
      items: [
        { 
          icon: Moon, 
          label: '深色模式', 
          type: 'toggle',
          value: theme === 'dark',
          onClick: () => toggleTheme()
        },
        { 
          icon: Bell, 
          label: '消息通知', 
          type: 'toggle',
          value: settings.pushNotifications,
          onClick: () => updateSettings({ pushNotifications: !settings.pushNotifications })
        },
        { icon: Shield, label: '隐私安全', onClick: () => {} },
        { icon: HelpCircle, label: '帮助与反馈', onClick: () => {} },
        { icon: Info, label: '关于我们', onClick: () => {} },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">我的</h1>
        </div>

        <GlassCard className="p-6 mb-6">
          {isGuest ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 mb-1">游客模式</h2>
                <p className="text-sm text-gray-500 mb-3">登录后可同步数据，解锁更多功能</p>
                <Button size="sm" onClick={handleLogin}>
                  登录 / 注册
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-2xl font-bold text-white">
                  {user?.nickname?.[0] || '用'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{user?.nickname}</h2>
                <p className="text-sm text-gray-500">{user?.bio}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">Lv.{user?.level || 1}</span>
                </div>
              </div>
              <button
                onClick={() => {}}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          )}
        </GlassCard>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <GlassCard variant="sm" className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{trips.length}</p>
            <p className="text-xs text-gray-500 mt-1">行程</p>
          </GlassCard>
          <GlassCard variant="sm" className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{favorites.length}</p>
            <p className="text-xs text-gray-500 mt-1">收藏</p>
          </GlassCard>
          <GlassCard variant="sm" className="p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">{footprint.length}</p>
            <p className="text-xs text-gray-500 mt-1">足迹</p>
          </GlassCard>
        </div>

        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 px-2 mb-2">{group.title}</h3>
            <GlassCard className="overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 text-left
                    hover:bg-gray-50/80 transition-colors
                    ${itemIndex < group.items.length - 1 ? 'border-b border-gray-100' : ''}
                  `}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <item.icon size={20} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-800 font-medium">{item.label}</span>
                  </div>
                  {item.type === 'toggle' ? (
                    <div className={`
                      w-12 h-7 rounded-full p-1 transition-colors
                      ${item.value ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200'}
                    `}>
                      <div className={`
                        w-5 h-5 rounded-full bg-white shadow-md transition-transform
                        ${item.value ? 'translate-x-5' : 'translate-x-0'}
                      `} />
                    </div>
                  ) : item.value ? (
                    <span className="text-sm text-gray-500">{item.value}</span>
                  ) : (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                </button>
              ))}
            </GlassCard>
          </div>
        ))}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-4 rounded-2xl bg-white/70 backdrop-blur-sm text-rose-500 font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            退出登录
          </button>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          途迹 v{APP_VERSION}
        </p>
      </div>
    </div>
  )
}

export default My
