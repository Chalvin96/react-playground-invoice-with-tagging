import React from 'react';
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
    <div className="w-[400px] flex flex-col h-screen overflow-y-auto bg-white">
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