import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Mail, Users } from 'lucide-react';

export default function Groups() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="civic-container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Каталог групп</h1>
          <p className="text-muted-foreground">
            Исследуйте общественные организации и инициативы в вашем регионе
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Card key={group.id} className="civic-card flex flex-col">
                {group.image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={group.image_url}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {group.name}
                  </CardTitle>
                  {group.description && (
                    <CardDescription className="line-clamp-3">
                      {group.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <div className="flex flex-wrap gap-2">
                    {group.contact_email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${group.contact_email}`}>
                          <Mail className="h-4 w-4 mr-1" />
                          Написать
                        </a>
                      </Button>
                    )}
                    {group.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={group.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Сайт
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Групп пока нет</h3>
            <p className="text-muted-foreground">
              Скоро здесь появятся общественные организации
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
