import { useState } from 'react';
import { MapPin, Calendar, ChevronRight, Search, Plus, TrendingUp } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { mockTrips, mockDaySchedules, mockPOIs } from '../data/mock';

export default function Map() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(mockTrips[0]);
  const [showSearch, setShowSearch] = useState(false);

  const schedules = mockDaySchedules.filter((s) => s.tripId === selectedTrip.id);

  const typeColors = {
    scenic: 'bg-green-500/20 text-green-600 border-green-500/30',
    food: 'bg-red-500/20 text-red-600 border-red-500/30',
    hotel: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
    transport: 'bg-gray-500/20 text-gray-600 border-gray-500/30',
    shopping: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  };

  const typeLabels = {
    scenic: '景点',
    food: '美食',
    hotel: '住宿',
    transport: '交通',
    shopping: '购物',
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-20 md:pt-24">
      {/* Map Placeholder */}
      <div className="relative h-[40vh] md:h-[50vh] bg-gradient-to-br from-slate-100 to-indigo-50/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary-mid/10 flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-primary-mid" />
            </div>
            <p className="text-gray-500 font-medium">地图加载中...</p>
            <p className="text-sm text-gray-400 mt-1">地图功能即将上线</p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="glass-card p-3 hover:bg-white/30 transition-colors"
          >
            <Search size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Search Panel */}
        {showSearch && (
          <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 glass-card p-4 z-[1001]">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索景点..."
                  className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-mid/50"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockPOIs.slice(0, 5).map((poi) => (
                <button
                  key={poi.id}
                  className="w-full p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                >
                  <img
                    src={poi.images[0]}
                    alt={poi.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{poi.name}</p>
                    <p className="text-xs text-gray-500">{poi.city}</p>
                  </div>
                  <Plus size={18} className="text-primary-mid" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Location Marker */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-primary-mid/30 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-primary-mid/50 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-0 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Trip List */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Trip Selector */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {mockTrips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedTrip.id === trip.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'glass-card text-gray-600 hover:bg-white/20'
                }`}
              >
                {trip.name}
              </button>
            ))}
          </div>

          {/* Trip Overview */}
          <GlassCard className="p-4 mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-primary-mid" />
                <span>{selectedTrip.destination}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span>{selectedTrip.days}天{selectedTrip.nights}夜</span>
              <span className="text-gray-300">|</span>
              <span>{selectedTrip.people}人</span>
              <span className="text-gray-300">|</span>
              <span>{selectedTrip.startDate}</span>
            </div>
          </GlassCard>

          {/* Day Schedules */}
          <div className="relative">
            <div className="timeline-line" />
            {schedules.map((day, dayIndex) => (
              <div key={day.id} className="relative pl-12 mb-8">
                <div className="timeline-dot" />
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">
                      Day {day.dayIndex}
                    </h3>
                    <span className="text-sm text-gray-500">{day.date}</span>
                  </div>

                  <div className="space-y-4">
                    {day.items.map((item) => (
                      <div
                        key={item.id}
                        className="relative bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.poi.images[0]}
                            alt={item.poi.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded border ${typeColors[item.type]}`}>
                                {typeLabels[item.type]}
                              </span>
                              <span className="text-xs text-gray-500">
                                {item.startTime} - {item.endTime}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-800 truncate">
                              {item.poi.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {item.poi.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
