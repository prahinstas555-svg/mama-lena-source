import { Link } from 'react-router-dom';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Завтраки', emoji: '🍳', color: '#FFE5B4' },
  { name: 'Холодные закуски', emoji: '🥗', color: '#E3F2FD' },
  { name: 'Горячие закуски', emoji: '🔥', color: '#FFEBEE' },
  { name: 'Салаты', emoji: '🥬', color: '#E8F5E9' },
  { name: 'Первые блюда', emoji: '🍲', color: '#FFF3E0' },
  { name: 'Сковородки', emoji: '🍳', color: '#F3E5F5' },
  { name: 'Гарниры', emoji: '🥔', color: '#FFF8E1' },
  { name: 'Пасты', emoji: '🍝', color: '#FCE4EC' },
  { name: 'Боулы', emoji: '🥙', color: '#E0F2F1' },
  { name: 'Основные блюда', emoji: '🍖', color: '#FFECB3' },
  { name: 'Десерты', emoji: '🍰', color: '#F8BBD0' },
  { name: 'Мангал', emoji: '🍢', color: '#FFCCBC' },
  { name: 'Пицца', emoji: '🍕', color: '#FFE0B2' },
  { name: 'Бургеры', emoji: '🍔', color: '#FFCCBC' },
  { name: 'Детское меню', emoji: '👶', color: '#F0F4C3' },
  { name: 'Банкетные блюда', emoji: '🎉', color: '#E1BEE7' },
  { name: 'Акции!', emoji: '🔥', color: '#FFCDD2' },
];

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Семейное кафе «Мама Lena»</h1>
          <p className="hero-subtitle">
            Расположившись в одном из самых очаровательных парков Симферополя,
            в экологически чистом районе, «Мама Lena» способна стать логичным
            завершением приятной прогулки для всей вашей семьи.
          </p>
          <div className="hero-info">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span>г. Симферополь, Проспект Кирова 49 В</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🚚</span>
              <span>Доставка по Симферополю</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <span>Минимальный заказ от 800₽</span>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2 className="section-title">Меню</h2>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="category-card"
              style={{ backgroundColor: category.color }}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about">
        <div className="about-content">
          <h2 className="section-title">О нас</h2>
          <p>
            Дети, накатавшись на аттракционах, точно обрадуются оригинальным
            авторским десертам или освежающим лимонадам, а их родители вряд ли
            смогут устоять перед нашей фирменной самой вкусной в городе пиццей!
          </p>
          <p>
            Здесь вы почувствуете атмосферу домашнего уюта и поймете, что
            лучшего места для проведения семейных праздников и детских дней
            рождений вам просто не найти.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
