import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
        </svg>
        <span>Меню</span>
      </Link>

      <Link to="/cart" className={`nav-item ${isActive('/cart') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
        </svg>
        <span>Корзина</span>
      </Link>

      <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
        <span>Профиль</span>
      </Link>

      <Link to="/support" className={`nav-item ${isActive('/support') ? 'active' : ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM13 14H11V12H13V14ZM13 10H11V6H13V10Z" fill="currentColor"/>
        </svg>
        <span>Служба заботы</span>
      </Link>
    </nav>
  );
}

export default Navigation;
