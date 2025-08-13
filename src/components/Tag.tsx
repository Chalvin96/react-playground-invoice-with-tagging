import { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import TagBadge from '@/components/TagBadge';

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
        left: `${x}%`,
        top: `${y}%`,
      }}
      className={`
        absolute -translate-x-1/2 -translate-y-1/2 
        cursor-pointer select-none 
        transition-colors
        hover:scale-110
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <TagBadge
        index={index}
        className="shadow-lg hover:bg-purple-600 transition-colors"
      />
    </div>
  );
};

export default Tag;
