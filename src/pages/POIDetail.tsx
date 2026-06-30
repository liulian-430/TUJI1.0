import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Heart,
  Plus,
  ChevronLeft,
  Share2,
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { useTripStore } from '@/store/useTripStore';
import { useUIStore } from '@/store/useUIStore';
import { getPOIById, getPOIsByCity } from '@/data/pois';
import { formatAddress, formatRating } from '@/utils/format';

export function POIDetail() {
  const { id } = useParams();
  const poi = getPOIById(id || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const favorites = useTripStore((state) => state.favorites);
  const addFavorite = useTripStore((state) => state.addFavorite);
  const removeFavorite = useTripStore((state) => state.removeFavorite);
  const addToast = useUIStore((state) => state.addToast);

  if (!poi) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GlassCard className="text-center py-12">
          <p className="text-gray-500">景点不存在</p>
          <Link to="/search">
            <Button className="mt-4">返回搜索</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const relatedPOIs = getPOIsByCity(poi.city).filter((p) => p.id !== poi.id).slice(0, 4);

  const handleFavorite = () => {
    if (favorites.includes(poi.id)) {
      removeFavorite(poi.id);
      addToast({ type: 'info', message: '已取消收藏' });
    } else {
      addFavorite(poi.id);
      addToast({ type: 'success', message: '已添加收藏' });
    }
    setIsFavorite(!isFavorite);
  };

  const handleAddToTrip = () => {
    addToast({ type: 'info', message: '请先创建行程' });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* 返回按钮 */}
      <Link
        to="/search"
        className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>返回搜索</span>
      </Link>

      {/* 图片轮播 */}
      <GlassCard className="mb-6 overflow-hidden">
        <div className="relative h-64 md:h-400">
          <img
            src={poi.images[currentImageIndex] || poi.images[0]}
            alt={poi.name}
            className="w-full h-full object-cover"
          />
          {poi.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {poi.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={twMerge(
                    clsx(
                      'w-2 h-2 rounded-full transition-all',
                      idx === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/80'
                    )
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* 基本信息 */}
      <GlassCard className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text mb-2">{poi.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600">
                {poi.type}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" />
                {formatRating(poi.rating)}
              </span>
            </div>
          </div>
          <button
            onClick={handleFavorite}
            className={twMerge(
              clsx(
                'p-3 rounded-xl transition-colors',
                favorites.includes(poi.id)
                  ? 'bg-rose-500/20 text-rose-500'
                  : 'bg-white/10 text-gray-500 hover:bg-rose-500/10 hover:text-rose-500'
              )
            )}
          >
            <Heart className={twMerge(clsx('w-6 h-6', favorites.includes(poi.id) && 'fill-current'))} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-indigo-500" />
            <span>{formatAddress(poi.city, poi.address)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span>{poi.openTime}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <DollarSign className="w-5 h-5 text-indigo-500" />
            <span>¥{poi.price}</span>
          </div>
        </div>

        {/* 简介 */}
        <div className="border-t border-white/10 pt-4 mb-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">景点简介</h2>
          <p className="text-gray-600 dark:text-gray-400">{poi.description}</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <Button onClick={handleAddToTrip} fullWidth icon={<Plus className="w-5 h-5" />}>
            添加到行程
          </Button>
          <Button variant="outline" icon={<Share2 className="w-5 h-5" />}>
            分享
          </Button>
        </div>
      </GlassCard>

      {/* 相关推荐 */}
      {relatedPOIs.length > 0 && (
        <GlassCard>
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            相关推荐
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedPOIs.map((related) => (
              <Link key={related.id} to={`/poi/${related.id}`}>
                <GlassCard hover className="img-hover-zoom">
                  <div className="h-32 rounded-xl overflow-hidden mb-2">
                    {related.images[0] && (
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {related.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-500" />
                    <span className="text-xs">{related.rating}</span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}