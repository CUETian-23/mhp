import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { Brain, LogOut, Menu, User, Settings } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigationItems = isAuthenticated
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Mood Tracker', path: '/mood-tracker' },
        { label: 'Journal', path: '/journal' },
        { label: 'AI Assistant', path: '/ai-assistant' },
        { label: 'Crisis Support', path: '/crisis' },
      ]
    : [];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/')}>
            <Brain size={32} />
            <span>MentalHealth</span>
          </div>
        </div>

        <nav className="header-nav">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="nav-link"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-right">
          {isAuthenticated ? (
            <>
              <div className="user-menu">
                <button className="user-button">
                  <User size={20} />
                  <span>{user?.username}</span>
                </button>
              </div>
              <button onClick={handleLogout} className="btn-icon" title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-text">
                Sign In
              </button>
              <button onClick={() => navigate('/signup')} className="btn-primary">
                Sign Up
              </button>
            </>
          )}
          <button
            className="btn-icon mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className="mobile-nav-link"
            >
              {item.label}
            </button>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="mobile-nav-link"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
