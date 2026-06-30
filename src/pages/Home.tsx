import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight,
  Star,
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { useTripStore } from '@/store/useTripStore';
import { cities, getHotPOIs } from '@/data/pois';
import { formatDate } from '@/utils/format';

export function Home() {
  const trips = useTripStore((state) => state.trips);
  const recentTrips = trips.slice(0, 3);
  const hotPOIs = getHotPOIs(6);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Hero 区域 */}
      <section className="glass-card p-8 mb-8 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <h1 className="gradient-text font-bold text-3xl md:text-4xl mb-4">
            途迹 - 智能旅行规划
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg">
            AI 一键生成个性化行程,让每一次旅行都精彩纷呈。探索未知,记录足迹,留下美好回忆。
          </p>
          <div className="flex gap-4">
            <Link to="/ai">
              <Button variant="primary" icon={<Sparkles className="w-5 h-5" />}>
                AI 智能规划
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="outline" icon={<MapPin className="w-5 h-5" />}>
                探索景点
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 我的行程 */}
      {recentTrips.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold gradient-text flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              我的行程
            </h2>
            <Link
              to="/my"
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTrips.map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`}>
                <GlassCard hover className="h-full">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {trip.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {trip.destination} · {trip.days}天{trip.nights}夜
                  </p>
                  <p className="text-xs text-gray-500">
                    出发日期: {formatDate(trip.startDate)}
                  </p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 热门城市 */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold gradient-text">热门城市</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {cities.map((city) => (
            <Link
              key={city.name}
              to={`/search?city=${city.name}`}
              className="flex-shrink-0"
            >
              <div className="glass-card w-48 hover-lift img-hover-zoom">
                <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-xl overflow-hidden">
                  {city.image && (
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-500">{city.pois}景点</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 热门景点 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold gradient-text flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            热门景点
          </h2>
          <Link
            to="/search"
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            查看更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotPOIs.map((poi) => (
            <Link key={poi.id} to={`/poi/${poi.id}`}>
              <GlassCard hover className="img-hover-zoom">
                <div className="h-40 rounded-xl overflow-hidden mb-3">
                  {poi.images[0] && (
                    <img
                      src={poi.images[0]}
                      alt={poi.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {poi.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600">
                    {poi.type}
                  </span>
                  <span className="text-xs text-gray-500">{poi.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">{poi.rating}</span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}