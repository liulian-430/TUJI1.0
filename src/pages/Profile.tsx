import { useState, useCallback } from 'react';
import { MapPin, Calendar, ChevronRight, Camera, Heart, Star, MapPinned, History as HistoryIcon, Settings as SettingsIcon, X } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import EmptyState from '../components/ui/EmptyState';
import TripCard from '../components/trip/TripCard';
import { useTripStore } from '@/store/useTripStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/store/useToastStore';
import { useEscKey } from '@/hooks/useEscKey';

export default function Profile() {
  const navigate = useNavigate();
  const { trips, favoritePOIs, visitedCities, completeTrip, userProfile } = useTripStore();
  const { showToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [showCitiesModal, setShowCitiesModal] = useState(false);

  const currentTrips = trips.filter(t => t.status !== 'completed');
  const historicalTrips = trips.filter(t => t.status === 'completed');

  const handleCompleteTrip = (tripId: string) => {
    completeTrip(tripId);
    setActiveTab('history');
    showToast('行程已完成', 'success');
  };

  const handleStatClick = (type: 'footprint' | 'favorite' | 'review') => {
    if (type === 'favorite') {
      navigate('/search?tab=poi&favorite=1');
    } else if (type === 'footprint') {
      if (visitedCities.length > 0) {
        setShowCitiesModal(true);
      } else {
        showToast('还没有足迹，快去探索吧', 'info');
      }
    } else {
      showToast('暂无评价', 'info');
    }
  };

  const closeCitiesModal = useCallback(() => setShowCitiesModal(false), []);
  useEscKey(closeCitiesModal, showCitiesModal);

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-20 md:pt-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <GlassCard className="p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-lg font-bold text-gray-800">我的</h1>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-lg hover:bg-white/40 transition-colors"
                aria-label="设置"
              >
                <SettingsIcon size={20} className="text-gray-500" />
              </button>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-4 w-full text-left"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-mid/30">
                  <span className="text-white text-2xl font-bold">{userProfile.avatar}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Camera size={14} className="text-gray-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-800 truncate">{userProfile.nickname}</h2>
                <p className="text-sm text-gray-500 mt-1 truncate">{userProfile.bio}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
            </button>
            <div className="flex gap-4 mt-5 pt-4 border-t border-white/20">
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-gray-800">{trips.length}</p>
                <p className="text-xs text-gray-500">行程</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-gray-800">{favoritePOIs.length}</p>
                <p className="text-xs text-gray-500">收藏</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-gray-800">{visitedCities.length}</p>
                <p className="text-xs text-gray-500">足迹</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Trip Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'current'
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'glass-card text-gray-600 hover:bg-white/20'
            }`}
          >
            本次行程
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'glass-card text-gray-600 hover:bg-white/20'
            }`}
          >
            历史行程
          </button>
        </div>

        {/* Trip List */}
        {activeTab === 'current' ? (
          <div className="space-y-4">
            {currentTrips.length > 0 ? (
              currentTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  onComplete={() => handleCompleteTrip(trip.id)}
                />
              ))
            ) : (
              <GlassCard className="p-4">
                <EmptyState
                  icon={MapPinned}
                  title="暂无进行中的行程"
                  description="开启一段新的旅程吧，让每一段路都成为回忆。"
                  actionText="创建新行程"
                  onAction={() => navigate('/ai-planner')}
                />
              </GlassCard>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {historicalTrips.length > 0 ? (
              historicalTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                />
              ))
            ) : (
              <GlassCard className="p-4">
                <EmptyState
                  icon={HistoryIcon}
                  title="暂无历史行程"
                  description="完成的行程将归档至此，留下你的旅行足迹。"
                />
              </GlassCard>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <GlassCard
            className="p-4 text-center cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => handleStatClick('footprint')}
          >
            <MapPin size={24} className="mx-auto mb-2 text-blue-500" />
            <p className="text-xs text-gray-500">足迹</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{visitedCities.length}个目的地</p>
          </GlassCard>
          <GlassCard
            className="p-4 text-center cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => handleStatClick('favorite')}
          >
            <Heart size={24} className="mx-auto mb-2 text-favorite" />
            <p className="text-xs text-gray-500">收藏</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{favoritePOIs.length}个收藏</p>
          </GlassCard>
          <GlassCard
            className="p-4 text-center cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => handleStatClick('review')}
          >
            <Star size={24} className="mx-auto mb-2 text-yellow-500" />
            <p className="text-xs text-gray-500">评价</p>
            <p className="text-sm font-medium text-gray-700 mt-1">0条评价</p>
          </GlassCard>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-8">
          途迹 v1.0.0
        </p>
      </div>

      {/* 足迹城市弹窗 */}
      {showCitiesModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowCitiesModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">我的足迹</h3>
              <button
                onClick={() => setShowCitiesModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-5 max-h-72 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {visitedCities.map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1.5 rounded-full bg-primary-mid/10 text-primary-mid text-sm font-medium"
                  >
                    {city}
                  </span>
                ))}
              </div>
              {visitedCities.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">还没有足迹，快去探索吧</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
