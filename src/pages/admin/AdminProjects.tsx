import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectImageUpload } from '@/components/admin/ProjectImageUpload';

interface ProjectForm {
  title: string;
  description: string;
  requirements: string;
  status: string;
  is_active: boolean;
  images: string[];
}

const emptyForm: ProjectForm = {
  title: '',
  description: '',
  requirements: '',
  status: 'open',
  is_active: true,
  images: [],
};

const statusLabels: Record<string, string> = {
  open: 'Открыт',
  in_progress: 'В работе',
  closed: 'Закрыт',
};

interface ProjectWithRelations {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  status: string;
  is_active: boolean;
  images: string[] | null;
  display_order: number;
  created_at: string;
}

export default function AdminProjects() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as ProjectWithRelations[];
    },
  });

  const sortedProjects = useMemo(() => 
    projects?.sort((a, b) => a.display_order - b.display_order) || [],
    [projects]
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const maxOrder = projects?.reduce((max, p) => Math.max(max, p.display_order), -1) ?? -1;
      
      const payload = {
        title: form.title,
        description: form.description || null,
        requirements: form.requirements || null,
        status: form.status,
        is_active: form.is_active,
        images: form.images,
        ...(editingId ? {} : { display_order: maxOrder + 1 }),
      };
      
      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success(editingId ? 'Проект обновлен' : 'Проект создан');
      closeDialog();
    },
    onError: () => {
      toast.error('Ошибка при сохранении');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Проект удален');
    },
    onError: () => {
      toast.error('Ошибка при удалении');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ projectId, direction }: { projectId: string; direction: 'up' | 'down' }) => {
      const currentIndex = sortedProjects.findIndex(p => p.id === projectId);
      if (currentIndex === -1) return;
      
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (swapIndex < 0 || swapIndex >= sortedProjects.length) return;
      
      const currentProject = sortedProjects[currentIndex];
      const swapProject = sortedProjects[swapIndex];
      
      // Swap display_order values
      const { error: error1 } = await supabase
        .from('projects')
        .update({ display_order: swapProject.display_order })
        .eq('id', currentProject.id);
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('projects')
        .update({ display_order: currentProject.display_order })
        .eq('id', swapProject.id);
      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
    onError: () => {
      toast.error('Ошибка при изменении порядка');
    },
  });

  const openEdit = (project: ProjectWithRelations) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description || '',
      requirements: project.requirements || '',
      status: project.status,
      is_active: project.is_active,
      images: project.images || [],
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Проекты</h1>
          <p className="text-muted-foreground">Управление проектами</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить проект
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Редактировать проект' : 'Новый проект'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Требования</Label>
                <Textarea
                  id="requirements"
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Открыт</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="closed">Закрыт</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
                <Label htmlFor="is_active">Активный</Label>
              </div>

              {/* Image upload */}
              <ProjectImageUpload
                images={form.images}
                onChange={(images) => setForm({ ...form, images })}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Отмена
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Сохранить
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {sortedProjects.length > 0 ? (
            sortedProjects.map((project, index) => {
              const imageUrl = project.images?.[0];
              
              return (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => reorderMutation.mutate({ projectId: project.id, direction: 'up' })}
                      disabled={index === 0 || reorderMutation.isPending}
                      title="Переместить вверх"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => reorderMutation.mutate({ projectId: project.id, direction: 'down' })}
                      disabled={index === sortedProjects.length - 1 || reorderMutation.isPending}
                      title="Переместить вниз"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline">{statusLabels[project.status]}</Badge>
                    <Badge variant={project.is_active ? 'default' : 'secondary'}>
                      {project.is_active ? 'Активный' : 'Неактивный'}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Нет проектов</p>
              <Button onClick={() => { setEditingId(null); setForm(emptyForm); setIsDialogOpen(true); }} className="mt-4">
                Создать первый проект
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}