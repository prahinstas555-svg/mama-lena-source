const TelegramBot = require('node-telegram-bot-api');

const token = '8917479582:AAEERHvKjeaYbh1KNHKpQP5MyA0ZWn1kdfU';
const webAppUrl = 'https://prahinstas555-svg.github.io/mama-lena-webapp/';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Гость';

  bot.sendMessage(
    chatId,
    `Добро пожаловать в кафе "Мама Лена", ${firstName}! 🍽\n\n` +
    `Семейное кафе в самом сердце Симферополя.\n` +
    `Нажмите кнопку ниже, чтобы открыть меню и сделать заказ.`,
    {
      reply_markup: {
        keyboard: [
          [{ text: '🍽 Открыть меню', web_app: { url: webAppUrl } }],
          ['ℹ️ О нас', '📍 Адрес'],
        ],
        resize_keyboard: true,
      },
    }
  );
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'ℹ️ О нас') {
    bot.sendMessage(
      chatId,
      `🏡 *Семейное кафе "Мама Лена"*\n\n` +
      `Расположившись в одном из самых очаровательных парков Симферополя, ` +
      `в экологически чистом районе, «Мама Lena» способна стать логичным завершением ` +
      `приятной прогулки для всей вашей семьи.\n\n` +
      `Дети, накатавшись на аттракционах, точно обрадуются оригинальным авторским десертам или ` +
      `освежающим лимонадам, а их родители вряд ли смогут устоять перед нашей фирменной ` +
      `самой вкусной в городе пиццей!\n\n` +
      `Здесь вы почувствуете атмосферу домашнего уюта и поймете, что лучшего места ` +
      `для проведения семейных праздников и детских дней рождений вам просто не найти.`,
      { parse_mode: 'Markdown' }
    );
  }

  if (text === '📍 Адрес') {
    bot.sendMessage(
      chatId,
      `📍 *Наш адрес:*\n\nг. Симферополь, Проспект Кирова 49 В`,
      { parse_mode: 'Markdown' }
    );
    bot.sendLocation(chatId, 44.948237, 34.100318);
  }
});

bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = JSON.parse(msg.web_app_data.data);

  if (data.type === 'order') {
    bot.sendMessage(
      chatId,
      `✅ Ваш заказ №${data.orderId} принят!\n\n` +
      `Сумма: ${data.total} ₽\n` +
      `Доставка: ${data.delivery}\n\n` +
      `Мы свяжемся с вами в ближайшее время.`
    );
  }
});

console.log('Telegram bot запущен...');
