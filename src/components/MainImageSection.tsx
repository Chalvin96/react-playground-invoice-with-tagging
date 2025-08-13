
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageWithTags from '@/components/ImageWithTags';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { memo, useCallback } from 'react';

const MainImageSection = memo(({
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
  if (!selectedImage) return (
    <div className="w-[850px] shrink-0 h-full flex flex-col bg-white border border-gray-200 shadow p-8 gap-2">
      <div className="flex-1 flex items-center justify-center h-[400px] w-[600px] mx-auto">
        <div className="text-gray-500">No Image Selected</div>
      </div>
    </div>
  );

  const handleImageClick = useCallback((x: number, y: number) => {
    onImageClick(selectedImage.id, x, y);
  }, [onImageClick, selectedImage.id]);

  return (
    <div className="flex flex-col bg-white border border-gray-200 shadow p-8 gap-2 w-[850px] shrink-0 h-full">
      {/* Title input */}
      <div className="flex items-center gap-2">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            value={selectedImage.title}
            onChange={e => updateImageTitle(selectedImage.id, e.target.value)}
            className="input input-ghost shadow-none md:text-2xl font-semibold bg-white border-none focus:ring-offset-0 focus:border-ring-white focus:visible:ring-0"

          />
        </div>
      </div>
      <Separator />
      {/* Image with tags */}
      <div className="flex-1 flex items-center justify-center mx-auto">
        <ImageWithTags
          imageUrl={selectedImage.imageUrl}
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
});

export default MainImageSection; 