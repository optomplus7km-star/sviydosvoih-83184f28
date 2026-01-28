import { Link } from 'react-router-dom';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ExternalLink } from 'lucide-react';

// 9 predefined groups - these will be replaced with database data later
const staticGroups = [
  {
    id: '1',
    name: 'Група 1',
    description: 'Опис групи 1. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '2',
    name: 'Група 2',
    description: 'Опис групи 2. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '3',
    name: 'Група 3',
    description: 'Опис групи 3. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '4',
    name: 'Група 4',
    description: 'Опис групи 4. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '5',
    name: 'Група 5',
    description: 'Опис групи 5. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '6',
    name: 'Група 6',
    description: 'Опис групи 6. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '7',
    name: 'Група 7',
    description: 'Опис групи 7. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '8',
    name: 'Група 8',
    description: 'Опис групи 8. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
  {
    id: '9',
    name: 'Група 9',
    description: 'Опис групи 9. Тут буде детальний опис діяльності та місії групи.',
    image_url: null,
  },
];

const CatalogPage = () => {
  const { t } = useTranslation();

  return (
    <KrakenLayout>
      <div className="kraken-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 kraken-gradient-text">
            {t('nav', 'catalog')}
          </h1>
          <p className="text-lg text-muted-foreground">
            Каталог організацій та спільнот платформи
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticGroups.map((group) => (
            <Link key={group.id} to={`/groups/${group.id}`}>
              <Card className="h-full kraken-card group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {group.image_url ? (
                      <img
                        src={group.image_url}
                        alt={group.name}
                        className="w-14 h-14 rounded-lg object-cover bg-muted"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-7 w-7 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                        {group.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {group.description && (
                    <CardDescription className="line-clamp-3">
                      {group.description}
                    </CardDescription>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                    <span>Детальніше</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </KrakenLayout>
  );
};

export default CatalogPage;
