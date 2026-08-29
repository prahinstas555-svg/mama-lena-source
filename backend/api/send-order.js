const nodemailer = require('nodemailer')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { orderData } = req.body

  // Форматируем список блюд
  const itemsList = Array.isArray(orderData.items)
    ? orderData.items
        .map(item => `• ${item.name} × ${item.quantity} — ${item.price * item.quantity} ₽`)
        .join('<br>')
    : String(orderData.items)

  const deliveryLabel = orderData.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Курьер'
  const paymentLabel = orderData.paymentMethod === 'cash' ? 'Наличными' : 'Картой курьеру'

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Новый заказ #${orderData.orderId} — ${orderData.customerName}`,
      html: `
        <h2>Новый заказ #${orderData.orderId}</h2>
        <p><b>Имя:</b> ${orderData.customerName}</p>
        <p><b>Телефон:</b> ${orderData.phone}</p>
        <p><b>Адрес:</b> ${orderData.address}</p>
        <p><b>Доставка:</b> ${deliveryLabel}</p>
        <p><b>Оплата:</b> ${paymentLabel}</p>
        <hr>
        <p><b>Состав заказа:</b><br>${itemsList}</p>
        <hr>
        <p><b>Сумма:</b> ${orderData.subtotal} ₽</p>
        ${orderData.tip > 0 ? `<p><b>Чаевые:</b> ${orderData.tip} ₽</p>` : ''}
        <p><b>Итого:</b> ${orderData.total} ₽</p>
      `,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
