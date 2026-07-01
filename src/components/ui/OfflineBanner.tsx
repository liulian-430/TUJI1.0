import { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

/**
 * 离线状态监测 Hook
 * 返回当前在线状态
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

interface OfflineBannerProps {
  onDismiss?: () => void;
}

/**
 * 离线状态顶部横幅
 * 网络断开时显示，恢复后自动隐藏或点击关闭
 */
export function OfflineBanner({ onDismiss }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();
  const [visible, setVisible] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      // 恢复在线后 3 秒自动隐藏
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-20 md:top-8 left-0 right-0 z-[60] flex justify-center px-4 animate-bounce-in`}
    >
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-xl border transition-all ${
          isOnline
            ? 'bg-green-500/90 border-green-400 text-white'
            : 'bg-red-500/90 border-red-400 text-white'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi size={18} />
            <span className="text-sm font-medium">网络已恢复，数据已同步</span>
          </>
        ) : (
          <>
            <WifiOff size={18} />
            <span className="text-sm font-medium">网络已断开，当前使用缓存数据</span>
          </>
        )}
        <button
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="ml-2 p-0.5 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default OfflineBanner;
