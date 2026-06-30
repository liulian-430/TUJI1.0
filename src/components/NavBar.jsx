import React, { useState, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, Sparkles, Plus, Map, User, 
  Mic, X
} from 'lucide-react'
import useUIStore from '../store/useUIStore'

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { openCreateModal, showToast } = useUIStore()
  const [isRecording, setIsRecording] = useState(false)
  const [ripples, setRipples] = useState([])
  const longPressTimer = useRef(null)
  const rippleInterval = useRef(null)

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/ai', icon: Sparkles, label: 'AI规划' },
    { path: '/map', icon: Map, label: '地图' },
    { path: '/my', icon: User, label: '我的' }
  ]

  const handleCenterClick = () => {
    openCreateModal()
  }

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsRecording(true)
      showToast('开始语音输入...', 'info', 0)
      
      rippleInterval.current = setInterval(() => {
        const newRipple = {
          id: Date.now() + Math.random(),
          left: 40 + Math.random() * 20,
          delay: Math.random() * 0.3
        }
        setRipples(prev => [...prev, newRipple])
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id))
        }, 2000)
      }, 400)
    }, 500)
  }

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    
    if (rippleInterval.current) {
      clearInterval(rippleInterval.current)
      rippleInterval.current = null
    }
    
    if (isRecording) {
      setIsRecording(false)
      setRipples([])
      showToast('语音识别中...', 'success')
      setTimeout(() => {
        navigate('/ai')
      }, 800)
    }
  }

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (rippleInterval.current) {
      clearInterval(rippleInterval.current)
      rippleInterval.current = null
    }
    if (isRecording) {
      setIsRecording(false)
      setRipples([])
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {isRecording && (
        <div className="fixed inset-0 bg-gradient-to-b from-purple-500/20 to-pink-500/20 z-40 pointer-events-none">
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute bottom-20 w-4 h-4 rounded-full bg-gradient-to-t from-purple-400 to-pink-300 opacity-60"
              style={{
                left: `calc(50% - 8px + ${(ripple.left - 50) * 2}px)`,
                animation: `floatUp 2s ease-out ${ripple.delay}s forwards`,
                filter: 'blur(2px)'
              }}
            />
          ))}
          <style>{`
            @keyframes floatUp {
              0% {
                transform: translateY(0) scale(1);
                opacity: 0.6;
              }
              100% {
                transform: translateY(-300px) scale(1.5);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="backdrop-blur-xl bg-white/80 border-t border-white/50 shadow-2xl">
          <div className="flex items-end justify-around px-2 pt-2 pb-safe">
            {navItems.map((item, index) => (
              <React.Fragment key={item.path}>
                {index === 2 && (
                  <div className="relative -mt-8">
                    <button
                      onClick={handleCenterClick}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={handleMouseDown}
                      onTouchEnd={handleMouseUp}
                      className={`
                        relative w-14 h-14 rounded-full 
                        bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                        shadow-lg shadow-purple-500/40
                        flex items-center justify-center
                        transition-all duration-300
                        active:scale-90
                        ${isRecording ? 'scale-110 animate-pulse' : 'hover:shadow-xl hover:shadow-purple-500/50'}
                      `}
                    >
                      {isRecording ? (
                        <Mic className="w-6 h-6 text-white animate-bounce" />
                      ) : (
                        <Plus className="w-7 h-7 text-white" />
                      )}
                      
                      {isRecording && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                          <div className="absolute -inset-2 rounded-full border-2 border-purple-300/50 animate-pulse" />
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                <NavLink
                  to={item.path}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                    transition-all duration-200
                    ${isActive(item.path)
                      ? 'text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <item.icon size={22} className={isActive(item.path) ? 'animate-bounce' : ''} />
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="h-20" />
      </nav>

      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  途迹
                </span>
              </div>

              <div className="flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl
                      font-medium transition-all duration-200
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-800'
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                
                <div className="w-px h-6 bg-gray-200 mx-2" />
                
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <Plus size={20} />
                  <span>新建行程</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-16" />
      </nav>
    </>
  )
}

export default NavBar
