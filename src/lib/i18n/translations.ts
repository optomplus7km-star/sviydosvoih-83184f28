export type Language = 'ru' | 'ua' | 'en';

export const translations = {
  // Common
  common: {
    loading: {
      ru: 'Загрузка...',
      ua: 'Завантаження...',
      en: 'Loading...',
    },
    error: {
      ru: 'Ошибка',
      ua: 'Помилка',
      en: 'Error',
    },
    success: {
      ru: 'Успешно',
      ua: 'Успішно',
      en: 'Success',
    },
    save: {
      ru: 'Сохранить',
      ua: 'Зберегти',
      en: 'Save',
    },
    cancel: {
      ru: 'Отмена',
      ua: 'Скасувати',
      en: 'Cancel',
    },
    delete: {
      ru: 'Удалить',
      ua: 'Видалити',
      en: 'Delete',
    },
    edit: {
      ru: 'Редактировать',
      ua: 'Редагувати',
      en: 'Edit',
    },
    create: {
      ru: 'Создать',
      ua: 'Створити',
      en: 'Create',
    },
    search: {
      ru: 'Поиск',
      ua: 'Пошук',
      en: 'Search',
    },
    viewAll: {
      ru: 'Смотреть все',
      ua: 'Переглянути все',
      en: 'View all',
    },
    learnMore: {
      ru: 'Узнать больше',
      ua: 'Дізнатись більше',
      en: 'Learn more',
    },
    joinNow: {
      ru: 'Присоединиться',
      ua: 'Приєднатися',
      en: 'Join now',
    },
    contact: {
      ru: 'Связаться',
      ua: "Зв'язатися",
      en: 'Contact',
    },
    back: {
      ru: 'Назад',
      ua: 'Назад',
      en: 'Back',
    },
    submit: {
      ru: 'Отправить',
      ua: 'Надіслати',
      en: 'Submit',
    },
  },

  // Navigation
  nav: {
    home: {
      ru: 'Главная',
      ua: 'Головна',
      en: 'Home',
    },
    catalog: {
      ru: 'Каталог',
      ua: 'Каталог',
      en: 'Catalog',
    },
    projects: {
      ru: 'Проекты',
      ua: 'Проекти',
      en: 'Projects',
    },
    groups: {
      ru: 'Группы',
      ua: 'Групи',
      en: 'Groups',
    },
    news: {
      ru: 'Новости',
      ua: 'Новини',
      en: 'News',
    },
    about: {
      ru: 'О нас',
      ua: 'Про нас',
      en: 'About',
    },
    dashboard: {
      ru: 'Панель',
      ua: 'Панель',
      en: 'Dashboard',
    },
    login: {
      ru: 'Войти',
      ua: 'Увійти',
      en: 'Log in',
    },
    signup: {
      ru: 'Регистрация',
      ua: 'Реєстрація',
      en: 'Sign up',
    },
    logout: {
      ru: 'Выйти',
      ua: 'Вийти',
      en: 'Log out',
    },
  },

  // Hero section
  hero: {
    title: {
      ru: 'Исследуй глубины сотрудничества',
      ua: 'Досліджуй глибини співпраці',
      en: 'Explore the depths of collaboration',
    },
    subtitle: {
      ru: 'Платформа для морских проектов, экологических инициатив и исследовательских команд',
      ua: 'Платформа для морських проектів, екологічних ініціатив та дослідницьких команд',
      en: 'Platform for marine projects, ecological initiatives, and research teams',
    },
    cta: {
      ru: 'Открыть каталог',
      ua: 'Відкрити каталог',
      en: 'Open catalog',
    },
    ctaSecondary: {
      ru: 'Создать проект',
      ua: 'Створити проект',
      en: 'Create project',
    },
  },

  // Sections
  sections: {
    featuredProjects: {
      ru: 'Популярные проекты',
      ua: 'Популярні проекти',
      en: 'Featured projects',
    },
    activeGroups: {
      ru: 'Активные группы',
      ua: 'Активні групи',
      en: 'Active groups',
    },
    latestNews: {
      ru: 'Последние новости',
      ua: 'Останні новини',
      en: 'Latest news',
    },
    activePolls: {
      ru: 'Активные опросы',
      ua: 'Активні опитування',
      en: 'Active polls',
    },
  },

  // Projects
  project: {
    title: {
      ru: 'Название проекта',
      ua: 'Назва проекту',
      en: 'Project title',
    },
    description: {
      ru: 'Описание',
      ua: 'Опис',
      en: 'Description',
    },
    deadline: {
      ru: 'Дедлайн',
      ua: 'Дедлайн',
      en: 'Deadline',
    },
    participants: {
      ru: 'Участники',
      ua: 'Учасники',
      en: 'Participants',
    },
    resources: {
      ru: 'Необходимые ресурсы',
      ua: 'Необхідні ресурси',
      en: 'Required resources',
    },
    status: {
      ru: 'Статус',
      ua: 'Статус',
      en: 'Status',
    },
    statusDraft: {
      ru: 'Черновик',
      ua: 'Чернетка',
      en: 'Draft',
    },
    statusActive: {
      ru: 'Активный',
      ua: 'Активний',
      en: 'Active',
    },
    statusCompleted: {
      ru: 'Завершён',
      ua: 'Завершено',
      en: 'Completed',
    },
    statusOpen: {
      ru: 'Открыт',
      ua: 'Відкритий',
      en: 'Open',
    },
    applyToJoin: {
      ru: 'Подать заявку',
      ua: 'Подати заявку',
      en: 'Apply to join',
    },
    daysLeft: {
      ru: 'дней осталось',
      ua: 'днів залишилось',
      en: 'days left',
    },
    goal: {
      ru: 'Цель',
      ua: 'Мета',
      en: 'Goal',
    },
    gallery: {
      ru: 'Галерея',
      ua: 'Галерея',
      en: 'Gallery',
    },
    noProjects: {
      ru: 'Пока нет проектов',
      ua: 'Поки немає проектів',
      en: 'No projects yet',
    },
    createFirst: {
      ru: 'Создайте первый проект',
      ua: 'Створіть перший проект',
      en: 'Create your first project',
    },
  },

  // Groups
  group: {
    title: {
      ru: 'Название группы',
      ua: 'Назва групи',
      en: 'Group name',
    },
    description: {
      ru: 'Описание',
      ua: 'Опис',
      en: 'Description',
    },
    members: {
      ru: 'Участники',
      ua: 'Учасники',
      en: 'Members',
    },
    projects: {
      ru: 'Проекты',
      ua: 'Проекти',
      en: 'Projects',
    },
    public: {
      ru: 'Публичная',
      ua: 'Публічна',
      en: 'Public',
    },
    private: {
      ru: 'Приватная',
      ua: 'Приватна',
      en: 'Private',
    },
    join: {
      ru: 'Вступить',
      ua: 'Вступити',
      en: 'Join',
    },
    leave: {
      ru: 'Покинуть',
      ua: 'Покинути',
      en: 'Leave',
    },
    noGroups: {
      ru: 'Пока нет групп',
      ua: 'Поки немає груп',
      en: 'No groups yet',
    },
  },

  // Dashboard
  dashboard: {
    title: {
      ru: 'Панель управления',
      ua: 'Панель керування',
      en: 'Dashboard',
    },
    myProjects: {
      ru: 'Мои проекты',
      ua: 'Мої проекти',
      en: 'My projects',
    },
    myGroups: {
      ru: 'Мои группы',
      ua: 'Мої групи',
      en: 'My groups',
    },
    myPolls: {
      ru: 'Мои опросы',
      ua: 'Мої опитування',
      en: 'My polls',
    },
    filterAll: {
      ru: 'Все',
      ua: 'Всі',
      en: 'All',
    },
    filterActive: {
      ru: 'Активные',
      ua: 'Активні',
      en: 'Active',
    },
    filterCompleted: {
      ru: 'Завершённые',
      ua: 'Завершені',
      en: 'Completed',
    },
    filterDraft: {
      ru: 'Черновики',
      ua: 'Чернетки',
      en: 'Drafts',
    },
  },

  // Polls
  poll: {
    vote: {
      ru: 'Голосовать',
      ua: 'Голосувати',
      en: 'Vote',
    },
    voted: {
      ru: 'Вы проголосовали',
      ua: 'Ви проголосували',
      en: 'You voted',
    },
    totalVotes: {
      ru: 'Всего голосов',
      ua: 'Всього голосів',
      en: 'Total votes',
    },
    endsAt: {
      ru: 'Завершится',
      ua: 'Завершиться',
      en: 'Ends at',
    },
    loginToVote: {
      ru: 'Войдите, чтобы голосовать',
      ua: 'Увійдіть, щоб голосувати',
      en: 'Log in to vote',
    },
  },

  // News
  news: {
    readMore: {
      ru: 'Читать далее',
      ua: 'Читати далі',
      en: 'Read more',
    },
    publishedAt: {
      ru: 'Опубликовано',
      ua: 'Опубліковано',
      en: 'Published',
    },
    noNews: {
      ru: 'Пока нет новостей',
      ua: 'Поки немає новин',
      en: 'No news yet',
    },
  },

  // Auth
  auth: {
    email: {
      ru: 'Email',
      ua: 'Email',
      en: 'Email',
    },
    password: {
      ru: 'Пароль',
      ua: 'Пароль',
      en: 'Password',
    },
    fullName: {
      ru: 'Полное имя',
      ua: 'Повне ім\'я',
      en: 'Full name',
    },
    loginTitle: {
      ru: 'Вход в аккаунт',
      ua: 'Вхід в акаунт',
      en: 'Log in to your account',
    },
    signupTitle: {
      ru: 'Создать аккаунт',
      ua: 'Створити акаунт',
      en: 'Create an account',
    },
    noAccount: {
      ru: 'Нет аккаунта?',
      ua: 'Немає акаунту?',
      en: 'Don\'t have an account?',
    },
    hasAccount: {
      ru: 'Уже есть аккаунт?',
      ua: 'Вже є акаунт?',
      en: 'Already have an account?',
    },
    invalidCredentials: {
      ru: 'Неверный email или пароль',
      ua: 'Неправильний email або пароль',
      en: 'Invalid email or password',
    },
    passwordMinLength: {
      ru: 'Пароль должен быть не менее 6 символов',
      ua: 'Пароль має бути не менше 6 символів',
      en: 'Password must be at least 6 characters',
    },
    signupSuccess: {
      ru: 'Регистрация успешна!',
      ua: 'Реєстрація успішна!',
      en: 'Registration successful!',
    },
    redirecting: {
      ru: 'Перенаправляем...',
      ua: 'Перенаправляємо...',
      en: 'Redirecting...',
    },
  },

  // Contact form
  contactForm: {
    title: {
      ru: 'Связаться с нами',
      ua: 'Зв\'язатися з нами',
      en: 'Contact us',
    },
    name: {
      ru: 'Ваше имя',
      ua: 'Ваше ім\'я',
      en: 'Your name',
    },
    email: {
      ru: 'Email',
      ua: 'Email',
      en: 'Email',
    },
    message: {
      ru: 'Сообщение',
      ua: 'Повідомлення',
      en: 'Message',
    },
    topic: {
      ru: 'Тема',
      ua: 'Тема',
      en: 'Topic',
    },
    sent: {
      ru: 'Сообщение отправлено!',
      ua: 'Повідомлення надіслано!',
      en: 'Message sent!',
    },
  },

  // Footer
  footer: {
    rights: {
      ru: 'Все права защищены',
      ua: 'Усі права захищено',
      en: 'All rights reserved',
    },
    tagline: {
      ru: 'Платформа морского сотрудничества',
      ua: 'Платформа морської співпраці',
      en: 'Marine collaboration platform',
    },
  },

  // Social platforms
  social: {
    telegram: {
      ru: 'Telegram',
      ua: 'Telegram',
      en: 'Telegram',
    },
    instagram: {
      ru: 'Instagram',
      ua: 'Instagram',
      en: 'Instagram',
    },
    youtube: {
      ru: 'YouTube',
      ua: 'YouTube',
      en: 'YouTube',
    },
    twitter: {
      ru: 'X (Twitter)',
      ua: 'X (Twitter)',
      en: 'X (Twitter)',
    },
    website: {
      ru: 'Сайт',
      ua: 'Сайт',
      en: 'Website',
    },
    email: {
      ru: 'Email',
      ua: 'Email',
      en: 'Email',
    },
  },
};

export type TranslationKey = keyof typeof translations;
