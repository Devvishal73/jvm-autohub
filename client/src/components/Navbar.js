import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      setUser(userInfo);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      checkUserLogin();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeDropdown}>
          🚗 JVM AutoHub
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeDropdown}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/cars" 
              className={`nav-link ${location.pathname === '/cars' ? 'active' : ''}`}
              onClick={closeDropdown}
            >
              Browse Cars
            </Link>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <Link 
                  to="/add-car" 
                  className={`nav-link ${location.pathname === '/add-car' ? 'active' : ''}`}
                  onClick={closeDropdown}
                >
                  Sell Your Car
                </Link>
              </li>
              
              <li className="nav-item profile-item">
                <div className="profile-container">
                  <button 
                    className="profile-btn"
                    onClick={toggleDropdown}
                  >
                    <span className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="user-name">{user.name.split(' ')[0]}</span>
                    <span className={`dropdown-arrow ${showDropdown ? 'rotate' : ''}`}>▼</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={closeDropdown}
                      >
                        👤 Profile Dashboard
                      </Link>
                      <Link 
                        to="/my-cars" 
                        className="dropdown-item"
                        onClick={closeDropdown}
                      >
                        🚗 My Listings
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        onClick={handleLogout}
                        className="dropdown-item logout"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link 
                  to="/login" 
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  onClick={closeDropdown}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/register" 
                  className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                  onClick={closeDropdown}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;