import { useRef, useState, useEffect } from 'react';
import { GripVertical, Bus, TrainFront, Car, ArrowDown, Edit3 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import SwipeableCard from '../ui/SwipeableCard';
import type { TripPOI } from '@/data/mock';
import { calculateTransport, formatDuration, formatDistance } from '@/utils/transport';

interface DraggablePOIListProps {
  pois: TripPOI[];
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
  dayButtonColors: string[];
  viewMode: 'all' | number;
  selectedPoi: string | null;
  onPoiClick: (poi: TripPOI) => void;
  onDelete: (poiId: string) => void;
  onMoveDay: (poiId: string) => void;
  getDayForPoi: (poiId: string) => number | null;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export default function DraggablePOIList({
  pois,
  typeColors,
  typeLabels,
  dayButtonColors,
  viewMode,
  selectedPoi,
  onPoiClick,
  onDelete,
  onMoveDay,
  getDayForPoi,
  onReorder,
}: DraggablePOIListProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [selectedTransportIndex, setSelectedTransportIndex] = useState<number | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [cardHeight, setCardHeight] = useState(120);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insertIndexRef = useRef<number | null>(null);
  const draggingIndexRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);

  const updateInsertIndex = (clientY: number) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeY = clientY - containerRect.top;

    let cumulativeHeight = 0;
    let newInsertIdx = 0;

    for (let i = 0; i < cardRefs.current.length; i++) {
      const cardEl = cardRefs.current[i];
      if (!cardEl) continue;

      const cardRect = cardEl.getBoundingClientRect();
      const cardTop = cardRect.top - containerRect.top;
      const cardBottom = cardTop + cardRect.height;

      const cardMid = (cardTop + cardBottom) / 2;

      if (relativeY < cardMid) {
        newInsertIdx = i;
        break;
      }
      newInsertIdx = i + 1;
    }

    newInsertIdx = Math.max(0, Math.min(pois.length, newInsertIdx));

    if (newInsertIdx !== insertIndexRef.current) {
      insertIndexRef.current = newInsertIdx;
      setInsertIndex(newInsertIdx);
    }
  };

  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    if (viewMode === 'all') return;

    const target = e.currentTarget as HTMLElement;
    const cardRect = target.getBoundingClientRect();

    setDragOffset({
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top,
    });

    const currentCardHeight = cardRect.height;
    setCardHeight(currentCardHeight);

    startPosRef.current = { x: e.clientX, y: e.clientY };
    pointerIdRef.current = e.pointerId;
    isDraggingRef.current = false;
    setIsLongPress(false);

    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setDraggingIndex(idx);
      draggingIndexRef.current = idx;
      isDraggingRef.current = true;
      setInsertIndex(idx);
      insertIndexRef.current = idx;
      setDragPosition({ x: e.clientX, y: e.clientY });

      if (target.setPointerCapture) {
        target.setPointerCapture(e.pointerId);
      }
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }, 250);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (longPressTimerRef.current && !isDraggingRef.current) {
      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);
      if (dx > 8 || dy > 8) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    if (!isDraggingRef.current) return;

    e.preventDefault();
    setDragPosition({ x: e.clientX, y: e.clientY });
    updateInsertIndex(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    setIsLongPress(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    const fromIdx = draggingIndexRef.current;
    const toIdx = insertIndexRef.current;

    if (fromIdx !== null && toIdx !== null && fromIdx !== toIdx) {
      const actualToIdx = toIdx > fromIdx ? toIdx - 1 : toIdx;
      onReorder(fromIdx, actualToIdx);
    }

    setDraggingIndex(null);
    draggingIndexRef.current = null;
    setInsertIndex(null);
    insertIndexRef.current = null;
    setDragPosition({ x: 0, y: 0 });
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsLongPress(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    setDraggingIndex(null);
    draggingIndexRef.current = null;
    setInsertIndex(null);
    insertIndexRef.current = null;
    setDragPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  const renderPOICard = (poi: TripPOI, index: number, isDragging: boolean = false) => {
    const isSelected = selectedPoi === poi.id;
    const dayColorIndex = index % dayButtonColors.length;
    const day = getDayForPoi(poi.id);
    const isUnscheduled = !day;

    return (
      <GlassCard className={`overflow-hidden ${isDragging ? 'shadow-2xl ring-2 ring-primary-mid/40' : ''}`}>
        <div className="flex items-start gap-3 p-4">
          {viewMode !== 'all' && (
            <div className="flex flex-col items-center justify-center pt-1">
              <GripVertical
                size={18}
                className={`transition-colors ${isDragging ? 'text-primary-mid' : 'text-gray-300'}`}
              />
            </div>
          )}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 bg-gradient-to-br ${
              isUnscheduled ? 'from-amber-400 to-orange-500' : dayButtonColors[dayColorIndex]
            }`}
          >
            {isUnscheduled ? '?' : index + 1}
          </div>

          <img
            src={poi.image}
            alt={poi.name}
            className={`w-20 h-20 rounded-lg object-cover flex-shrink-0 ${isUnscheduled ? 'opacity-80' : ''}`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded border ${typeColors[poi.type]}`}>
                {typeLabels[poi.type]}
              </span>
              {isUnscheduled && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 font-medium">
                  待安排
                </span>
              )}
              {poi.duration && <span className="text-xs text-gray-500">{poi.duration}</span>}
            </div>
            <h4 className="font-medium text-gray-800 truncate">{poi.name}</h4>
            {poi.price > 0 && <p className="text-sm text-primary-mid mt-1">¥{poi.price}</p>}
          </div>

          {!isDragging && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDay(poi.id);
              }}
              className={`flex items-center gap-1 text-xs hover:text-primary-mid transition-colors px-2 py-1 rounded-lg hover:bg-primary-mid/10 ${
                isUnscheduled ? 'text-amber-600 bg-amber-50' : 'text-gray-500'
              }`}
            >
              <span className="font-medium">{day ? `Day${day}` : '去安排'}</span>
              <Edit3 size={12} className={isUnscheduled ? 'text-amber-500' : 'text-gray-400'} />
            </button>
          )}
        </div>
      </GlassCard>
    );
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pois.map((poi, index) => {
        const isSelected = selectedPoi === poi.id;
        const isDragging = draggingIndex === index;
        const showInsertAbove = insertIndex === index && draggingIndex !== null && draggingIndex !== index;
        const showTransport = viewMode !== 'all' && index < pois.length - 1;
        const transportInfo = showTransport ? calculateTransport(poi, pois[index + 1]) : null;
        const isTransportExpanded = selectedTransportIndex === index;
        const day = getDayForPoi(poi.id);
        const isUnscheduled = !day;

        return (
          <div key={poi.id} className="relative">
            {showInsertAbove && (
              <div
                className="mb-4 rounded-2xl border-2 border-dashed border-primary-mid/60 bg-primary-mid/15 transition-all duration-300 ease-out"
                style={{ height: cardHeight }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-primary-mid/60 text-sm font-medium">放到这里</div>
                </div>
              </div>
            )}

            <div
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`transition-all duration-300 ease-out ${
                isDragging ? 'opacity-40 scale-[0.97]' : ''
              } ${isLongPress && isDragging ? 'scale-[0.98]' : ''}`}
              onPointerDown={(e) => handlePointerDown(e, index)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              style={{ touchAction: 'none' }}
            >
              <SwipeableCard onDelete={() => onDelete(poi.id)}>
                <div
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary-mid rounded-2xl' : ''
                  } ${isUnscheduled ? '' : ''} ${viewMode !== 'all' ? 'active:scale-[0.98]' : ''}`}
                  onClick={() => onPoiClick(poi)}
                >
                  {renderPOICard(poi, index)}
                </div>
              </SwipeableCard>
            </div>

            {showTransport && transportInfo && (
              <div
                className={`mx-4 my-2 transition-all duration-300 ease-out cursor-pointer ${
                  isTransportExpanded ? '' : 'hover:bg-white/30'
                }`}
                onClick={() => setSelectedTransportIndex(isTransportExpanded ? null : index)}
              >
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-mid/10">
                    <Bus size={16} className="text-primary-mid" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {formatDistance(transportInfo.distance)}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-sm text-gray-600">
                        公交约{formatDuration(transportInfo.transitDuration)}
                      </span>
                    </div>
                  </div>
                  <ArrowDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${
                      isTransportExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isTransportExpanded && (
                  <div className="mt-2 grid grid-cols-3 gap-2 animate-slide-down">
                    <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
                      <Bus size={18} className="mx-auto mb-1 text-green-600" />
                      <p className="text-xs font-medium text-green-700">公交</p>
                      <p className="text-xs text-green-600">{formatDuration(transportInfo.transitDuration)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                      <TrainFront size={18} className="mx-auto mb-1 text-blue-600" />
                      <p className="text-xs font-medium text-blue-700">地铁</p>
                      <p className="text-xs text-blue-600">
                        {formatDuration(Math.ceil(transportInfo.transitDuration * 0.8))}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-center">
                      <Car size={18} className="mx-auto mb-1 text-orange-600" />
                      <p className="text-xs font-medium text-orange-700">打车</p>
                      <p className="text-xs text-orange-600">¥{transportInfo.taxiCost}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {insertIndex === pois.length && draggingIndex !== null && draggingIndex !== pois.length && (
        <div
          className="mb-4 rounded-2xl border-2 border-dashed border-primary-mid/60 bg-primary-mid/15 transition-all duration-300 ease-out"
          style={{ height: cardHeight }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary-mid/60 text-sm font-medium">放到这里</div>
          </div>
        </div>
      )}

      {draggingIndex !== null && pois[draggingIndex] && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: dragPosition.x - dragOffset.x,
            top: dragPosition.y - dragOffset.y,
            width: cardRefs.current[draggingIndex]?.offsetWidth || 320,
            transform: 'rotate(3deg) scale(1.03)',
            transition: 'transform 0.15s ease-out',
          }}
        >
          {renderPOICard(pois[draggingIndex], draggingIndex, true)}
        </div>
      )}
    </div>
  );
}
