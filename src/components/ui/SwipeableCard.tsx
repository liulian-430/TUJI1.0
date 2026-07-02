import { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export default function SwipeableCard({ children, onDelete }: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const DELETE_THRESHOLD = 80;
  const DELETE_WIDTH = 72;

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = translateX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startXRef.current;
    let newX = currentXRef.current + diff;
    if (newX > 0) newX = newX * 0.3;
    if (newX < -DELETE_WIDTH * 1.5) newX = -DELETE_WIDTH * 1.5;
    setTranslateX(newX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateX < -DELETE_THRESHOLD) {
      setTranslateX(-DELETE_WIDTH);
    } else {
      setTranslateX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    currentXRef.current = translateX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    let newX = currentXRef.current + diff;
    if (newX > 0) newX = newX * 0.3;
    if (newX < -DELETE_WIDTH * 1.5) newX = -DELETE_WIDTH * 1.5;
    setTranslateX(newX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (translateX < -DELETE_THRESHOLD) {
      setTranslateX(-DELETE_WIDTH);
    } else {
      setTranslateX(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (translateX < -DELETE_THRESHOLD) {
        setTranslateX(-DELETE_WIDTH);
      } else {
        setTranslateX(0);
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="absolute right-0 top-0 bottom-0 flex items-center justify-center rounded-2xl"
        style={{
          width: DELETE_WIDTH,
          opacity: translateX < -5 ? 1 : 0,
          transition: 'opacity 0.25s ease-out',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.55), rgba(220, 38, 38, 0.45))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderLeft: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.15)',
        }}
      >
        <button
          onClick={onDelete}
          className="flex flex-col items-center gap-1 text-red-50"
          style={{ textShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}
        >
          <Trash2 size={20} />
          <span className="text-xs font-medium">删除</span>
        </button>
      </div>
      <div
        className="transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}
