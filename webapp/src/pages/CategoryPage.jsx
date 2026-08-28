import { useParams, Link } from 'react-router-dom';
import { useApp } from '../App';
import './CategoryPage.css';

function CategoryPage() {
  const { categoryName } = useParams();
  const { menuItems, addToCart, loading } = useApp();

  const decodedCategory = decodeURIComponent(categoryName);
  const items = menuItems.filter((item) => item.category === decodedCategory);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <Link to="/" className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
        </Link>
        <h1 className="category-title">{decodedCategory}</h1>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Скоро здесь появятся блюда</h3>
          <p>Мы работаем над наполнением этой категории</p>
        </div>
      ) : (
        <div className="menu-items">
          {items.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="item-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <div className="image-placeholder">
                    <span>🍽</span>
                  </div>
                )}
              </div>
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                {item.weight && (
                  <p className="item-weight">{item.weight}</p>
                )}
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
                <div className="item-footer">
                  <span className="item-price">{item.price} ₽</span>
                  <button
                    className="add-button"
                    onClick={() => addToCart(item)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
