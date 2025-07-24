import { useRef } from 'react';
import Tag from './Tag';

const ImageWithTags = ({
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    onImageClick(xPercent, yPercent);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-w-[300px] min-h-[300px] flex items-center justify-center" onClick={handleClick}>
      <img
        src={imageBase64}
        alt={title}
        className="max-w-full max-h-full object-contain min-w-[300px] min-h-[300px] rounded-md"
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
};

export default ImageWithTags; 