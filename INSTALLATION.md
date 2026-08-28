# 📋 ПОШАГОВАЯ ИНСТРУКЦИЯ ПО ЗАГРУЗКЕ НА GITHUB

## Шаг 1: Очистка старого репозитория

1. Зайдите на https://github.com/prahinstas555-svg/mama-lena-webapp
2. Нажмите на каждый файл/папку в корне (кроме `.github/` если есть) → три точки → Delete file
3. Подтвердите удаление

**Или быстрее:**
- Зайдите в Settings → внизу страницы "Danger Zone" → Delete this repository
- Создайте новый репозиторий с тем же именем `mama-lena-webapp`

---

## Шаг 2: Загрузка файлов WebApp

1. На главной странице пустого репозитория нажмите **Add file → Upload files**

2. Откройте на компьютере папку:
   ```
   C:\Users\Azerty\Desktop\newwebappcafe\mama-lena-webapp\
   ```

3. Перейдите в папку `dist\` (не саму папку, а внутрь неё)

4. Выделите **ВСЁ** внутри dist:
   - `index.html`
   - папка `assets\` (со всеми файлами внутри)

5. Перетащите в окно GitHub Upload files

6. Внизу напишите commit message: "Initial commit"

7. Нажмите **Commit changes**

---

## Шаг 3: Настройка GitHub Pages

1. Зайдите в **Settings** (вверху справа)

2. В левом меню найдите **Pages**

3. В разделе "Build and deployment" выберите:
   - Source: **Deploy from a branch**
   - Branch: **main** (или master)
   - Folder: **/ (root)**

4. Нажмите **Save**

5. Подождите 2-3 минуты

6. Обновите страницу — вверху появится ссылка:
   ```
   Your site is live at https://prahinstas555-svg.github.io/mama-lena-webapp/
   ```

7. Откройте эту ссылку и проверьте что сайт работает

---

## Шаг 4: Запуск Backend (для email уведомлений)

Backend нужно развернуть на сервере. Два варианта:

### Вариант A: Render.com (бесплатно)

1. Зайдите на https://render.com и зарегистрируйтесь
2. New → Web Service
3. Подключите GitHub или загрузите файлы вручную
4. Настройки:
   - Name: `mama-lena-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Deploy
6. Скопируйте URL (например, `https://mama-lena-backend.onrender.com`)
7. Обновите `.env` в webapp:
   ```
   VITE_BACKEND_URL=https://mama-lena-backend.onrender.com
   ```
8. Пересоберите webapp и загрузите снова на GitHub

### Вариант B: Локальный компьютер (только для тестов)

1. Откройте PowerShell
2. Перейдите в папку backend:
   ```powershell
   cd C:\Users\Azerty\Desktop\newwebappcafe\mama-lena-webapp\backend
   npm install
   node server.js
   ```
3. Оставьте окно открытым — сервер работает на `http://localhost:3001`

**Важно:** При закрытии окна email перестанут работать!

---

## Шаг 5: Настройка Supabase

1. Зайдите в https://supabase.com/dashboard
2. Откройте ваш проект
3. В левом меню: **SQL Editor**
4. Нажмите **New query**
5. Скопируйте содержимое файла `supabase/schema.sql` и выполните
6. Снова **New query** → скопируйте `supabase/seed.sql` и выполните
7. Зайдите в **Table Editor** — должны появиться таблицы:
   - users
   - menu_items (с блюдами)
   - orders
   - feedback

---

## Шаг 6: Запуск Telegram бота

### На компьютере (для тестов):

```powershell
cd C:\Users\Azerty\Desktop\newwebappcafe\mama-lena-webapp\telegram-bot
npm install
node bot.js
```

Оставьте окно открытым.

### На сервере (постоянная работа):

Используйте тот же Render.com:
1. New → Web Service
2. Загрузите папку `telegram-bot`
3. Start Command: `node bot.js`

---

## ✅ Проверка работоспособности

1. Откройте Telegram
2. Найдите вашего бота
3. Напишите `/start`
4. Нажмите "🍽 Открыть меню"
5. Должен открыться сайт с меню
6. Добавьте блюда в корзину
7. Оформите тестовый заказ
8. Проверьте почту `mamalena.zakazy@gmail.com` — должно прийти письмо

---

## 🐛 Если что-то не работает

**Сайт показывает 404:**
- Проверьте что файлы в корне репозитория (не в папке dist)
- Settings → Pages → папка должна быть `/ (root)`

**Меню не загружается:**
- Проверьте что SQL скрипты выполнены в Supabase
- Table Editor → menu_items → должны быть блюда

**Email не приходят:**
- Backend должен быть запущен и доступен
- Проверьте URL в `.env`

**Заказы не сохраняются:**
- Проверьте Supabase → Authentication → Policies
- Добавьте политики "Enable access for all users" для всех таблиц

---

## 📦 Содержимое архива

```
mama-lena-project/
├── telegram-bot/          # Telegram бот
│   ├── bot.js
│   └── package.json
├── webapp/                # React приложение
│   ├── src/               # Исходный код
│   ├── dist/              # ← ЗАГРУЖАТЬ НА GITHUB
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/               # Email сервер
│   ├── server.js
│   └── package.json
├── supabase/              # SQL скрипты
│   ├── schema.sql
│   └── seed.sql
└── README.md              # Документация
```

---

Удачи! 🚀
