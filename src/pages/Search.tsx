import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, History, TrendingUp, Heart, SearchX, SlidersHorizontal } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { EmptyStateCompact } from '../components/ui/EmptyState';
import POICard from '../components/poi/POICard';
import { mockPOIs, userGuides, provinces, provinceCityMap } from '@/data/mock';
import { MAX_SEARCH_HISTORY } from '@/config/constants';

// 热门搜索词
const trendingSearches = ['798艺术区', '三里屯', '南锣鼓巷', '鸟巢', '水立方'];
// 景点分类筛选项
const categories = ['全部', '景点', '美食', '酒店', '购物'];
// 分类标签到 POI type 的映射
const categoryTypeMap: Record<string, string> = {
  '景点': 'scenic',
  '美食': 'food',
  '酒店': 'hotel',
  '购物': 'shopping',
};
// localStorage 搜索历史的键名
const HISTORY_KEY = 'search_history';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // 当前搜索词
  const [query, setQuery] = useState('');
  // 当前激活的 Tab：景点 / 攻略
  const [activeTab, setActiveTab] = useState<'pois' | 'guides'>('pois');
  // 当前选中的分类筛选
  const [category, setCategory] = useState('全部');
  // 搜索历史（来自 localStorage）
  const [history, setHistory] = useState<string[]>([]);
  // 地区筛选
  const [showAreaFilter, setShowAreaFilter] = useState(false);
  const [provinceFilter, setProvinceFilter] = useState('全部');
  const [cityFilter, setCityFilter] = useState('全部');

  // 初始化：读取 localStorage 历史与 URL 参数 q（仅首次挂载执行）
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      // 解析失败时忽略
    }
    const q = searchParams.get('q') || '';
    if (q) {
      setQuery(q);
      saveHistory(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 将搜索词写入历史（去重、置顶、最多 MAX_HISTORY 条）
  const saveHistory = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setHistory((prev) => {
      const next = [t, ...prev.filter((h) => h !== t)].slice(0, MAX_SEARCH_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  // 清空搜索历史
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  // 提交搜索：保存历史 + 同步 URL（点击搜索按钮 / 回车 / 点击历史或热词时触发）
  const commitSearch = (term: string) => {
    const t = term.trim();
    setQuery(t);
    if (t) {
      saveHistory(t);
      setSearchParams({ q: t }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // 输入框内容变化：实时过滤，不写入历史
  const handleInputChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setSearchParams({}, { replace: true });
    }
  };

  // 景点搜索结果（按关键词 + 分类 + 地区筛选）
  const poiResults = useMemo(() => {
    let list = mockPOIs;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (poi) =>
          poi.name.toLowerCase().includes(q) ||
          poi.city.toLowerCase().includes(q) ||
          poi.description.toLowerCase().includes(q)
      );
    }
    if (category !== '全部') {
      const type = categoryTypeMap[category];
      list = list.filter((poi) => poi.type === type);
    }
    if (provinceFilter !== '全部') {
      list = list.filter((poi) => poi.province === provinceFilter);
      if (cityFilter !== '全部') {
        list = list.filter((poi) => poi.city === cityFilter);
      }
    }
    return list;
  }, [query, category, provinceFilter, cityFilter]);

  // 攻略搜索结果（按关键词 + 地区筛选）
  const guideResults = useMemo(() => {
    let list = userGuides;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.author.toLowerCase().includes(q) ||
          g.destination.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }
    if (provinceFilter !== '全部') {
      list = list.filter((g) => g.province === provinceFilter);
      if (cityFilter !== '全部') {
        list = list.filter((g) => g.destination === cityFilter);
      }
    }
    return list;
  }, [query, provinceFilter, cityFilter]);

  // 推荐景点（受分类筛选影响）
  const recommendedPOIs = useMemo(() => {
    let list = mockPOIs;
    if (category !== '全部') {
      const type = categoryTypeMap[category];
      list = list.filter((poi) => poi.type === type);
    }
    return list.slice(0, 4);
  }, [category]);

  const hasQuery = query.trim().length > 0;
  const resultCount = activeTab === 'pois' ? poiResults.length : guideResults.length;

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-20 md:pt-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 搜索栏 */}
        <div className="glass-card p-2 flex items-center gap-2 mb-6 sticky top-20 md:top-24 z-40">
          <SearchIcon size={20} className="text-gray-400 ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitSearch(query);
            }}
            placeholder="搜索景点、美食、酒店、攻略..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          {query && (
            <button onClick={() => commitSearch('')} className="p-1" aria-label="清空">
              <X size={18} className="text-gray-400" />
            </button>
          )}
          <button
            onClick={() => commitSearch(query)}
            className="gradient-button px-4 py-2 text-sm"
          >
            搜索
          </button>
        </div>

        {/* Tab 切换：景点 / 攻略 */}
        <div className="flex gap-2 mb-6">
          {(
            [
              { key: 'pois', label: '景点' },
              { key: 'guides', label: '攻略' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tag ${
                activeTab === tab.key
                  ? 'bg-primary-mid/30 border-primary-mid text-primary-mid'
                  : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 地区筛选按钮 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowAreaFilter(!showAreaFilter)}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              showAreaFilter || provinceFilter !== '全部'
                ? 'bg-primary-mid/20 text-primary-mid'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <SlidersHorizontal size={15} />
            {provinceFilter === '全部' ? '地区筛选' : `${provinceFilter}${cityFilter !== '全部' ? ` · ${cityFilter}` : ''}`}
          </button>
          {(provinceFilter !== '全部' || cityFilter !== '全部') && (
            <button
              onClick={() => { setProvinceFilter('全部'); setCityFilter('全部'); }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              重置筛选
            </button>
          )}
        </div>

        {/* 地区筛选面板 */}
        {showAreaFilter && (
          <div className="mb-4 p-4 glass-card rounded-xl space-y-3">
            <div>
              <span className="text-xs text-gray-500 mb-1.5 block">省份</span>
              <div className="flex gap-2 flex-wrap">
                {provinces.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setProvinceFilter(p); setCityFilter('全部'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      provinceFilter === p
                        ? 'bg-gradient-primary text-white'
                        : 'bg-white/40 text-gray-600 hover:bg-white/60'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {provinceFilter !== '全部' && provinceCityMap[provinceFilter]?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 mb-1.5 block">城市</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setCityFilter('全部')}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      cityFilter === '全部'
                        ? 'bg-gradient-primary text-white'
                        : 'bg-white/40 text-gray-600 hover:bg-white/60'
                    }`}
                  >
                    全部
                  </button>
                  {provinceCityMap[provinceFilter].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCityFilter(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        cityFilter === c
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

        {/* 分类筛选：仅在景点 Tab 显示 */}
        {activeTab === 'pois' && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((filter) => (
              <button
                key={filter}
                onClick={() => setCategory(filter)}
                className={`tag whitespace-nowrap ${
                  category === filter
                    ? 'bg-primary-mid/30 border-primary-mid text-primary-mid'
                    : ''
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* 内容区 */}
        {hasQuery ? (
          <div>
            {/* 结果计数 */}
            <p className="text-sm text-gray-500 mb-4">
              找到 {resultCount} 个结果
            </p>

            {activeTab === 'pois' && (
              <>
                {poiResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {poiResults.map((poi) => (
                      <POICard key={poi.id} poi={poi} showAddButton />
                    ))}
                  </div>
                ) : (
                  <GlassCard className="p-4">
                    <EmptyStateCompact
                      icon={SearchX}
                      title={`未找到与「${query}」相关的结果`}
                      description="换个关键词试试吧"
                    />
                  </GlassCard>
                )}
              </>
            )}

            {activeTab === 'guides' && (
              <>
                {guideResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guideResults.map((guide) => (
                      <GuideCard
                        key={guide.id}
                        guide={guide}
                        onClick={() => navigate(`/guide/${guide.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <GlassCard className="p-4">
                    <EmptyStateCompact
                      icon={SearchX}
                      title={`未找到与「${query}」相关的结果`}
                      description="换个关键词试试吧"
                    />
                  </GlassCard>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* 搜索历史 */}
            {history.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-gray-400" />
                    <h3 className="font-medium text-gray-700">搜索历史</h3>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                    清空
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((item) => (
                    <button
                      key={item}
                      onClick={() => commitSearch(item)}
                      className="tag text-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-gray-400" />
                <h3 className="font-medium text-gray-700">热门搜索</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trendingSearches.map((item, idx) => (
                  <GlassCard
                    key={item}
                    className="p-3 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => commitSearch(item)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        idx < 3 ? 'text-primary-mid' : 'text-gray-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* 推荐景点 */}
            <div>
              <h3 className="font-medium text-gray-700 mb-4">推荐景点</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedPOIs.map((poi) => (
                  <POICard key={poi.id} poi={poi} showAddButton />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 攻略卡片：封面图 + 标题 + 作者 + 点赞数
function GuideCard({
  guide,
  onClick,
}: {
  guide: (typeof userGuides)[number];
  onClick: () => void;
}) {
  return (
    <GlassCard className="overflow-hidden" onClick={onClick}>
      <div className="relative h-40 overflow-hidden group">
        <img
          src={guide.image}
          alt={guide.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 line-clamp-1">{guide.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white text-xs">{guide.avatar}</span>
            </div>
            <span className="text-sm text-gray-600">{guide.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-favorite fill-favorite" />
            <span className="text-sm text-gray-600">{guide.likes}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
