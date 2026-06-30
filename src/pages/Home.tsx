import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Heart, Bookmark, Plus, ChevronRight, User } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { hotCities, mockPOIs, mockTrips } from '../data/mock';

const userGuides = [
  {
    id: '1',
    title: '北京4天3晚深度游攻略',
    author: '旅行达人小王',
    avatar: '王',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
    likes: 1256,
    views: 8934,
    pois: ['故宫博物院', '八达岭长城', '天坛公园'],
    days: 4,
  },
  {
    id: '2',
    title: '上海迪士尼亲子游全攻略',
    author: '妈妈爱旅行',
    avatar: '妈',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
    likes: 892,
    views: 5621,
    pois: ['迪士尼乐园', '外滩', '南京路'],
    days: 3,
  },
  {
    id: '3',
    title: '成都美食探店之旅',
    author: '吃货小李',
    avatar: '李',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800',
    likes: 2341,
    views: 12567,
    pois: ['宽窄巷子', '锦里', '熊猫基地'],
    days: 5,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGuidePoi, setSelectedGuidePoi] = useState('');
  const [selectedTrip, setSelectedTrip] = useState('');

  const currentTrips = mockTrips.filter(t => t.status !== 'completed');
  const hotPois = mockPOIs.filter(p => p.type === 'scenic').slice(0, 6);

  const handleAddToTrip = (poiName: string) => {
    setSelectedGuidePoi(poiName);
    setSelectedTrip(currentTrips[0]?.id || '');
    setShowAddModal(true);
  };

  const confirmAdd = () => {
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <section className="relative px-4 pt-20 md:pt-28 md:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-primary rounded-full opacity-15 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-08 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="glass-card p-3 flex items-center gap-3 mb-8">
            <Search size={20} className="text-gray-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索景点、美食、酒店..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button className="gradient-button px-4 py-2 text-sm">
              搜索
            </button>
          </div>

          {/* Hot Cities */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6">热门目的地</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {hotCities.map((city) => (
                <GlassCard
                  key={city.id}
                  className="flex-shrink-0 w-36 overflow-hidden p-0 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/map?city=${city.name}`)}
                >
                  <div className="relative h-40">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
            <h2 className="text-xl font-bold text-gray-800 mb-6">热门景点</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {hotPois.map((poi) => (
                <GlassCard
                  key={poi.id}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/poi/${poi.id}`)}
                >
                  <div className="relative h-32">
                    <img
                      src={poi.images[0]}
                      alt={poi.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-white text-sm font-medium truncate block">{poi.name}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{poi.city}</span>
                      <span className="text-xs text-yellow-500">★ {poi.rating}</span>
                    </div>
                    {poi.price > 0 && (
                      <span className="text-sm text-primary-mid font-medium mt-1 block">
                        ¥{poi.price}
                      </span>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* User Guides */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">用户攻略</h2>
              <button className="flex items-center gap-1 text-primary-mid text-sm hover:underline">
                <span>更多</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {userGuides.map((guide) => (
                <GlassCard
                  key={guide.id}
                  className="overflow-hidden cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="relative w-40 h-40 flex-shrink-0">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs flex items-center gap-1">
                          <Clock size={10} />
                          {guide.days}天
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 py-3">
                      <h3 className="font-bold text-gray-800 text-lg truncate">{guide.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-white text-xs">{guide.avatar}</span>
                        </div>
                        <span className="text-sm text-gray-500">{guide.author}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {guide.pois.map((poi, idx) => (
                          <div key={idx} className="flex items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToTrip(poi);
                              }}
                              className="px-2 py-1 rounded-full bg-primary-mid/10 text-primary-mid text-xs hover:bg-primary-mid/20 transition-colors flex items-center gap-1"
                            >
                              <Bookmark size={10} />
                              {poi}
                            </button>
                            {idx < guide.pois.length - 1 && (
                              <span className="text-gray-300 mx-1">·</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
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
          </div>
        </div>
      </section>

      {/* Add to Trip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm animate-bounce-in">
            <h3 className="text-lg font-bold text-gray-800 mb-4">添加到行程</h3>
            <p className="text-gray-600 mb-4">
              将「{selectedGuidePoi}」添加到：
            </p>
            <div className="space-y-2">
              {currentTrips.length > 0 ? (
                currentTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      selectedTrip === trip.id
                        ? 'bg-primary-mid/10 ring-2 ring-primary-mid'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{trip.name}</p>
                        <p className="text-xs text-gray-500">{trip.destination} · {trip.days}天</p>
                      </div>
                      {selectedTrip === trip.id && (
                        <div className="w-5 h-5 rounded-full bg-primary-mid flex items-center justify-center">
                          <Plus size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">暂无进行中的行程</p>
              )}
              <button
                onClick={() => navigate('/new-trip')}
                className="w-full p-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-primary-mid hover:text-primary-mid transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>创建新行程</span>
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmAdd}
                disabled={!selectedTrip}
                className="flex-1 py-3 rounded-xl bg-gradient-primary text-white disabled:opacity-50 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
