import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          <span className="nav__brand-mark">CP</span>
          <span className="nav__brand-text">
            Civic<span className="nav__brand-accent">Pulse</span>
          </span>
        </Link>

        <nav className="nav__links">
          <Link to="/feed" className={isActive('/feed') ? 'nav__link nav__link--active' : 'nav__link'}>
            Feed
          </Link>
          <Link to="/map" className={isActive('/map') ? 'nav__link nav__link--active' : 'nav__link'}>
            Map
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'nav__link nav__link--active' : 'nav__link'}>
            Dashboard
          </Link>
        </nav>

        <div className="nav__actions">
          <ThemeToggle />
          {user ? (
            <>
              <button className="nav__report-btn" onClick={() => navigate('/report')}>
                + Report Issue
              </button>
              <div className="nav__user" title={user.email}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="nav__avatar nav__avatar--photo" />
                ) : (
                  <span className="nav__avatar" style={{ background: user.avatarColor }}>
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="nav__points">{user.points} pts</span>
              </div>
              <button className="nav__logout" onClick={() => { logout(); navigate('/'); }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__login">Sign in</Link>
              <Link to="/register" className="nav__report-btn">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
