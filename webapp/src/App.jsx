import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import './App.css';

// Контекст для корзины и пользователя
export const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#4A7FB8');
      tg.setBackgroundColor('#F7F5F1');

      // Получаем данные пользователя из Telegram
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        initUser(tgUser);
      }
    }
  }, []);

  // Инициализация пользователя в базе
  const initUser = async (tgUser) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', tgUser.id)
        .single();

      if (existingUser) {
        setUser(existingUser);
      } else {
        const { data: newUser } = await supabase
          .from('users')
          .insert([
            {
              telegram_id: tgUser.id,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name,
            },
          ])
          .select()
          .single();
        setUser(newUser);
      }
    } catch (error) {
      console.error('Ошибка инициализации пользователя:', error);
    }
  };

  // Загрузка меню из Supabase
  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Ошибка загрузки меню:', error);
    } finally {
      setLoading(false);
    }
  };

  // Добавление в корзину
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Удаление из корзины
  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  // Очистка корзины
  const clearCart = () => {
    setCart([]);
  };

  // Подсчет общей суммы
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const contextValue = {
    user,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    menuItems,
    loading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </AppContext.Provider>
  );
}

export default App;

// Хук для использования контекста
export const useApp = () => useContext(AppContext);
