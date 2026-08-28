import { useState } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import './SupportPage.css';

function SupportPage() {
  const { user } = useApp();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      const tg = window.Telegram?.WebApp;
      const telegramId = tg?.initDataUnsafe?.user?.id || 0;

      // Сохранение в Supabase
      await supabase.from('feedback').insert([
        {
          telegram_id: telegramId,
          user_id: user?.id,
          message: message.trim(),
        },
      ]);

      // Отправка на email
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      await fetch(`${backendUrl}/api/send-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user ? `${user.first_name} ${user.last_name || ''}` : 'Гость',
          message: message.trim(),
          telegramId: telegramId,
        }),
      });

      setSubmitted(true);
      setMessage('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-page">
      <h1 className="page-title">Служба заботы</h1>

      <div className="support-content">
        <div className="support-info">
          <div className="info-card">
            <span className="info-emoji">💬</span>
            <h3>Расскажите нам</h3>
            <p>
              Поделитесь впечатлениями о блюдах, сервисе или оставьте пожелания.
              Мы ценим ваше мнение!
            </p>
          </div>

          <div className="contact-methods">
            <h3>Связаться с нами</h3>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <strong>Телефон</strong>
                <a href="tel:+79780000000">+7 (978) 000-00-00</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Адрес</strong>
                <span>г. Симферополь, Проспект Кирова 49 В</span>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">⏰</span>
              <div>
                <strong>Время работы</strong>
                <span>Ежедневно с 10:00 до 22:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="support-form-wrapper">
          {submitted ? (
            <div className="success-message">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="#66BB6A"
                />
              </svg>
              <h3>Спасибо за обратную связь!</h3>
              <p>Мы обязательно рассмотрим ваше сообщение</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="support-form">
              <h2>Написать нам</h2>
              <div className="form-group">
                <label>Ваше сообщение</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Расскажите о вашем опыте, предложениях или проблемах..."
                  rows="8"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
