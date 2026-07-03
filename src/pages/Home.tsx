import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useRef, useCallback } from 'react';
import { Search, MapPin, Clock, Heart, ChevronRight, Plus, ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Logo from '../components/ui/Logo';
import WeatherWidget from '../components/ui/WeatherWidget';
import { hotCities, mockPOIs, userGuides, provinceCityMap, provinces } from '../data/mock';
import { useTripStore } from '@/store/useTripStore';
import { useToastStore } from '@/store/useToastStore';
import type { TripPOI, POI } from '../data/mock';

const typeLabels: Record<string, string> = {
  scenic: '景点',
  food: '美食',
  hotel: '酒店',
  shopping: '购物',
};

const typeColors: Record<string, string> = {
  scenic: 'bg-green-500/20 text-green-600 border-green-500/30',
  food: 'bg-red-500/20 text-red-600 border-red-500/30',
  hotel: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  shopping: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
};

export default function Home() {
  const navigate = useNavigate();
  const { favoritePOIs, toggleFavoritePOI, trips, currentTripId, addPOIToTrip } = useTripStore();
  const { showToast } = useToastStore();

  // 城市详情状态
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityFilterType, setCityFilterType] = useState<string>('全部');

  // 热门景点筛选
  const [poiProvinceFilter, setPoiProvinceFilter] = useState('全部');
  const [poiCityFilter, setPoiCityFilter] = useState('全部');
  const [showPoiFilter, setShowPoiFilter] = useState(false);

  // 发现筛选
  const [guideProvinceFilter, setGuideProvinceFilter] = useState('全部');
  const [guideCityFilter, setGuideCityFilter] = useState('全部');
  const [showGuideFilter, setShowGuideFilter] = useState(false);

  // 触摸滑动
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const currentTrip = trips.find((t) => t.id === currentTripId) || trips.filter((t) => t.status !== 'completed')[0];

  const handleFavorite = (e: React.MouseEvent, poiId: string) => {
    e.stopPropagation();
    toggleFavoritePOI(poiId);
    const isFav = favoritePOIs.includes(poiId);
    showToast(isFav ? '已取消收藏' : '已收藏', 'success');
  };

  const handleAddToTrip = (e: React.MouseEvent, poi: POI) => {
    e.stopPropagation();
    if (!currentTrip) {
      showToast('请先创建一个行程', 'info');
      return;
    }
    const newPoi: TripPOI = {
      id: `${poi.id}-${Date.now()}`,
      name: poi.name,
      type: poi.type,
      duration: '2小时',
      price: poi.price,
      image: poi.images[0] || '',
      latitude: poi.latitude,
      longitude: poi.longitude,
    };
    addPOIToTrip(currentTrip.id, newPoi);
    showToast('已添加到行程', 'success');
  };

  // 城市POI列表
  const cityPois = useMemo(() => {
    if (!selectedCity) return [];
    let list = mockPOIs.filter((p) => p.city === selectedCity);
    if (cityFilterType !== '全部') {
      const typeMap: Record<string, string> = { 景点: 'scenic', 美食: 'food', 酒店: 'hotel', 购物: 'shopping' };
      const type = typeMap[cityFilterType];
      if (type) list = list.filter((p) => p.type === type);
    }
    return list;
  }, [selectedCity, cityFilterType]);

  // 筛选后的热门景点
  const filteredHotPois = useMemo(() => {
    let list = [...mockPOIs];
    if (poiProvinceFilter !== '全部') {
      list = list.filter((p) => p.province === poiProvinceFilter);
      if (poiCityFilter !== '全部') {
        list = list.filter((p) => p.city === poiCityFilter);
      }
    }
    return list.filter((p) => p.type === 'scenic').slice(0, 6);
  }, [poiProvinceFilter, poiCityFilter]);

  // 筛选后的攻略
  const filteredGuides = useMemo(() => {
    let list = [...userGuides];
    if (guideProvinceFilter !== '全部') {
      list = list.filter((g) => g.province === guideProvinceFilter);
      if (guideCityFilter !== '全部') {
        list = list.filter((g) => g.destination === guideCityFilter);
      }
    }
    return list;
  }, [guideProvinceFilter, guideCityFilter]);

  const poiFilterCities = useMemo(() => {
    if (poiProvinceFilter === '全部') return [];
    return provinceCityMap[poiProvinceFilter] || [];
  }, [poiProvinceFilter]);

  const guideFilterCities = useMemo(() => {
    if (guideProvinceFilter === '全部') return [];
    return provinceCityMap[guideProvinceFilter] || [];
  }, [guideProvinceFilter]);

  // 触摸滑动返回
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!selectedCity) return;
    const diffX = e.touches[0].clientX - touchStartX.current;
    const diffY = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isDragging.current = true;
    }
  }, [selectedCity]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!selectedCity || !isDragging.current) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 80) {
      setSelectedCity(null);
    }
    isDragging.current = false;
  }, [selectedCity]);

  // ========== 城市详情视图 ==========
  if (selectedCity) {
    const cityInfo = hotCities.find((c) => c.name === selectedCity);
    const filterTypes = ['全部', '景点', '美食', '酒店', '购物'];

    return (
      <div
        className="min-h-screen pb-24 md:pb-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-pink-50/20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 顶部返回栏 */}
        <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/30 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedCity(null)}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{selectedCity}</span>
            <span className="text-xs text-gray-400">{cityInfo?.province}</span>
          </div>
          <span className="ml-auto text-sm text-gray-500">{cityPois.length} 个推荐</span>
        </div>

        {/* 类型筛选 */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setCityFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                cityFilterType === type
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'bg-white/40 text-gray-600 hover:bg-white/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* POI 列表 */}
        <div className="px-4 space-y-4">
          {cityPois.length === 0 && (
            <div className="text-center py-12 text-gray-400">暂无该类型的推荐</div>
          )}
          {cityPois.map((poi) => {
            const isFavorited = favoritePOIs.includes(poi.id);
            return (
              <GlassCard key={poi.id} className="overflow-hidden">
                <div className="flex gap-4">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <img src={poi.images[0]} alt={poi.name} className="w-full h-full object-cover rounded-xl" />
                    <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full border ${typeColors[poi.type]}`}>
                      {typeLabels[poi.type]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 py-1 pr-1">
                    <h3 className="font-bold text-gray-800">{poi.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{poi.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-yellow-500">★ {poi.rating}</span>
                      {poi.price > 0 && <span className="text-sm text-primary-mid font-medium">¥{poi.price}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={(e) => handleFavorite(e, poi.id)}
                        className={`p-2 rounded-full transition-all ${
                          isFavorited ? 'bg-favorite text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <Heart size={14} className={isFavorited ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={(e) => handleAddToTrip(e, poi)}
                        className="flex-1 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium flex items-center justify-center gap-1 shadow-md hover:shadow-lg transition-all"
                      >
                        <Plus size={14} />
                        添加至行程
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* 左滑提示 */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <span className="text-xs text-gray-400 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            ← 右滑返回首页
          </span>
        </div>
      </div>
    );
  }

  // ========== 首页视图 ==========
  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <section className="relative px-4 pt-20 md:pt-24 md:px-8">
        {/* Background with soft gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] bg-gradient-primary rounded-full opacity-10 blur-[100px]" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-t from-indigo-200/30 to-pink-200/20 rounded-full blur-[60px]" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Header with Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Logo size={52} />
            <span className="text-2xl font-bold text-gray-800 tracking-widest" style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: '0.18em' }}>TUJI</span>
          </div>

          {/* Search Bar */}
          <div
            className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3 shadow-xl shadow-white/20 cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <Search size={20} className="text-gray-400/70" />
            <span className="flex-1 text-gray-400/60 text-base">
              搜索景点、美食、酒店...
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/search');
              }}
              className="px-4 py-2 bg-gradient-primary rounded-xl text-white text-sm font-medium shadow-lg shadow-primary-mid/30"
            >
              搜索
            </button>
          </div>

          {/* Weather Widget */}
          <div className="mb-6">
            <WeatherWidget city="北京" compact />
          </div>

          {/* Hot Cities */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800/80 mb-5">热门城市</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {hotCities.map((city) => (
                <GlassCard
                  key={city.id}
                  className="flex-shrink-0 w-36 overflow-hidden p-0 cursor-pointer"
                  onClick={() => setSelectedCity(city.name)}
                >
                  <div className="relative h-40">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-white font-medium text-lg">{city.name}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Hot POIs */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800/80">热门景点</h2>
              <button
                onClick={() => setShowPoiFilter(!showPoiFilter)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  showPoiFilter || poiProvinceFilter !== '全部' ? 'text-primary-mid' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SlidersHorizontal size={16} />
                筛选
              </button>
            </div>

            {/* 景点筛选面板 */}
            {showPoiFilter && (
              <div className="mb-4 p-4 glass-card rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">筛选条件</span>
                  <button
                    onClick={() => { setPoiProvinceFilter('全部'); setPoiCityFilter('全部'); }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    重置
                  </button>
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">省份</span>
                  <div className="flex gap-2 flex-wrap">
                    {provinces.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPoiProvinceFilter(p); setPoiCityFilter('全部'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          poiProvinceFilter === p
                            ? 'bg-gradient-primary text-white'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {poiFilterCities.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">城市</span>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setPoiCityFilter('全部')}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          poiCityFilter === '全部'
                            ? 'bg-gradient-primary text-white'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                        }`}
                      >
                        全部
                      </button>
                      {poiFilterCities.map((c) => (
                        <button
                          key={c}
                          onClick={() => setPoiCityFilter(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            poiCityFilter === c
                              ? 'bg-gradient-primary text-white'
                              : 'bg-white/40 text-gray-600 hover:bg-white/60'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredHotPois.map((poi) => {
                const isFavorited = favoritePOIs.includes(poi.id);
                return (
                  <GlassCard
                    key={poi.id}
                    className="overflow-hidden cursor-pointer p-0"
                    onClick={() => navigate(`/poi/${poi.id}`)}
                  >
                    <div className="relative h-32">
                      <img
                        src={poi.images[0]}
                        alt={poi.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={(e) => handleFavorite(e, poi.id)}
                          className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${
                            isFavorited ? 'bg-favorite text-white' : 'bg-white/50 text-gray-600 hover:bg-white/70'
                          }`}
                          aria-label={isFavorited ? '取消收藏' : '收藏'}
                        >
                          <Heart size={14} className={isFavorited ? 'fill-current' : ''} />
                        </button>
                        <button
                          onClick={(e) => handleAddToTrip(e, poi)}
                          className="p-1.5 rounded-full bg-gradient-primary text-white shadow-md hover:shadow-lg transition-all"
                          aria-label="添加到行程"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-white text-sm font-medium truncate block">{poi.name}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500/80">{poi.city}</span>
                        <span className="text-xs text-yellow-500/80">★ {poi.rating}</span>
                      </div>
                      {poi.price > 0 && (
                        <span className="text-sm text-primary-mid/80 font-medium mt-1 block">
                          ¥{poi.price}
                        </span>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
            {filteredHotPois.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">该筛选条件下暂无景点</div>
            )}
          </div>

          {/* Recommended Guides */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800/80">发现</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGuideFilter(!showGuideFilter)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    showGuideFilter || guideProvinceFilter !== '全部' ? 'text-primary-mid' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SlidersHorizontal size={16} />
                  筛选
                </button>
                <button
                  onClick={() => navigate('/search?tab=guide')}
                  className="flex items-center gap-1 text-primary-mid/80 text-sm font-medium hover:text-primary-mid transition-colors"
                >
                  <span>更多</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 攻略筛选面板 */}
            {showGuideFilter && (
              <div className="mb-4 p-4 glass-card rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">筛选条件</span>
                  <button
                    onClick={() => { setGuideProvinceFilter('全部'); setGuideCityFilter('全部'); }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    重置
                  </button>
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">省份</span>
                  <div className="flex gap-2 flex-wrap">
                    {provinces.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setGuideProvinceFilter(p); setGuideCityFilter('全部'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          guideProvinceFilter === p
                            ? 'bg-gradient-primary text-white'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {guideFilterCities.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">城市</span>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setGuideCityFilter('全部')}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          guideCityFilter === '全部'
                            ? 'bg-gradient-primary text-white'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                        }`}
                      >
                        全部
                      </button>
                      {guideFilterCities.map((c) => (
                        <button
                          key={c}
                          onClick={() => setGuideCityFilter(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            guideCityFilter === c
                              ? 'bg-gradient-primary text-white'
                              : 'bg-white/40 text-gray-600 hover:bg-white/60'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {filteredGuides.map((guide) => (
                <GlassCard
                  key={guide.id}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/guide/${guide.id}`)}
                >
                  <div className="flex gap-4">
                    <div className="relative w-36 h-36 flex-shrink-0">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs flex items-center gap-1">
                          <Clock size={10} />
                          {guide.days}天
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 py-3 pr-3">
                      <h3 className="font-semibold text-gray-800 text-base truncate">{guide.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-white text-xs">{guide.avatar}</span>
                        </div>
                        <span className="text-sm text-gray-500/70">{guide.author}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {guide.pois.map((poi, idx) => (
                          <div key={idx} className="flex items-center">
                            <span className="px-2 py-0.5 rounded-full bg-primary-mid/10 text-primary-mid/80 text-xs">
                              {poi}
                            </span>
                            {idx < guide.pois.length - 1 && (
                              <span className="text-gray-300/60 mx-1">·</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-400/60">
                        <span className="flex items-center gap-1">
                          <Heart size={14} />
                          {guide.likes}
                        </span>
                        <span>{guide.views} 阅读</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
            {filteredGuides.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">该筛选条件下暂无攻略</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
