import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, MessageSquare } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Мінімум 2 символи').max(100, 'Максимум 100 символів'),
  email: z.string().trim().email('Невірний формат email').max(255).or(z.literal('')),
  topic: z.string().trim().min(3, 'Мінімум 3 символи').max(200, 'Максимум 200 символів'),
  message: z.string().trim().min(10, 'Мінімум 10 символів').max(2000, 'Максимум 2000 символів'),
});

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('feedback').insert({
        name: result.data.name,
        email: result.data.email || null,
        topic: result.data.topic,
        message: result.data.message,
      });

      if (error) throw error;

      toast({
        title: t('contact.success'),
        description: 'Ми зв\'яжемося з вами найближчим часом.',
      });

      setFormData({ name: '', email: '', topic: '', message: '' });
    } catch (error) {
      toast({
        title: t('contact.error'),
        description: 'Спробуйте ще раз пізніше.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="civic-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('contact.subtitle')}</p>
          <p className="text-sm text-muted-foreground mt-2 italic">
            Обратитесь к администраторам для сотрудничества, идей, предложений или жалоб.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Форма зв'язку
                </CardTitle>
                <CardDescription>
                  Заповніть форму нижче і ми відповімо вам якомога швидше
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.name')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ваше ім'я"
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">{t('contact.topic')} *</Label>
                    <Input
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="Тема повідомлення"
                      className={errors.topic ? 'border-destructive' : ''}
                    />
                    {errors.topic && (
                      <p className="text-xs text-destructive">{errors.topic}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.message')} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ваше повідомлення..."
                      rows={6}
                      className={errors.message ? 'border-destructive' : ''}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    <Send className="h-4 w-4" />
                    {isSubmitting ? t('common.loading') : t('contact.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Контакти
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <a
                    href="mailto:info@sviydosvoih.ua"
                    className="text-primary hover:underline text-sm"
                  >
                    info@sviydosvoih.ua
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Час відповіді</p>
                  <p className="text-sm text-muted-foreground">
                    Зазвичай протягом 24-48 годин
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Ми цінуємо ваш зворотний зв'язок. Всі повідомлення читаються адміністрацією
                  платформи.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
