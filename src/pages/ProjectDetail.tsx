import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle, Loader2, Building2, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

const statusLabels: Record<string, string> = {
  open: 'Открыт для заявок',
  in_progress: 'В работе',
  closed: 'Набор закрыт',
};

const statusStyles: Record<string, string> = {
  open: 'bg-success/10 text-success border-success/20',
  in_progress: 'bg-warning/10 text-warning border-warning/20',
  closed: 'bg-muted text-muted-foreground',
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          groups (name, description)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: existingApplication } = useQuery({
    queryKey: ['application', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('project_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error('Необходима авторизация');
      
      const { error } = await supabase
        .from('applications')
        .insert({
          project_id: id,
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      toast.success('Заявка успешно отправлена!');
    },
    onError: (error) => {
      toast.error('Ошибка при отправке заявки');
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  if (projectLoading) {
    return (
      <KrakenLayout>
        <div className="kraken-container py-12">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </KrakenLayout>
    );
  }

  if (!project) {
    return (
      <KrakenLayout>
        <div className="kraken-container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Проект не найден</h1>
          <Button asChild>
            <Link to="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              К каталогу
            </Link>
          </Button>
        </div>
      </KrakenLayout>
    );
  }

  return (
    <KrakenLayout>
      <div className="kraken-container py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/catalog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к каталогу
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start gap-4 mb-4">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <span className={cn('kraken-badge', statusStyles[project.status])}>
                  {statusLabels[project.status]}
                </span>
              </div>
              
              {project.groups && (
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Building2 className="h-4 w-4" />
                  <span>{project.groups.name}</span>
                </div>
              )}
              
              {project.description && (
                <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                  {project.description}
                </p>
              )}
            </div>

            {project.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Требования</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{project.requirements}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            {existingApplication ? (
              <Card className="border-success/50">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Заявка отправлена</h3>
                  <p className="text-sm text-muted-foreground">
                    Ваша заявка на рассмотрении. Мы свяжемся с вами по указанным контактам.
                  </p>
                </CardContent>
              </Card>
            ) : project.status === 'open' ? (
              user ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Подать заявку</CardTitle>
                    <CardDescription>
                      Заполните форму для участия в проекте
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Полное имя *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Сообщение</Label>
                        <Textarea
                          id="message"
                          placeholder="Расскажите о себе и почему хотите участвовать..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Отправить заявку
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold mb-2">Хотите участвовать?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Войдите или зарегистрируйтесь, чтобы подать заявку
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button asChild>
                        <Link to="/login">Войти</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/signup">Регистрация</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Alert>
                <AlertDescription>
                  Набор заявок на этот проект закрыт.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </KrakenLayout>
  );
}
