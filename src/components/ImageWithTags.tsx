import { useRef, memo, useCallback } from 'react';
import Tag from '@/components/Tag';

const ImageWithTags = memo(({
  imageBase64,
  title,
  tags,
  onImageClick,
  dragTag
}: {
  imageBase64: string;
  title: string;
  tags: any[];
  onImageClick: (x: number, y: number) => void;
  dragTag: (id: string, x: number, y: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    onImageClick(xPercent, yPercent);
  }, [onImageClick]);

  return (
    <div ref={containerRef} className="relative w-[600px] h-[400px] mx-auto" onClick={handleClick}>
      <img
        src={imageBase64}
        alt={title}
        className="w-full h-full object-contain rounded-md"
      />
      {tags.map((tag: any) => (
        <Tag
          key={tag.id}
          id={tag.id}
          x={tag.x}
          y={tag.y}
          index={tag.index}
          containerRef={containerRef}
          onDrag={dragTag}
        />
      ))}
    </div>
  );
});

export default ImageWithTags; 