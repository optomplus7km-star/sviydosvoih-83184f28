import { Link } from 'react-router-dom';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderOpen, Users, BarChart3, Clock, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <KrakenLayout>
      {/* Header */}
      <section className="py-12 border-b border-border/50">
        <div className="kraken-container">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('dashboard', 'title')}</h1>
          <p className="text-muted-foreground">Управляйте своими проектами и группами</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="kraken-container">
          <Tabs defaultValue="projects">
            <TabsList className="mb-6">
              <TabsTrigger value="projects" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                {t('dashboard', 'myProjects')}
              </TabsTrigger>
              <TabsTrigger value="groups" className="gap-2">
                <Users className="h-4 w-4" />
                {t('dashboard', 'myGroups')}
              </TabsTrigger>
              <TabsTrigger value="polls" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('dashboard', 'myPolls')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <MyProjects userId={user?.id} />
            </TabsContent>
            
            <TabsContent value="groups">
              <MyGroups userId={user?.id} />
            </TabsContent>
            
            <TabsContent value="polls">
              <MyPolls userId={user?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </KrakenLayout>
  );
}

function MyProjects({ userId }: { userId?: string }) {
  const { t } = useTranslation();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          projects(id, title, status, description)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">У вас пока нет заявок</h3>
        <p className="text-muted-foreground mb-4">Подайте заявку на участие в проектах</p>
        <Button className="kraken-btn-glow" asChild>
          <Link to="/catalog">{t('nav', 'catalog')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Link
          key={app.id}
          to={`/projects/${app.project_id}`}
          className="kraken-card p-4 flex items-center gap-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex-1">
            <h3 className="font-semibold">{app.projects?.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{app.projects?.description}</p>
          </div>
          <span className={cn(
            'kraken-badge',
            app.status === 'approved' && 'kraken-badge-active',
            app.status === 'pending' && 'kraken-badge-pending',
            app.status === 'rejected' && 'kraken-badge-closed'
          )}>
            {app.status === 'approved' ? 'Одобрено' : app.status === 'pending' ? 'На рассмотрении' : 'Отклонено'}
          </span>
        </Link>
      ))}
    </div>
  );
}

function MyGroups({ userId }: { userId?: string }) {
  const { t } = useTranslation();

  const { data: memberships, isLoading } = useQuery({
    queryKey: ['my-group-memberships', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          groups(id, name, description, is_private)
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!memberships || memberships.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Вы не состоите в группах</h3>
        <p className="text-muted-foreground mb-4">Присоединитесь к сообществам</p>
        <Button className="kraken-btn-glow" asChild>
          <Link to="/groups">{t('nav', 'groups')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {memberships.map((membership) => (
        <Link
          key={membership.id}
          to={`/groups/${membership.group_id}`}
          className="kraken-card p-4 flex items-center gap-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex-1">
            <h3 className="font-semibold">{membership.groups?.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{membership.groups?.description}</p>
          </div>
          <span className="kraken-badge kraken-badge-active">
            {membership.role === 'owner' ? 'Владелец' : membership.role === 'admin' ? 'Админ' : 'Участник'}
          </span>
        </Link>
      ))}
    </div>
  );
}

function MyPolls({ userId }: { userId?: string }) {
  const { t } = useTranslation();

  const { data: votes, isLoading } = useQuery({
    queryKey: ['my-poll-votes', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('poll_votes')
        .select(`
          *,
          polls(id, question, is_active),
          poll_options(option_text)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!votes || votes.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Вы ещё не голосовали</h3>
        <p className="text-muted-foreground">Активные опросы появятся на главной странице</p>
      </div>
    );
  }

  // Group votes by poll
  const pollVotes = votes.reduce((acc, vote) => {
    if (!acc[vote.poll_id]) {
      acc[vote.poll_id] = {
        poll: vote.polls,
        votes: [],
      };
    }
    acc[vote.poll_id].votes.push(vote);
    return acc;
  }, {} as Record<string, { poll: any; votes: any[] }>);

  return (
    <div className="space-y-4">
      {Object.values(pollVotes).map((item: any) => (
        <div key={item.poll.id} className="kraken-card p-4">
          <h3 className="font-semibold mb-2">{item.poll.question}</h3>
          <div className="flex flex-wrap gap-2">
            {item.votes.map((vote: any) => (
              <span key={vote.id} className="kraken-badge bg-primary/10 text-primary">
                {vote.poll_options?.option_text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
