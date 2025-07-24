
import ItemsList from './ItemsList';

const TaggedItemsSection = ({
  tags,
  itemData,
  onEditItem
}: {
  tags: any[];
  itemData: any;
  onEditItem: (tagId: string) => void;
}) => {
  return (
    <div className="w-[400px] min-w-[400px] flex flex-col h-screen overflow-y-auto bg-white rounded-lg">
      <div className="justify-between p-4 border-b sticky top-0 bg-white z-10 text-center">
        <span className="font-semibold text-lg">Item List</span>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <ItemsList
          tags={tags}
          itemData={itemData}
          onEditItem={onEditItem}
        />
      </div>
    </div>
  );
};

export default TaggedItemsSection; 