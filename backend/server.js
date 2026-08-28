const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mamalena.zakazy@gmail.com',
    pass: 'bhdd zful uwct vzrb',
  },
});

// Отправка уведомления о заказе
app.post('/api/send-order', async (req, res) => {
  try {
    const { orderData } = req.body;

    const itemsList = orderData.items
      .map(
        (item) =>
          `• ${item.name} (${item.weight}) — ${item.quantity} шт × ${item.price} ₽ = ${
            item.quantity * item.price
          } ₽`
      )
      .join('\n');

    const mailOptions = {
      from: 'mamalena.zakazy@gmail.com',
      to: 'mamalena.zakazy@gmail.com',
      subject: `Новый заказ №${orderData.orderId} от ${orderData.customerName}`,
      text: `
НОВЫЙ ЗАКАЗ

Номер заказа: ${orderData.orderId}
Дата: ${new Date(orderData.createdAt).toLocaleString('ru-RU')}

КЛИЕНТ:
Имя: ${orderData.customerName}
Телефон: ${orderData.phone}

ДОСТАВКА:
Способ: ${orderData.deliveryMethod === 'delivery' ? 'Курьер' : 'Самовывоз'}
Адрес: ${orderData.address || 'г. Симферополь, Проспект Кирова 49 В'}

ОПЛАТА:
${orderData.paymentMethod === 'card' ? 'Картой курьеру' : 'Наличными'}

ЗАКАЗ:
${itemsList}

Промежуточная сумма: ${orderData.subtotal} ₽
Чаевые: ${orderData.tip} ₽
ИТОГО: ${orderData.total} ₽

---
Кафе "Мама Лена"
`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email отправлен' });
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Отправка обратной связи
app.post('/api/send-feedback', async (req, res) => {
  try {
    const { name, message, telegramId } = req.body;

    const mailOptions = {
      from: 'mamalena.zakazy@gmail.com',
      to: 'mamalena.zakazy@gmail.com',
      subject: `Служба заботы: новое сообщение от ${name}`,
      text: `
ОБРАТНАЯ СВЯЗЬ

От: ${name}
Telegram ID: ${telegramId}
Дата: ${new Date().toLocaleString('ru-RU')}

Сообщение:
${message}

---
Кафе "Мама Лена"
`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Сообщение отправлено' });
  } catch (error) {
    console.error('Ошибка отправки feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend сервер запущен на порту ${PORT}`);
});
