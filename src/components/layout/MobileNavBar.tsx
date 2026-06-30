import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Plus,
  Map,
  User,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/ai', icon: Sparkles, label: '规划' },
  { path: '/create', icon: Plus, label: '新建', isCenter: true },
  { path: '/map', icon: Map, label: '地图' },
  { path: '/my', icon: User, label: '我的' },
];

export function MobileNavBar() {
  const location = useLocation();
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleLongPressStart = () => {
    setIsLongPressing(true);
    // 语音输入动效开始
  };

  const handleLongPressEnd = () => {
    setIsLongPressing(false);
    // 语音输入结束,跳转到 AI 规划页
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-card rounded-none py-2 px-4 safe-area-bottom">
      {/* 语音输入絮状物动效 */}
      {isLongPressing && (
        <div className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full particle-float opacity-60"
              style={{
                left: `${20 + i * 10}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isCenter = item.isCenter;

          if (isCenter) {
            return (
              <button
                key={item.path}
                onTouchStart={handleLongPressStart}
                onTouchEnd={handleLongPressEnd}
                onMouseDown={handleLongPressStart}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={() => setIsLongPressing(false)}
                className={twMerge(
                  clsx(
                    'relative flex items-center justify-center',
                    'w-14 h-14 rounded-full',
                    'bg-gradient-to-r from-indigo-500 to-purple-600',
                    'shadow-lg shadow-indigo-500/30',
                    'transform transition-transform duration-200',
                    isLongPressing && 'scale-110'
                  )
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={twMerge(
                clsx(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                )
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}