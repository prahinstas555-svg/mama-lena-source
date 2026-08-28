import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, user } = useApp();

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    address: '',
    deliveryMethod: 'delivery',
    paymentMethod: 'card',
  });

  const [tip, setTip] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tipOptions = [
    { label: '10%', value: Math.round(cartTotal * 0.1) },
    { label: '15%', value: Math.round(cartTotal * 0.15) },
    { label: '20%', value: Math.round(cartTotal * 0.2) },
  ];

  const total = cartTotal + tip;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tg = window.Telegram?.WebApp;
      const telegramId = tg?.initDataUnsafe?.user?.id || 0;

      // Сохранение заказа в Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .insert([
          {
            telegram_id: telegramId,
            user_id: user?.id,
            items: cart,
            subtotal: cartTotal,
            tip: tip,
            total: total,
            delivery_method: formData.deliveryMethod,
            payment_method: formData.paymentMethod,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: formData.address || 'г. Симферополь, Проспект Кирова 49 В',
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Отправка email уведомления
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      await fetch(`${backendUrl}/api/send-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData: {
            orderId: order.id.substring(0, 8),
            createdAt: order.created_at,
            customerName: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: formData.address || 'г. Симферополь, Проспект Кирова 49 В',
            deliveryMethod: formData.deliveryMethod,
            paymentMethod: formData.paymentMethod,
            items: cart,
            subtotal: cartTotal,
            tip: tip,
            total: total,
          },
        }),
      });

      // Отправка данных боту (опционально)
      if (tg) {
        tg.sendData(
          JSON.stringify({
            type: 'order',
            orderId: order.id.substring(0, 8),
            total: total,
            delivery: formData.deliveryMethod === 'delivery' ? 'Курьер' : 'Самовывоз',
          })
        );
      }

      clearCart();
      alert('✅ Ваш заказ принят! Мы свяжемся с вами в ближайшее время.');
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      alert('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Оформление заказа</h1>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h2 className="section-title">Контактные данные</h2>
          <div className="form-group">
            <label>Имя *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Ваше имя"
            />
          </div>
          <div className="form-group">
            <label>Фамилия *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Ваша фамилия"
            />
          </div>
          <div className="form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+7 (___) ___-__-__"
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Способ получения</h2>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={formData.deliveryMethod === 'delivery'}
                onChange={handleChange}
              />
              <span className="radio-label">
                <span className="radio-icon">🚚</span>
                <span>
                  <strong>Курьер</strong>
                  <small>Доставка по Симферополю</small>
                </span>
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={formData.deliveryMethod === 'pickup'}
                onChange={handleChange}
              />
              <span className="radio-label">
                <span className="radio-icon">🏪</span>
                <span>
                  <strong>Самовывоз</strong>
                  <small>Проспект Кирова 49 В</small>
                </span>
              </span>
            </label>
          </div>
        </div>

        {formData.deliveryMethod === 'delivery' && (
          <div className="form-section">
            <h2 className="section-title">Адрес доставки</h2>
            <div className="form-group">
              <label>Адрес *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Улица, дом, квартира"
              />
            </div>
          </div>
        )}

        <div className="form-section">
          <h2 className="section-title">Способ оплаты</h2>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
              />
              <span className="radio-label">
                <span className="radio-icon">💳</span>
                <span>Картой курьеру</span>
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange}
              />
              <span className="radio-label">
                <span className="radio-icon">💵</span>
                <span>Наличными</span>
              </span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Чаевые</h2>
          <p className="section-description">Спасибо за поддержку нашей команды!</p>
          <div className="tip-options">
            {tipOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`tip-button ${tip === option.value ? 'active' : ''}`}
                onClick={() => setTip(option.value)}
              >
                {option.label}
                <small>{option.value} ₽</small>
              </button>
            ))}
            <button
              type="button"
              className={`tip-button ${tip === 0 ? 'active' : ''}`}
              onClick={() => setTip(0)}
            >
              Без чаевых
            </button>
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Сумма заказа:</span>
            <span>{cartTotal} ₽</span>
          </div>
          {tip > 0 && (
            <div className="summary-row">
              <span>Чаевые:</span>
              <span>{tip} ₽</span>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Итого:</span>
            <span>{total} ₽</span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
