
import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import ItemCard from '@/components/ItemCard';

interface TaggedItemsSectionProps {
  tags: ImageTagItem[];
  itemData: Record<string, ItemData>;
  onEditItem: (tagId: string) => void;
}

const K_CONST_EMPTY_ROW_DATA: ItemData = {
  name: '',
  type: 'Product',
  quantity: 0,
  unitPrice: 0,
  length: 0,
  width: 0,
  height: 0,
  notes: ''
}

const TaggedItemsSection: React.FC<TaggedItemsSectionProps> = ({
  tags,
  itemData,
  onEditItem
}) => {
  return (
    <div className="w-full flex flex-col h-full overflow-x-auto overflow-y-hidden">
      <div className="justify-between p-4 top-0 ">
        <span className="font-semibold text-lg">Item List</span>
      </div>
      <div className="flex flex-col gap-4 p-4 min-w-0">
        {tags.length === 0 ? (
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Items Yet</h3>
            <p className="text-gray-500 text-sm">Click on the image to add tags and items</p>
          </div>
        ) : (
          <div className="flex flex-col min-w-0 gap-3 w-full">
            {tags.map((tag) => {
              const data = itemData[tag.id] || K_CONST_EMPTY_ROW_DATA;
              return (
                <ItemCard
                  key={tag.id}
                  tag={tag}
                  data={data}
                  onEditItem={onEditItem}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaggedItemsSection; 