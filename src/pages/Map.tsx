import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Star, Search } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { pois } from '@/data/pois';

export function Map() {
  const [selectedPOI, setSelectedPOI] = useState<typeof pois[0] | null>(null);
  const [searchCity, setSearchCity] = useState('');

  const filteredPOIs = searchCity
    ? pois.filter((p) => p.city.includes(searchCity))
    : pois;

  // 模拟地图显示
  const mapCenter = { lat: 30.5, lng: 110 };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex gap-6">
        {/* 地图区域 */}
        <div className="flex-1">
          <GlassCard className="h-[600px] relative overflow-hidden">
            {/* 模拟地图背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-indigo-50">
              {/* 网格线 */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border border-gray-300"
                    style={{
                      width: '100%',
                      height: '1px',
                      top: `${i * 5}%`,
                    }}
                  />
                ))}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border border-gray-300"
                    style={{
                      width: '1px',
                      height: '100%',
                      left: `${i * 5}%`,
                    }}
                  />
                ))}
              </div>

              {/* POI 标记点 */}
              {filteredPOIs.map((poi) => {
                const x = ((poi.longitude - 100) / 20) * 100;
                const y = ((40 - poi.latitude) / 20) * 100;
                return (
                  <button
                    key={poi.id}
                    onClick={() => setSelectedPOI(poi)}
                    className={twMerge(
                      clsx(
                        'absolute w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600',
                        'flex items-center justify-center',
                        'transform -translate-x-1/2 -translate-y-1/2',
                        'cursor-pointer hover:scale-110 transition-transform',
                        'shadow-lg shadow-indigo-500/30',
                        selectedPOI?.id === poi.id && 'scale-125 ring-2 ring-white'
                      )
                    )}
                    style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </button>
                );
              })}
            </div>

            {/* 搜索框 */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="glass-card p-2 flex items-center gap-2 max-w-md mx-auto">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索城市..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 侧边信息面板 */}
        <div className="w-80 hidden md:block">
          <GlassCard className="h-[600px] overflow-y-auto">
            <h2 className="text-lg font-semibold gradient-text mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              景点列表
            </h2>

            {selectedPOI ? (
              <div className="space-y-4">
                {/* 选中的 POI 详情 */}
                <div className="img-hover-zoom">
                  <div className="h-48 rounded-xl overflow-hidden mb-3">
                    {selectedPOI.images[0] && (
                      <img
                        src={selectedPOI.images[0]}
                        alt={selectedPOI.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {selectedPOI.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">{selectedPOI.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {selectedPOI.address}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{selectedPOI.description}</p>
                  <Link to={`/poi/${selectedPOI.id}`}>
                    <Button fullWidth>查看详情</Button>
                  </Link>
                </div>

                {/* 其他景点 */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">其他景点</h4>
                  <div className="space-y-2">
                    {filteredPOIs
                      .filter((p) => p.id !== selectedPOI.id)
                      .slice(0, 5)
                      .map((poi) => (
                        <button
                          key={poi.id}
                          onClick={() => setSelectedPOI(poi)}
                          className="w-full p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {poi.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{poi.city}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPOIs.slice(0, 10).map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => setSelectedPOI(poi)}
                    className="w-full p-3 rounded-xl hover:bg-white/10 transition-colors text-left flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {poi.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{poi.city}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}