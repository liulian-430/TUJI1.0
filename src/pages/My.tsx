import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';
import {
  User,
  Star,
  MapPin,
  Settings,
  Heart,
  Calendar,
  Bell,
  Lock,
  LogOut,
  Moon,
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/useUserStore';
import { useTripStore } from '@/store/useTripStore';
import { useUIStore } from '@/store/useUIStore';

export function My() {
  const user = useUserStore((state) => state.user);
  const isGuest = useUserStore((state) => state.isGuest);
  const logout = useUserStore((state) => state.logout);
  const trips = useTripStore((state) => state.trips);
  const favorites = useTripStore((state) => state.favorites);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const menuItems = [
    { icon: Calendar, label: '我的行程', count: trips.length, path: '/my/trips' },
    { icon: Heart, label: '我的收藏', count: favorites.length, path: '/my/favorites' },
    { icon: MapPin, label: '我的足迹', count: 0, path: '/my/footprints' },
  ];

  const settingsItems = [
    { icon: Bell, label: '通知设置', action: () => {} },
    { icon: Lock, label: '隐私设置', action: () => {} },
    { icon: Moon, label: '主题切换', action: toggleTheme, value: theme === 'dark' ? '深色' : '浅色' },
    { icon: LogOut, label: '退出登录', action: logout },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      {/* 用户信息 */}
      <GlassCard className="mb-8">
        <div className="flex items-center gap-6">
          {/* 头像 */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>

          {/* 用户信息 */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold gradient-text mb-2">
              {isGuest ? '游客' : user?.username || '游客'}
            </h2>
            {isGuest ? (
              <p className="text-sm text-gray-500 mb-4">
                游客模式下数据仅保存在本地,登录后可同步云端
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-2">
                {user?.email || user?.phone}
              </p>
            )}
            {isGuest && (
              <Link to="/login">
                <Button size="sm">登录/注册</Button>
              </Link>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 数据统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <GlassCard hover className="flex items-center gap-4 p-4">
                <Icon className="w-6 h-6 text-indigo-500" />
                <div className="flex-1">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {item.label}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {item.count}
                  </span>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      {/* 我的行程列表 */}
      {trips.length > 0 && (
        <GlassCard className="mb-8">
          <h3 className="text-lg font-semibold gradient-text mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            我的行程
          </h3>
          <div className="space-y-3">
            {trips.slice(0, 5).map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`}>
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      {trip.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {trip.destination} · {trip.days}天{trip.nights}夜
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {trip.status === 'planning' ? '计划中' : trip.status === 'ongoing' ? '进行中' : '已完成'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 设置 */}
      <GlassCard>
        <h3 className="text-lg font-semibold gradient-text mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          设置
        </h3>
        <div className="space-y-2">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="flex-1 text-gray-800 dark:text-gray-200">
                  {item.label}
                </span>
                {item.value && (
                  <span className="text-xs text-gray-500">{item.value}</span>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}