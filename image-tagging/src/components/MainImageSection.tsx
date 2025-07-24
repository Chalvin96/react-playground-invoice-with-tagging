
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import ImageWithTags from './ImageWithTags';

const MainImageSection = ({
  selectedImage,
  updateImageTitle,
  updateImageNotes,
  onImageClick,
  tags,
  dragTag
}: {
  selectedImage: any;
  updateImageTitle: (id: string, title: string) => void;
  updateImageNotes: (id: string, notes: string) => void;
  onImageClick: (id: string, x: number, y: number) => void;
  tags: any[];
  dragTag: any;
}) => {
  if (!selectedImage) return <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow p-8">No Image Selected</div>;

  const handleImageClick = (x: number, y: number) => {
    onImageClick(selectedImage.id, x, y);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow p-8 gap-6 min-w-[300px] max-w-2xl mx-auto flex-1 my-2">
      {/* Title input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={selectedImage.title}
          placeholder='Title'
          onChange={e => updateImageTitle(selectedImage.id, e.target.value)}
          className="input input-ghost text-2xl font-semibold bg-white"
        />
      </div>
      {/* Image with tags */}
      <div className="flex-1 flex items-center justify-center max-h-[450px]">
        <ImageWithTags
          imageBase64={selectedImage.imageBase64}
          title={selectedImage.title}
          tags={tags}
          onImageClick={handleImageClick}
          dragTag={dragTag}
        />
      </div>
      {/* Notes field */}
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <Textarea
          placeholder="Add notes about this image..."
          value={selectedImage.notes}
          onChange={e => updateImageNotes(selectedImage.id, e.target.value)}
          className="min-h-[120px] border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none bg-white w-full"
        />
      </div>
    </div>
  );
};

export default MainImageSection; 