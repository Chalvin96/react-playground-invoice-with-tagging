import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';

export interface TagProps {
  id: string;
  x: number;
  y: number;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDrag: (id: string, newX: number, newY: number) => void;
}

const ITEM_TYPE = 'TAG';

const Tag: React.FC<TagProps> = ({ id, x, y, index, containerRef, onDrag }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id, x, y },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!item || !delta || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(100, item.x + (delta.x / rect.width) * 100));
      const newY = Math.max(0, Math.min(100, item.y + (delta.y / rect.height) * 100));
      onDrag(item.id, newX, newY);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, x, y, containerRef, onDrag]);

  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (elementRef.current) {
      drag(elementRef.current);
    }
  }, [drag]);

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        opacity: isDragging ? 0.5 : 1,
      }}
      className="bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none"
    >
      {index}
    </div>
  );
};

export default Tag;
