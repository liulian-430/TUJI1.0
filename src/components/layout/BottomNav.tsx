import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/ai-planner', label: 'AI' },
  { path: '/map', label: '地图' },
  { path: '/profile', label: '我的' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [tripName, setTripName] = useState('');
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartY = useRef<number>(0);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    pressStartY.current = e.touches[0].clientY;
    longPressTimer.current = setTimeout(() => {
      setIsRecording(true);
    }, 500);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    if (e.touches.length > 0) {
      const currentY = e.touches[0].clientY;
      if (pressStartY.current - currentY > 50) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        setIsRecording(false);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isRecording) {
      setIsRecording(false);
      navigate('/ai-planner?voice=true');
    }
  }, [isRecording, navigate]);

  const handleMouseDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setIsRecording(true);
    }, 500);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isRecording) {
      setIsRecording(false);
      navigate('/ai-planner?voice=true');
    }
  }, [isRecording, navigate]);

  const handleClick = useCallback(() => {
    if (!isRecording) {
      setShowTripModal(true);
    }
  }, [isRecording]);

  const handleCreateTrip = () => {
    if (tripName.trim()) {
      setShowTripModal(false);
      setTripName('');
      navigate('/profile');
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/95 via-white/60 to-transparent pointer-events-none" />
        
        <div className="relative mx-4 mb-4 bg-white/40 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 px-6 py-4">
          <div className="flex items-center justify-between">
            {navItems.slice(0, 2).map(({ path, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-center min-w-[3rem] transition-all duration-300 ${
                  isActive(path)
                    ? 'text-primary-mid font-semibold'
                    : 'text-gray-400/70 hover:text-gray-600'
                }`}
              >
                <span className="text-sm tracking-wide">{label}</span>
              </button>
            ))}

            <div className="relative -mt-10">
              <button
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: isRecording
                    ? '0 0 30px rgba(99, 102, 241, 0.8), 0 0 60px rgba(139, 92, 246, 0.5), 0 0 90px rgba(99, 102, 241, 0.3)'
                    : '0 10px 40px rgba(139, 92, 246, 0.5)',
                  transform: isRecording ? 'scale(1.1)' : 'scale(1)',
                  filter: isRecording ? 'blur(1px)' : 'none',
                }}
              >
                {isRecording ? (
                  <svg className="w-8 h-8 animate-pulse" viewBox="0 0 24 24" fill="white">
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                  </svg>
                ) : (
                  <span>＋</span>
                )}
              </button>

              {isRecording && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none">
                  <div className="relative w-32 h-40">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-white/60 to-indigo-400/40 backdrop-blur-sm"
                        style={{
                          left: `${50 + Math.sin(i * 1.3) * 40}%`,
                          bottom: '0',
                          width: `${6 + Math.random() * 8}px`,
                          height: `${6 + Math.random() * 8}px`,
                          animation: `bubbleRise ${1.5 + Math.random() * 1}s ease-out infinite`,
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs text-gray-600/90 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg font-medium">
                      松手进入AI规划 · 上划取消
                    </span>
                  </div>
                </div>
              )}
            </div>

            {navItems.slice(2).map(({ path, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-center min-w-[3rem] transition-all duration-300 ${
                  isActive(path)
                    ? 'text-primary-mid font-semibold'
                    : 'text-gray-400/70 hover:text-gray-600'
                }`}
              >
                <span className="text-sm tracking-wide">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {showTripModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
          onClick={() => setShowTripModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'modalPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-5">
              <h3 className="text-xl font-bold text-white text-center">新建行程</h3>
              <p className="text-white/80 text-sm text-center mt-1">开始规划你的下一次旅行</p>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">行程名称</label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="例如：北京三日游"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-mid/30 focus:border-primary-mid/30 text-base transition-all"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTripModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateTrip}
                  disabled={!tripName.trim()}
                  className="flex-1 py-4 rounded-2xl bg-gradient-primary text-white font-semibold shadow-lg shadow-primary-mid/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:shadow-primary-mid/40"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120px) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes modalPopIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
