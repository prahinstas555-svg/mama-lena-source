import { Link } from 'react-router-dom';
import { useApp } from '../App';
import './CartPage.css';

function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart, cartTotal } = useApp();

  const MIN_ORDER = 800;
  const canCheckout = cartTotal >= MIN_ORDER;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="page-title">Корзина</h1>
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"/>
          </svg>
          <h3>Корзина пуста</h3>
          <p>Добавьте блюда из меню</p>
          <Link to="/" className="btn btn-primary">
            Перейти к меню
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="page-title">Корзина</h1>
        <button className="clear-button" onClick={clearCart}>
          Очистить
        </button>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.name}</h3>
              {item.weight && (
                <p className="cart-item-weight">{item.weight}</p>
              )}
              <p className="cart-item-price">{item.price} ₽</p>
            </div>
            <div className="cart-item-controls">
              <button
                className="quantity-button"
                onClick={() => removeFromCart(item.id)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5V11H19V13Z"/>
                </svg>
              </button>
              <span className="quantity">{item.quantity}</span>
              <button
                className="quantity-button"
                onClick={() => addToCart(item)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
              </button>
            </div>
            <div className="cart-item-total">
              {item.price * item.quantity} ₽
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Сумма заказа:</span>
          <span className="summary-value">{cartTotal} ₽</span>
        </div>
        {cartTotal < MIN_ORDER && (
          <div className="min-order-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"/>
            </svg>
            <span>Минимальный заказ {MIN_ORDER} ₽</span>
          </div>
        )}
        <Link
          to="/checkout"
          className={`btn btn-primary btn-block ${!canCheckout ? 'disabled' : ''}`}
          onClick={(e) => !canCheckout && e.preventDefault()}
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
