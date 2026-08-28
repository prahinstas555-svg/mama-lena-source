import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import './ProfilePage.css';

function ProfilePage() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const tg = window.Telegram?.WebApp;
      const telegramId = tg?.initDataUnsafe?.user?.id || 0;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('telegram_id', telegramId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { label: 'Ожидает', color: '#FFA726' },
      processing: { label: 'Готовится', color: '#42A5F5' },
      completed: { label: 'Выполнен', color: '#66BB6A' },
      cancelled: { label: 'Отменен', color: '#EF5350' },
    };
    const statusInfo = statuses[status] || statuses.pending;
    return (
      <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h1 className="page-title">Профиль</h1>
        <div className="empty-state">
          <h3>Необходима авторизация</h3>
          <p>Откройте приложение через Telegram бот</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.first_name?.charAt(0) || '?'}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {user.first_name} {user.last_name}
          </h1>
          {user.phone && <p className="profile-phone">{user.phone}</p>}
        </div>
      </div>

      <div className="orders-section">
        <h2 className="section-title">История заказов</h2>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z"/>
            </svg>
            <h3>У вас пока нет заказов</h3>
            <p>Оформите первый заказ в меню</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3 className="order-number">
                      Заказ #{order.id.substring(0, 8)}
                    </h3>
                    <p className="order-date">{formatDate(order.created_at)}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="order-items">
                  <h4>Состав заказа:</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} {item.weight && `(${item.weight})`} — {item.quantity} шт × {item.price} ₽
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-icon">🚚</span>
                    <span>
                      {order.delivery_method === 'delivery' ? 'Доставка' : 'Самовывоз'}
                    </span>
                  </div>
                  {order.address && order.delivery_method === 'delivery' && (
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <span>{order.address}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-icon">💳</span>
                    <span>
                      {order.payment_method === 'card' ? 'Картой' : 'Наличными'}
                    </span>
                  </div>
                </div>

                <div className="order-footer">
                  <span>Сумма заказа:</span>
                  <span className="order-subtotal">{order.subtotal} ₽</span>
                </div>
                {order.tip > 0 && (
                  <div className="order-footer">
                    <span>Чаевые:</span>
                    <span className="order-tip">{order.tip} ₽</span>
                  </div>
                )}
                <div className="order-footer order-total">
                  <span>Итого:</span>
                  <span>{order.total} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
