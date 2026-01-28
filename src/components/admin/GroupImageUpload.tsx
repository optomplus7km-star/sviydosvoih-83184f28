import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface GroupImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  singleImage?: boolean;
}

export function GroupImageUpload({ 
  images, 
  onChange, 
  maxImages = 10,
  singleImage = false 
}: GroupImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveMaxImages = singleImage ? 1 : maxImages;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = effectiveMaxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Максимум ${effectiveMaxImages} ${singleImage ? 'фото' : 'фотографий'}`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    
    // Validate files
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        toast.error('Можно загружать только изображения');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Максимальный размер файла 5MB');
        return;
      }
    }

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `group-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `groups/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      if (singleImage) {
        onChange(newUrls);
      } else {
        onChange([...images, ...newUrls]);
      }
      toast.success(`Загружено ${newUrls.length} фото`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Ошибка при загрузке');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={!singleImage}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image grid */}
      {images.length > 0 && (
        <div className={cn(
          "grid gap-2",
          singleImage ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
        )}>
          {images.map((url, index) => (
            <div 
              key={index} 
              className={cn(
                "relative group rounded-lg overflow-hidden bg-muted",
                singleImage ? "aspect-video" : "aspect-square"
              )}
            >
              <img
                src={url}
                alt={`Фото ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && !singleImage && (
                <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Обложка
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < effectiveMaxImages && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {singleImage 
                ? (images.length === 0 ? 'Загрузить фото' : 'Заменить фото')
                : `Добавить фото (${images.length}/${effectiveMaxImages})`
              }
            </>
          )}
        </Button>
      )}

      {!singleImage && images.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Первое фото станет обложкой группы
        </p>
      )}
    </div>
  );
}
