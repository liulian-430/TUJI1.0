import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Calendar,
  Users,
  DollarSign,
  Edit2,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Clock,
  MapPin,
  Plus,
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useTripStore } from '@/store/useTripStore';
import { useUIStore } from '@/store/useUIStore';
import { formatDate, formatTimeRange, formatTripDays } from '@/utils/format';
import { getPOIById } from '@/data/pois';
import type { DayItem } from '@/store/useTripStore';

export function TripDetail() {
  const { id } = useParams();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === id));
  const updateTrip = useTripStore((state) => state.updateTrip);
  const deleteTrip = useTripStore((state) => state.deleteTrip);
  const copyTrip = useTripStore((state) => state.copyTrip);
  const deleteDayItem = useTripStore((state) => state.deleteDayItem);
  const reorderDayItems = useTripStore((state) => state.reorderDayItems);
  const getBudget = useTripStore((state) => state.getBudget);
  const getExpenses = useTripStore((state) => state.getExpenses);
  const addToast = useUIStore((state) => state.addToast);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GlassCard className="text-center py-12">
          <p className="text-gray-500">行程不存在</p>
          <Link to="/">
            <Button className="mt-4">返回首页</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const budget = getBudget(trip.id);
  const expenses = getExpenses(trip.id);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDelete = () => {
    deleteTrip(trip.id);
    addToast({ type: 'success', message: '行程已删除' });
    setShowDeleteModal(false);
    window.location.href = '/';
  };

  const handleCopy = () => {
    const copied = copyTrip(trip.id);
    addToast({ type: 'success', message: '行程已复制' });
    window.location.href = `/trip/${copied.id}`;
  };

  const handleMoveUp = (dayIndex: number, itemId: string) => {
    const day = trip.schedule.find((d) => d.dayIndex === dayIndex);
    if (!day) return;

    const items = day.items;
    const itemIdx = items.findIndex((i) => i.id === itemId);
    if (itemIdx <= 0) return;

    const newOrder = [...items];
    [newOrder[itemIdx - 1], newOrder[itemIdx]] = [newOrder[itemIdx], newOrder[itemIdx - 1]];

    reorderDayItems(trip.id, dayIndex, newOrder.map((i) => i.id));
  };

  const handleMoveDown = (dayIndex: number, itemId: string) => {
    const day = trip.schedule.find((d) => d.dayIndex === dayIndex);
    if (!day) return;

    const items = day.items;
    const itemIdx = items.findIndex((i) => i.id === itemId);
    if (itemIdx >= items.length - 1) return;

    const newOrder = [...items];
    [newOrder[itemIdx], newOrder[itemIdx + 1]] = [newOrder[itemIdx + 1], newOrder[itemIdx]];

    reorderDayItems(trip.id, dayIndex, newOrder.map((i) => i.id));
  };

  const handleDeleteItem = (dayIndex: number, itemId: string) => {
    deleteDayItem(trip.id, dayIndex, itemId);
    addToast({ type: 'success', message: '景点已移除' });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* 行程概览 */}
      <GlassCard className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text mb-2">{trip.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {trip.destination}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatTripDays(trip.days, trip.nights)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {trip.people}人
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowEditModal(true)} icon={<Edit2 className="w-4 h-4" />}>
              编辑
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopy} icon={<Copy className="w-4 h-4" />}>
              复制
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowDeleteModal(true)} icon={<Trash2 className="w-4 h-4" />}>
              删除
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">出发日期</p>
            <p className="font-semibold">{formatDate(trip.startDate)}</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">景点数</p>
            <p className="font-semibold">{trip.schedule.reduce((sum, d) => sum + d.items.length, 0)}</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">总预算</p>
            <p className="font-semibold">¥{budget?.totalBudget || 0}</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">已花费</p>
            <p className="font-semibold">¥{totalExpense}</p>
          </div>
        </div>

        <div className="mt-4">
          <Link to={`/trip/${trip.id}/budget`}>
            <Button fullWidth icon={<DollarSign className="w-5 h-5" />}>
              预算管理
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* 每日行程 */}
      <div className="mb-4">
        {/* 天数选择 */}
        <div className="flex gap-2 mb-4">
          {trip.schedule.map((day) => (
            <button
              key={day.dayIndex}
              onClick={() => setSelectedDay(day.dayIndex)}
              className={twMerge(
                clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  selectedDay === day.dayIndex
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-500/30'
                    : 'bg-white/10 text-gray-600 hover:bg-white/20'
                )
              )}
            >
              第{day.dayIndex}天
            </button>
          ))}
        </div>
      </div>

      {/* 时间轴 */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            第{selectedDay}天行程
          </h2>
          <Link to={`/search?destination=${trip.destination}`}>
            <Button size="sm" variant="outline" icon={<Plus className="w-4 h-4" />}>
              添加景点
            </Button>
          </Link>
        </div>

        {trip.schedule
          .find((d) => d.dayIndex === selectedDay)
          ?.items.map((item) => (
            <DayItemCard
              key={item.id}
              item={item}
              onMoveUp={() => handleMoveUp(selectedDay, item.id)}
              onMoveDown={() => handleMoveDown(selectedDay, item.id)}
              onDelete={() => handleDeleteItem(selectedDay, item.id)}
            />
          ))}

        {trip.schedule.find((d) => d.dayIndex === selectedDay)?.items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>暂无景点安排</p>
            <Link to={`/search?destination=${trip.destination}`}>
              <Button className="mt-4" size="sm">
                添加景点
              </Button>
            </Link>
          </div>
        )}
      </GlassCard>

      {/* 编辑模态框 */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="编辑行程">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">编辑功能将在后续版本中提供</p>
          <Button onClick={() => setShowEditModal(false)}>关闭</Button>
        </div>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="删除行程">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">确定要删除该行程吗?此操作不可恢复。</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              取消
            </Button>
            <Button onClick={handleDelete}>确认删除</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// 时间轴卡片组件
function DayItemCard({
  item,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  item: DayItem;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const poi = item.poi || getPOIById(item.poiId);

  if (!poi) return null;

  const typeColorMap: Record<string, string> = {
    '景点': 'bg-green-500/20 text-green-600',
    '美食': 'bg-orange-500/20 text-orange-600',
    '住宿': 'bg-purple-500/20 text-purple-600',
    '交通': 'bg-blue-500/20 text-blue-600',
  };

  return (
    <div className="relative pl-8 mb-4">
      {/* 时间轴线和点 */}
      <div className="timeline-line" />
      <div className="timeline-dot" style={{ top: '20px' }} />

      {/* 卡片内容 */}
      <div className="glass-card p-4">
        <div className="flex items-start gap-4">
          {/* 图片 */}
          <div className="w-24 h-24 rounded-xl overflow-hidden img-hover-zoom flex-shrink-0">
            {poi.images[0] && (
              <img src={poi.images[0]} alt={poi.name} className="w-full h-full object-cover" />
            )}
          </div>

          {/* 信息 */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={twMerge(clsx('text-xs px-2 py-0.5 rounded-full', typeColorMap[poi.type]))}>
                {poi.type}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeRange(item.startTime, item.endTime)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{poi.name}</h3>
            <p className="text-xs text-gray-500">{poi.city}</p>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-1">
            <button
              onClick={onMoveUp}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={onMoveDown}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}