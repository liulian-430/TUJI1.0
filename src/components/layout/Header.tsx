import { useState, useRef, useCallback } from 'react';
import { Bell } from 'lucide-react';

export default function Header() {
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      window.location.href = '/ai-planner?voice=true';
    }
  }, [isRecording]);

  const handleClick = useCallback(() => {
    if (!isRecording) {
      window.location.href = '/new-trip';
    }
  }, [isRecording]);

  return (
    <>
      <header className="hidden md:block fixed top-4 left-4 right-4 z-50">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">途</span>
              </div>
              <span className="text-xl font-bold gradient-text">途迹</span>
            </div>
            <nav className="flex items-center gap-8">
              <a href="/" className="text-gray-600 hover:text-primary-mid transition-colors font-medium">首页</a>
              <a href="/ai-planner" className="text-gray-600 hover:text-primary-mid transition-colors font-medium">AI</a>
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
                className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-mid/30 hover:shadow-xl hover:shadow-primary-mid/40 active:scale-95 transition-all duration-300"
                style={{
                  boxShadow: isRecording 
                    ? '0 0 0 8px rgba(139, 92, 246, 0.3), 0 0 0 16px rgba(139, 92, 246, 0.2), 0 0 0 24px rgba(139, 92, 246, 0.1)'
                    : '0 6px 20px rgba(139, 92, 246, 0.4)',
                  transform: isRecording ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span className={`transition-transform duration-300 ${isRecording ? 'rotate-90' : ''}`}>＋</span>
              </button>
              <a href="/map" className="text-gray-600 hover:text-primary-mid transition-colors font-medium">地图</a>
              <a href="/profile" className="text-gray-600 hover:text-primary-mid transition-colors font-medium">我的</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl hover:bg-white/50 transition-colors">
                <Bell size={20} className="text-gray-600" />
              </button>
              <a href="/profile" className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-medium">我</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {showRecordingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 text-center">
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
