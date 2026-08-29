import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { orderData } = req.body

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
      subject: `Новый заказ — ${orderData.name}`,
      html: `
        <h2>Новый заказ</h2>
        <p><b>Имя:</b> ${orderData.name}</p>
        <p><b>Телефон:</b> ${orderData.phone}</p>
        <p><b>Адрес:</b> ${orderData.address}</p>
        <p><b>Заказ:</b><br>${orderData.items}</p>
        <p><b>Итого:</b> ${orderData.total} ₽</p>
      `,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
