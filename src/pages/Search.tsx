import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon,
  X,
  Filter,
  Star,
  MapPin,
  History,
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useUIStore } from '@/store/useUIStore';
import { pois, searchPOIs, getPOIsByCity, getPOIsByType } from '@/data/pois';
import { HOT_CITIES, POI_TYPES } from '@/config/constants';

export function Search() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<typeof pois>([]);

  const searchHistory = useUIStore((state) => state.searchHistory);
  const addSearchHistory = useUIStore((state) => state.addSearchHistory);
  const clearSearchHistory = useUIStore((state) => state.clearSearchHistory);

  useEffect(() => {
    let filtered = pois;

    if (keyword) {
      filtered = searchPOIs(keyword);
    }

    if (city) {
      filtered = filtered.filter((p) => p.city === city);
    }

    if (type) {
      filtered = filtered.filter((p) => p.type === type);
    }

    // 排序
    filtered = [...filtered].sort((a, b) =>
      sortBy === 'rating' ? b.rating - a.rating : a.price - b.price
    );

    setResults(filtered);
  }, [keyword, city, type, sortBy]);

  const handleSearch = () => {
    if (keyword) {
      addSearchHistory(keyword);
    }
  };

  const handleClearHistory = () => {
    clearSearchHistory();
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* 搜索框 */}
      <GlassCard className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索景点、美食、酒店..."
              icon={<SearchIcon className="w-5 h-5" />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <SearchIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-5 h-5" />}
          >
            筛选
          </Button>
        </div>

        {/* 搜索历史 */}
        {searchHistory.length > 0 && !keyword && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <History className="w-4 h-4" />
                搜索历史
              </span>
              <button
                onClick={handleClearHistory}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                清空
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((h) => (
                <button
                  key={h}
                  onClick={() => setKeyword(h)}
                  className="px-3 py-1 rounded-lg bg-white/10 text-sm text-gray-600 hover:bg-white/20 transition-colors"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* 筛选器 */}
      {showFilters && (
        <GlassCard className="mb-6 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 城市 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                城市
              </label>
              <div className="flex flex-wrap gap-2">
                {HOT_CITIES.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(city === c ? '' : c)}
                    className={twMerge(
                      clsx(
                        'px-3 py-1.5 rounded-xl text-sm transition-all',
                        city === c
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-500/30'
                          : 'bg-white/10 text-gray-600 hover:bg-white/20'
                      )
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                类型
              </label>
              <div className="flex flex-wrap gap-2">
                {POI_TYPES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setType(type === t.key ? '' : t.key)}
                    className={twMerge(
                      clsx(
                        'px-3 py-1.5 rounded-xl text-sm transition-all',
                        type === t.key
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-500/30'
                          : 'bg-white/10 text-gray-600 hover:bg-white/20'
                      )
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 排序 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                排序
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('rating')}
                  className={twMerge(
                    clsx(
                      'px-3 py-1.5 rounded-xl text-sm transition-all flex items-center gap-1',
                      sortBy === 'rating'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-500/30'
                        : 'bg-white/10 text-gray-600 hover:bg-white/20'
                    )
                  )}
                >
                  <Star className="w-4 h-4" />
                  评分
                </button>
                <button
                  onClick={() => setSortBy('price')}
                  className={twMerge(
                    clsx(
                      'px-3 py-1.5 rounded-xl text-sm transition-all',
                      sortBy === 'price'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-500/30'
                        : 'bg-white/10 text-gray-600 hover:bg-white/20'
                    )
                  )}
                >
                  价格
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* 搜索结果 */}
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          共找到 {results.length} 个结果
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((poi) => (
          <Link key={poi.id} to={`/poi/${poi.id}`}>
            <GlassCard hover className="img-hover-zoom">
              <div className="h-48 rounded-xl overflow-hidden mb-3">
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
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {poi.city}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">{poi.rating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ¥{poi.price}
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无搜索结果</p>
        </div>
      )}
    </div>
  );
}