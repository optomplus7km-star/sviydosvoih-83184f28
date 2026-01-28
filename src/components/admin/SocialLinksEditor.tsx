import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialIcon } from '@/components/common/SocialIcon';

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
}

const SOCIAL_PLATFORMS = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'X (Twitter)' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'website', label: 'Веб-сайт' },
  { value: 'email', label: 'Email' },
];

interface SocialLinksEditorProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  maxLinks?: number;
}

export function SocialLinksEditor({ links, onChange, maxLinks = 10 }: SocialLinksEditorProps) {
  const addLink = () => {
    if (links.length >= maxLinks) return;
    onChange([...links, { platform: 'telegram', url: '' }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <SocialIcon platform={link.platform} />
          </div>
          
          <Select
            value={link.platform}
            onValueChange={(value) => updateLink(index, 'platform', value)}
          >
            <SelectTrigger className="w-32 flex-shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOCIAL_PLATFORMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder={link.platform === 'email' ? 'email@example.com' : 'https://...'}
            value={link.url}
            onChange={(e) => updateLink(index, 'url', e.target.value)}
            className="flex-1"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeLink(index)}
            className="flex-shrink-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {links.length < maxLinks && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLink}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить ссылку
        </Button>
      )}
    </div>
  );
}
