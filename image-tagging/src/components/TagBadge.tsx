interface TagBadgeProps {
    index: number;
    className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({
    index,
    className = ''
}) => {
    return (
        <div
            className={`
        w-5 h-5 text-xs
        bg-purple-600 text-white
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
};

export default TagBadge; 