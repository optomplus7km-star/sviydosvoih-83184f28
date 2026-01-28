import { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectImageUpload } from '@/components/admin/ProjectImageUpload';

interface ProjectForm {
  title: string;
  description: string;
  requirements: string;
  group_id: string | null;
  status: string;
  is_active: boolean;
  images: string[];
}

const emptyForm: ProjectForm = {
  title: '',
  description: '',
  requirements: '',
  group_id: null,
  status: 'open',
  is_active: true,
  images: [],
};

const statusLabels: Record<string, string> = {
  open: 'Открыт',
  in_progress: 'В работе',
  closed: 'Закрыт',
};

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
        .select(`*, groups (name)`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: groups } = useQuery({
    queryKey: ['admin-groups-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        group_id: form.group_id || null,
        status: form.status,
        is_active: form.is_active,
        images: form.images,
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

  const openEdit = (project: typeof projects extends (infer T)[] ? T : never) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description || '',
      requirements: project.requirements || '',
      group_id: project.group_id,
      status: project.status,
      is_active: project.is_active,
      images: (project as any).images || [],
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
              <DialogTitle>{editingId ? 'Редагувати проєкт' : 'Новий проєкт'}</DialogTitle>
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
                <Label>Организация</Label>
                <Select
                  value={form.group_id || 'none'}
                  onValueChange={(value) => setForm({ ...form, group_id: value === 'none' ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите организацию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без организации</SelectItem>
                    {groups?.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="is_active">Активний</Label>
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
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Организация</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Активен</TableHead>
                <TableHead className="w-24">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.groups?.name || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{statusLabels[project.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.is_active ? 'default' : 'secondary'}>
                        {project.is_active ? 'Да' : 'Нет'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Нет проектов
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
