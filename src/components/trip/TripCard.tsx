import { useState } from 'react';
import { MapPin, Users, Calendar, ArrowRight, CheckCircle2, Share2, X } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { Trip, mockDaySchedules } from '../../data/mock';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  onComplete?: () => void;
  onShare?: () => void;
}

export default function TripCard({ trip, onClick, onComplete, onShare }: TripCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const statusMap = {
    planning: { label: '规划中', color: 'bg-blue-500/20 text-blue-600' },
    ongoing: { label: '进行中', color: 'bg-green-500/20 text-green-600' },
    completed: { label: '已完成', color: 'bg-gray-500/20 text-gray-600' },
  };

  const tripSchedule = mockDaySchedules.filter(s => s.tripId === trip.id);
  const pois = tripSchedule.flatMap(s => s.items.map(i => i.poi));

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    }
    setShowShareModal(true);
    // Generate default content
    const defaultContent = `【${trip.name}】\n\n目的地：${trip.destination}\n行程天数：${trip.days}天${trip.nights}夜\n出发日期：${trip.startDate}\n\n行程亮点：\n${pois.slice(0, 5).map(p => `📍 ${p.name}`).join('\n')}\n\n分享我的精彩旅程！`;
    setShareContent(defaultContent);
  };

  const handleConfirmShare = () => {
    setShowShareModal(false);
    // In real app, this would post to backend
    alert('攻略分享成功！');
  };

  const isCompleted = trip.status === 'completed';

  return (
    <>
      <GlassCard className="overflow-hidden" onClick={onClick}>
        <div className="relative h-40 overflow-hidden">
          <img
            src={trip.coverImage}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[trip.status].color}`}>
              {statusMap[trip.status].label}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg">{trip.name}</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-primary-mid" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-primary-mid" />
              <span>{trip.days}天{trip.nights}夜</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} className="text-primary-mid" />
              <span>{trip.people}人</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">出发日期: {trip.startDate}</span>
            <ArrowRight size={16} className="text-primary-mid" />
          </div>

          {/* Action buttons for current trips */}
          {!isCompleted && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onComplete) onComplete();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm shadow-lg shadow-green-500/20 flex items-center justify-center gap-1 hover:shadow-xl transition-all"
              >
                <CheckCircle2 size={16} />
                完成行程
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareClick();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1 hover:shadow-xl transition-all"
              >
                <Share2 size={16} />
                分享攻略
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="w-[90%] max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">分享攻略</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Trip preview */}
            <div className="flex gap-3 mb-4 p-3 rounded-xl bg-white/50">
              <img
                src={trip.coverImage}
                alt={trip.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{trip.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{trip.destination} · {trip.days}天{trip.nights}夜</p>
              </div>
            </div>

            {/* POI tags */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">行程景点：</p>
              <div className="flex flex-wrap gap-2">
                {pois.map((poi, idx) => (
                  <button
                    key={idx}
                    onClick={() => setShareContent(prev => prev + `\n📍 ${poi.name} - ${poi.address}`)}
                    className="px-3 py-1.5 rounded-full bg-primary-mid/10 text-primary-mid text-xs font-medium hover:bg-primary-mid/20 transition-colors"
                  >
                    + {poi.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content textarea */}
            <textarea
              value={shareContent}
              onChange={(e) => setShareContent(e.target.value)}
              placeholder="分享你的旅行心得..."
              rows={8}
              className="w-full p-4 rounded-xl bg-white/50 border border-white/30 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-mid/30 resize-none"
            />

            {/* Share buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100/80 text-gray-600 font-medium hover:bg-gray-200/80 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmShare}
                className="flex-1 py-3 rounded-xl bg-gradient-primary text-white font-medium shadow-lg shadow-primary-mid/30 hover:shadow-xl transition-all"
              >
                发布攻略
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}