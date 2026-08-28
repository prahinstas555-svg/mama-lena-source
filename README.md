# Проект "Мама Лена" - Семейное кафе

Полный стек приложения для доставки еды через Telegram WebApp.

## 📁 Структура проекта

```
mama-lena-project/
├── telegram-bot/       # Telegram бот (Node.js)
├── webapp/             # WebApp (React + Vite)
├── backend/            # Backend для email уведомлений (Node.js + Express)
└── supabase/           # SQL скрипты для базы данных
```

## 🚀 Инструкция по установке

### 1. Telegram Bot

```bash
cd telegram-bot
npm install
node bot.js
```

**Настройка:**
- Токен уже указан в `bot.js`
- Для постоянной работы используйте PM2 или запускайте на VPS/хостинге

### 2. Backend (Email сервер)

```bash
cd backend
npm install
node server.js
```

**Важно:**
- Backend должен быть доступен по публичному URL (используйте ngrok для тестирования или deploy на Render/Railway)
- Обновите `VITE_BACKEND_URL` в `webapp/.env` на реальный URL

### 3. Supabase (База данных)

1. Зайдите в Supabase Dashboard: https://supabase.com/dashboard
2. Откройте SQL Editor
3. Выполните файлы по порядку:
   - `supabase/schema.sql` (создание таблиц)
   - `supabase/seed.sql` (наполнение меню)

### 4. WebApp (React приложение)

```bash
cd webapp
npm install
npm run build
```

После билда папка `dist/` будет содержать готовые файлы для загрузки на GitHub Pages.

## 📤 Загрузка на GitHub

### Вариант 1: Через веб-интерфейс GitHub

1. Зайдите в репозиторий: `github.com/prahinstas555-svg/mama-lena-webapp`
2. Удалите все старые файлы из корня (кроме `.github/`)
3. **Add file → Upload files**
4. Загрузите **всё содержимое** папки `webapp/dist/`:
   - `index.html`
   - папку `assets/` (со всеми файлами внутри)
5. Commit changes
6. Зайдите в **Settings → Pages**
7. Убедитесь что:
   - Source: **Deploy from a branch**
   - Branch: **main** / папка: **/ (root)**
8. Сохраните и подождите 2-3 минуты

Сайт будет доступен по адресу: `https://prahinstas555-svg.github.io/mama-lena-webapp/`

### Вариант 2: Через Git (если установлен)

```bash
cd webapp
git init
git remote add origin https://github.com/prahinstas555-svg/mama-lena-webapp.git
git add dist/*
git commit -m "Deploy webapp"
git push -f origin main
```

## ⚙️ Конфигурация

### Файл `.env` (webapp)

```
VITE_SUPABASE_URL=https://xhkgpcomcycdrmhsnxcwi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_BACKEND_URL=https://ваш-backend-url.com
```

### Supabase RLS (Row Level Security)

Если возникают ошибки доступа к базе данных:
1. Зайдите в Supabase → Authentication → Policies
2. Для каждой таблицы добавьте политику "Enable read/write access for all users"

## 📝 Функционал

✅ Каталог блюд по категориям (17 категорий, 100+ блюд)  
✅ Корзина с подсчетом суммы  
✅ Минимальный заказ 800₽  
✅ Чаевые (10%, 15%, 20%)  
✅ Выбор доставки (курьер/самовывоз)  
✅ Выбор оплаты (карта/наличные)  
✅ Регистрация через Telegram ID  
✅ История заказов с составом  
✅ Служба заботы (отзывы → email)  
✅ Email уведомления о заказах на `mamalena.zakazy@gmail.com`

## 🎨 Дизайн

- Цветовая гамма: синий градиент (#4A7FB8, #5B8FC9), красные акценты
- Адаптивный дизайн для мобильных устройств
- Стиль: чистый, современный, в духе farfor.ru

## 🐛 Возможные проблемы

**Ошибка 404 на GitHub Pages:**
- Проверьте что `base: '/mama-lena-webapp/'` в `vite.config.js`
- Убедитесь что файлы загружены в корень репозитория

**Email не отправляются:**
- Проверьте что backend запущен и доступен
- Обновите `VITE_BACKEND_URL` в `.env`

**Заказы не сохраняются:**
- Проверьте выполнение SQL скриптов в Supabase
- Проверьте RLS политики

## 📞 Контакты

Кафе "Мама Лена"  
г. Симферополь, Проспект Кирова 49 В  
Email: mamalena.zakazy@gmail.com

---

Разработано с ❤️ для семейного кафе "Мама Лена"
