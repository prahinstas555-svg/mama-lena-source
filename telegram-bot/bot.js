const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
  ctx.reply(
    '👋 Привет! Я бот кафе *Мама Лена*.\n\nНажми кнопку ниже чтобы открыть меню и сделать заказ 🍽',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🍽 Открыть меню',
              web_app: { url: 'https://mama-lena-source.vercel.app' },
            },
          ],
        ],
      },
    }
  )
})

bot.launch()
console.log('Бот запущен')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
