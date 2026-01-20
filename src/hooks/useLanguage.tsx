import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'ua';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Header
    'nav.catalog': 'Каталог',
    'nav.communication': 'Коммуникация',
    'nav.cooperation': 'Сотрудничество',
    'nav.about': 'О нас',
    'nav.contact': 'Контакт',
    'nav.login': 'Войти',
    'nav.signup': 'Регистрация',
    'nav.logout': 'Выйти',
    'nav.admin': 'Админ-панель',
    
    // Landing
    'hero.title': 'Горизонтальная власть',
    'hero.subtitle': 'Платформа гражданского сотрудничества для объединения элит и экспертных групп',
    'hero.cta': 'Присоединиться',
    'hero.secondary': 'Узнать больше',
    'features.catalog.title': 'Каталог групп',
    'features.catalog.desc': 'Реестр экспертных групп и элит с верифицированной репутацией',
    'features.projects.title': 'Комната проектов',
    'features.projects.desc': 'Совместные инициативы для решения общественных задач',
    'features.trust.title': 'Доверие и прозрачность',
    'features.trust.desc': 'Открытая структура взаимодействия и отчётности',
    'stats.groups': 'Экспертных групп',
    'stats.projects': 'Активных проектов',
    'stats.participants': 'Участников',
    
    // Catalog
    'catalog.title': 'Каталог групп',
    'catalog.subtitle': 'Реестр экспертных групп и элит',
    'catalog.empty': 'Группы ещё не добавлены',
    'catalog.expertise': 'Экспертиза',
    'catalog.contact': 'Связаться',
    
    // Cooperation
    'cooperation.title': 'Комната проектов',
    'cooperation.subtitle': 'Активные инициативы для сотрудничества',
    'cooperation.empty': 'Проекты ещё не созданы',
    'cooperation.join': 'Присоединиться',
    'cooperation.requirements': 'Требования',
    'cooperation.status.open': 'Открыт',
    'cooperation.status.in_progress': 'В процессе',
    'cooperation.status.closed': 'Закрыт',
    
    // Communication
    'communication.title': 'Коммуникация',
    'communication.subtitle': 'Новости и обновления сообщества',
    'communication.coming': 'Скоро здесь появятся новости и обновления платформы',
    
    // About
    'about.title': 'О платформе',
    'about.manifesto.title': 'Манифест',
    'about.manifesto.p1': 'Мы верим в силу горизонтальной кооперации. В мире, где вертикальные структуры власти часто становятся препятствием для прогресса, мы создаём пространство для равноправного сотрудничества.',
    'about.manifesto.p2': 'Наша платформа объединяет экспертов, лидеров мнений и активных граждан для решения задач, которые невозможно решить в одиночку.',
    'about.manifesto.p3': 'Прозрачность, доверие и ответственность — основы нашего взаимодействия.',
    'about.values.title': 'Ценности',
    'about.values.horizontal': 'Горизонтальность',
    'about.values.horizontal.desc': 'Равноправие участников независимо от статуса',
    'about.values.transparency': 'Прозрачность',
    'about.values.transparency.desc': 'Открытость процессов и решений',
    'about.values.responsibility': 'Ответственность',
    'about.values.responsibility.desc': 'Каждый несёт ответственность за общий результат',
    
    // Contact
    'contact.title': 'Связаться с нами',
    'contact.subtitle': 'Отправьте сообщение администрации платформы',
    'contact.name': 'Ваше имя',
    'contact.email': 'Email (необязательно)',
    'contact.topic': 'Тема',
    'contact.message': 'Сообщение',
    'contact.submit': 'Отправить',
    'contact.success': 'Сообщение успешно отправлено',
    'contact.error': 'Ошибка при отправке',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
    'common.back': 'Назад',
    'common.submit': 'Отправить',
    'common.cancel': 'Отмена',
  },
  ua: {
    // Header
    'nav.catalog': 'Каталог',
    'nav.communication': 'Комунікація',
    'nav.cooperation': 'Співпраця',
    'nav.about': 'Про нас',
    'nav.contact': 'Контакт',
    'nav.login': 'Увійти',
    'nav.signup': 'Реєстрація',
    'nav.logout': 'Вийти',
    'nav.admin': 'Адмін-панель',
    
    // Landing
    'hero.title': 'Горизонтальна влада',
    'hero.subtitle': 'Платформа громадянської співпраці для об\'єднання еліт та експертних груп',
    'hero.cta': 'Приєднатися',
    'hero.secondary': 'Дізнатися більше',
    'features.catalog.title': 'Каталог груп',
    'features.catalog.desc': 'Реєстр експертних груп та еліт з верифікованою репутацією',
    'features.projects.title': 'Кімната проєктів',
    'features.projects.desc': 'Спільні ініціативи для вирішення суспільних завдань',
    'features.trust.title': 'Довіра та прозорість',
    'features.trust.desc': 'Відкрита структура взаємодії та звітності',
    'stats.groups': 'Експертних груп',
    'stats.projects': 'Активних проєктів',
    'stats.participants': 'Учасників',
    
    // Catalog
    'catalog.title': 'Каталог груп',
    'catalog.subtitle': 'Реєстр експертних груп та еліт',
    'catalog.empty': 'Групи ще не додані',
    'catalog.expertise': 'Експертиза',
    'catalog.contact': 'Зв\'язатися',
    
    // Cooperation
    'cooperation.title': 'Кімната проєктів',
    'cooperation.subtitle': 'Активні ініціативи для співпраці',
    'cooperation.empty': 'Проєкти ще не створені',
    'cooperation.join': 'Приєднатися',
    'cooperation.requirements': 'Вимоги',
    'cooperation.status.open': 'Відкрито',
    'cooperation.status.in_progress': 'В процесі',
    'cooperation.status.closed': 'Закрито',
    
    // Communication
    'communication.title': 'Комунікація',
    'communication.subtitle': 'Новини та оновлення спільноти',
    'communication.coming': 'Скоро тут з\'являться новини та оновлення платформи',
    
    // About
    'about.title': 'Про платформу',
    'about.manifesto.title': 'Маніфест',
    'about.manifesto.p1': 'Ми віримо в силу горизонтальної кооперації. У світі, де вертикальні структури влади часто стають перешкодою для прогресу, ми створюємо простір для рівноправної співпраці.',
    'about.manifesto.p2': 'Наша платформа об\'єднує експертів, лідерів думок та активних громадян для вирішення завдань, які неможливо вирішити наодинці.',
    'about.manifesto.p3': 'Прозорість, довіра та відповідальність — основи нашої взаємодії.',
    'about.values.title': 'Цінності',
    'about.values.horizontal': 'Горизонтальність',
    'about.values.horizontal.desc': 'Рівноправ\'я учасників незалежно від статусу',
    'about.values.transparency': 'Прозорість',
    'about.values.transparency.desc': 'Відкритість процесів та рішень',
    'about.values.responsibility': 'Відповідальність',
    'about.values.responsibility.desc': 'Кожен несе відповідальність за спільний результат',
    
    // Contact
    'contact.title': 'Зв\'язатися з нами',
    'contact.subtitle': 'Надішліть повідомлення адміністрації платформи',
    'contact.name': 'Ваше ім\'я',
    'contact.email': 'Email (необов\'язково)',
    'contact.topic': 'Тема',
    'contact.message': 'Повідомлення',
    'contact.submit': 'Надіслати',
    'contact.success': 'Повідомлення успішно надіслано',
    'contact.error': 'Помилка при надсиланні',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.error': 'Сталася помилка',
    'common.back': 'Назад',
    'common.submit': 'Надіслати',
    'common.cancel': 'Скасувати',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
