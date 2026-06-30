import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Map,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { cities } from '@/data/pois';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/ai', icon: Sparkles, label: 'AI规划' },
  { path: '/map', icon: Map, label: '地图' },
  { path: '/search', icon: Search, label: '搜索' },
  { path: '/my', icon: User, label: '我的' },
];

export function Sidebar() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <aside
      className={twMerge(
        clsx(
          'glass-card sticky top-20 h-[calc(100vh-100px)] overflow-y-auto',
          'transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )
      )}
    >
      {/* 收起/展开按钮 */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>

      <div className="p-4">
        {/* 快捷入口 */}
        {!sidebarCollapsed && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">快捷入口</h3>
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      twMerge(
                        clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-white/10'
                        )
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {/* 热门城市 */}
        {!sidebarCollapsed && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              热门城市
            </h3>
            <div className="space-y-2">
              {cities.slice(0, 8).map((city) => (
                <NavLink
                  key={city.name}
                  to={`/search?city=${city.name}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-white/10 transition-all duration-200"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-gray-400">{city.pois}景点</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* 收起状态下的图标 */}
        {sidebarCollapsed && (
          <div className="space-y-4 mt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    twMerge(
                      clsx(
                        'flex items-center justify-center p-2 rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600'
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-white/10'
                      )
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}