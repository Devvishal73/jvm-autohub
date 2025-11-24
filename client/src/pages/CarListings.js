import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/CarListings.css';

const CarListings = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`http://localhost:5000/api/cars?${queryParams}`);
      
      const activeCars = response.data.cars.filter(car => !car.isSold);
      
      setCars(activeCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchCars(filters);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: ''
    });
    fetchCars();
  };

  if (loading) {
    return <div className="loading">Loading cars...</div>;
  }

  return (
    <div className="car-listings">
      <div className="container">
        <h1>Browse Our Car Collection</h1>
        
        <form className="filters" onSubmit={handleFilterSubmit}>
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search by make or model..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleFilterChange}
            >
              <option value="">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
            
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChange}
            >
              <option value="">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          
          <div className="filter-buttons">
            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </form>

        <div className="cars-grid">
          {cars.length === 0 ? (
            <div className="no-cars">
              <h3>No cars found matching your criteria</h3>
              <p>Try adjusting your filters or check back later for new listings.</p>
            </div>
          ) : (
            cars.map(car => (
              <div key={car._id} className="car-card">
                <div className="car-image">
                  {car.images && car.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${car.images[0]}`} 
                      alt={`${car.make} ${car.model}`} 
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="car-info">
                  <h3>{car.make} {car.model}</h3>
                  <p className="car-year">{car.year}</p>
                  <p className="car-price">₹{car.price?.toLocaleString()}</p>
                  <div className="car-details">
                    <span>{car.mileage?.toLocaleString()} km</span>
                    <span>{car.fuelType}</span>
                    <span>{car.transmission}</span>
                  </div>
                  <p className="car-location">{car.location}</p>
                  <Link to={`/cars/${car._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CarListings;