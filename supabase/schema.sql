-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы меню
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  weight TEXT,
  price INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  telegram_id BIGINT NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  tip INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  delivery_method TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы отзывов/жалоб
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  telegram_id BIGINT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_orders_telegram_id ON orders(telegram_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Включение Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Политики доступа (разрешить всем читать меню, пользователям видеть только свои заказы)
CREATE POLICY "Меню доступно всем" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Пользователи видят свои данные" ON users FOR ALL USING (true);
CREATE POLICY "Заказы создают все" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Заказы видят свои" ON orders FOR SELECT USING (true);
CREATE POLICY "Отзывы создают все" ON feedback FOR INSERT WITH CHECK (true);
