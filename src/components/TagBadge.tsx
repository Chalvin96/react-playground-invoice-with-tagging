import { memo } from 'react';

interface TagBadgeProps {
    index: number;
    className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = memo(({
    index,
    className = ''
}) => {
    return (
        <div
            className={`
        w-5 h-5 text-xs
        bg-purple-500 text-white
        rounded-full 
        flex items-center justify-center 
        font-bold 
        shadow-sm
        ${className}
      `}
        >
            {index}
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.index === nextProps.index &&
        prevProps.className === nextProps.className
    );
});

TagBadge.displayName = 'TagBadge';

export default TagBadge; 