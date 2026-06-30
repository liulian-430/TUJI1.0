import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Plus,
  Map,
  User,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useUserStore } from '@/store/useUserStore';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/ai', icon: Sparkles, label: 'AI规划' },
  { path: '/map', icon: Map, label: '地图' },
  { path: '/search', icon: Search, label: '搜索' },
  { path: '/my', icon: User, label: '我的' },
];

export function DesktopNavBar() {
  const location = useLocation();
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const user = useUserStore((state) => state.user);
  const isGuest = useUserStore((state) => state.isGuest);

  return (
    <nav className="glass-card sticky top-0 z-40 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">途</span>
          </div>
          <h1 className="gradient-text font-bold text-xl">途迹</h1>
        </div>

        {/* 导航链接 */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isCreate = item.path === '/ai' && item.icon === Plus;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={twMerge(
                  clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-white/10'
                  )
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-4">
          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-gray-300" />
            )}
          </button>

          {/* 用户信息 */}
          <div className="flex items-center gap-2">
            {isGuest ? (
              <span className="text-sm text-gray-500">游客模式</span>
            ) : (
              <div className="flex items-center gap-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0) || '游'}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.username || '游客'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}