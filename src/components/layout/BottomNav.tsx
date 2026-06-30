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
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setIsRecording(true);
      setShowRecordingModal(true);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isRecording) {
      setIsRecording(false);
      setShowRecordingModal(false);
      navigate('/ai-planner?voice=true');
    }
  }, [isRecording, navigate]);

  const handleClick = useCallback(() => {
    if (!isRecording) {
      navigate('/new-trip');
    }
  }, [isRecording, navigate]);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 via-white/50 to-transparent pointer-events-none" />
        
        <div className="mx-4 mb-4 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/50 px-6 py-3">
          <div className="flex items-center justify-between">
            {navItems.slice(0, 2).map(({ path, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-center min-w-[3rem] transition-all duration-300 ${
                  isActive(path)
                    ? 'text-primary-mid font-medium'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-sm">{label}</span>
              </button>
            ))}

            <div className="relative">
              <button
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onMouseLeave={() => {
                  if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                  }
                }}
                className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-mid/30 hover:shadow-xl hover:shadow-primary-mid/40 active:scale-95 transition-all duration-300 -mt-8"
                style={{
                  boxShadow: isRecording 
                    ? '0 0 0 10px rgba(139, 92, 246, 0.3), 0 0 0 20px rgba(139, 92, 246, 0.2), 0 0 0 30px rgba(139, 92, 246, 0.1)'
                    : '0 8px 25px rgba(139, 92, 246, 0.4)',
                  transform: isRecording ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span className={`transition-transform duration-300 ${isRecording ? 'rotate-90' : ''}`}>＋</span>
              </button>
            </div>

            {navItems.slice(2).map(({ path, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-center min-w-[3rem] transition-all duration-300 ${
                  isActive(path)
                    ? 'text-primary-mid font-medium'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {showRecordingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce-in">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-ping" />
              <div className="absolute inset-2 bg-gradient-primary rounded-full opacity-40 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-4 bg-gradient-primary rounded-full opacity-60 animate-ping" style={{ animationDelay: '0.4s' }} />
              <div className="absolute inset-0 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">＋</span>
              </div>
            </div>
            <p className="text-gray-700 font-medium mb-2">正在录音...</p>
            <p className="text-gray-400 text-sm">松开手指完成录音</p>
          </div>
        </div>
      )}
    </>
  );
}
