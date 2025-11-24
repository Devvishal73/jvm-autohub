import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userCars, setUserCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cars');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, [navigate]);

  const checkAuthentication = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      navigate('/login?redirect=profile');
      return;
    }
    setUser(userInfo);
    fetchUserCars(userInfo.token);
  };

  const fetchUserCars = async (token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get('http://localhost:5000/api/cars/my/listings', config);
      setUserCars(response.data.cars || []);
    } catch (error) {
      console.error('Error fetching user cars:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login?redirect=profile');
        return;
      }
      setUserCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  const markAsSold = async (carId) => {
    if (!window.confirm('Are you sure you want to mark this car as sold?')) {
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const response = await axios.patch(`http://localhost:5000/api/cars/${carId}/sold`, {}, config);
      setMessage('Car marked as sold successfully!');
      fetchUserCars(userInfo.token);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error marking car as sold:', error);
      setMessage('Failed to mark car as sold. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const markAsAvailable = async (carId) => {
    if (!window.confirm('Are you sure you want to mark this car as available?')) {
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const response = await axios.patch(`http://localhost:5000/api/cars/${carId}/available`, {}, config);
      setMessage('Car marked as available successfully!');
      fetchUserCars(userInfo.token);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error marking car as available:', error);
      setMessage('Failed to mark car as available. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car listing?')) {
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      await axios.delete(`http://localhost:5000/api/cars/${carId}`, config);
      setMessage('Car listing deleted successfully!');
      fetchUserCars(userInfo.token);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting car:', error);
      setMessage('Failed to delete car listing. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="login-required">
            <div className="auth-icon">🔒</div>
            <h2>Authentication Required</h2>
            <p>Please log in to access your profile dashboard and manage your car listings.</p>
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary">
                📱 Login Now
              </Link>
              <Link to="/register" className="btn btn-secondary">
                👤 Create Account
              </Link>
            </div>
            <div className="auth-features">
              <h4>With your account you can:</h4>
              <ul>
                <li>🚗 List your cars for sale</li>
                <li>📊 Track your listings</li>
                <li>💼 Manage your profile</li>
                <li>📞 Contact buyers securely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const soldCars = userCars.filter(car => car.isSold);
  const activeCars = userCars.filter(car => !car.isSold);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>Welcome back, {user.name}!</h1>
            <p className="profile-email">📧 {user.email}</p>
            <p className="profile-phone">📱 {user.phone}</p>
            <div className="listing-stats">
              <span className="stat active">{activeCars.length} Active</span>
              <span className="stat sold">{soldCars.length} Sold</span>
              <span className="stat total">{userCars.length} Total</span>
            </div>
          </div>
          <div className="profile-actions">
            <Link to="/add-car" className="btn btn-primary">
              🚗 Add New Car
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary">
              🚪 Logout
            </button>
          </div>
        </div>

        {message && (
          <div className="message-banner success">
            {message}
          </div>
        )}

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            🚗 My Car Listings ({userCars.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Information
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'cars' && (
            <div className="my-cars">
              <div className="section-header">
                <h3>🚗 My Car Listings</h3>
                <Link to="/add-car" className="btn btn-primary">
                  + Add New Car
                </Link>
              </div>
              
              {userCars.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🚗</div>
                  <h4>No Cars Listed Yet</h4>
                  <p>Start selling your cars by listing them on JVM AutoHub</p>
                  <Link to="/add-car" className="btn btn-primary">
                    List Your First Car
                  </Link>
                </div>
              ) : (
                <div className="cars-management">
                  <div className="cars-filter">
                    <button 
                      className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveTab('cars')}
                    >
                      All ({userCars.length})
                    </button>
                    <button 
                      className={`filter-btn ${activeTab === 'active' ? 'active' : ''}`}
                      onClick={() => {
                        const activeCars = userCars.filter(car => !car.isSold);
                        setUserCars(activeCars);
                        setActiveTab('active');
                      }}
                    >
                      Active ({activeCars.length})
                    </button>
                    <button 
                      className={`filter-btn ${activeTab === 'sold' ? 'active' : ''}`}
                      onClick={() => {
                        const soldCars = userCars.filter(car => car.isSold);
                        setUserCars(soldCars);
                        setActiveTab('sold');
                      }}
                    >
                      Sold ({soldCars.length})
                    </button>
                  </div>
                  
                  <div className="cars-list">
                    {userCars.map(car => (
                      <div key={car._id} className={`car-item ${car.isSold ? 'sold' : ''}`}>
                        <div className="car-image">
                          {car.images && car.images.length > 0 ? (
                            <img 
                              src={`http://localhost:5000${car.images[0]}`} 
                              alt={`${car.make} ${car.model}`} 
                            />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                          {car.isSold && <div className="sold-overlay">SOLD</div>}
                        </div>
                        <div className="car-details">
                          <h4>{car.make} {car.model} ({car.year})</h4>
                          <p className="car-price">₹{car.price?.toLocaleString()}</p>
                          <div className="car-meta">
                            <span>📏 {car.mileage?.toLocaleString()} km</span>
                            <span>⛽ {car.fuelType}</span>
                            <span>⚙️ {car.transmission}</span>
                          </div>
                          <p className="car-location">📍 {car.location}</p>
                          <p className="car-status">
                            Status: <span className={car.isSold ? 'status-sold' : 'status-active'}>
                              {car.isSold ? '✅ Sold' : '🟢 Active'}
                            </span>
                            {car.isSold && car.soldAt && (
                              <span className="sold-date">
                                on {new Date(car.soldAt).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="car-actions">
                          <Link to={`/cars/${car._id}`} className="btn btn-outline">
                            👁️ View
                          </Link>
                          {!car.isSold ? (
                            <button 
                              className="btn btn-success"
                              onClick={() => markAsSold(car._id)}
                            >
                              ✅ Mark as Sold
                            </button>
                          ) : (
                            <button 
                              className="btn btn-warning"
                              onClick={() => markAsAvailable(car._id)}
                            >
                              🔄 Mark Available
                            </button>
                          )}
                          <button 
                            className="btn btn-danger"
                            onClick={() => deleteCar(car._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-details">
              <div className="section-card">
                <h3>👤 Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <div className="info-value">{user.name}</div>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <div className="info-value">{user.email}</div>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <div className="info-value">{user.phone}</div>
                  </div>
                  <div className="info-item">
                    <label>Account Type</label>
                    <div className="info-value">
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <div className="info-value">{new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                  </div>
                </div>
              </div>
              
              <div className="section-card">
                <h3>📈 Listing Summary</h3>
                <div className="stats-grid">
                  <div className="stat-card primary">
                    <div className="stat-number">{userCars.length}</div>
                    <div className="stat-label">Total Listings</div>
                  </div>
                  <div className="stat-card success">
                    <div className="stat-number">{activeCars.length}</div>
                    <div className="stat-label">Active Listings</div>
                  </div>
                  <div className="stat-card warning">
                    <div className="stat-number">{soldCars.length}</div>
                    <div className="stat-label">Cars Sold</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;