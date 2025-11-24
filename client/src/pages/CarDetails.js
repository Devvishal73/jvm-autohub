import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ContactModal from '../components/ContactModal';
import '../styles/CarDetails.css';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      setError('Car not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading car details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!car) return <div className="error">Car not found</div>;

  return (
    <div className="car-details-page">
      <div className="container">
        <Link to="/cars" className="back-link">← Back to Cars</Link>
        
        <div className="car-details">
          <div className="car-images">
            <div className="main-image">
              {car.images && car.images.length > 0 ? (
                <img 
                  src={`http://localhost:5000${car.images[selectedImage]}`} 
                  alt={`${car.make} ${car.model}`} 
                />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            {car.images && car.images.length > 1 && (
              <div className="image-thumbnails">
                {car.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${image}`}
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="car-info">
            <h1>{car.make} {car.model}</h1>
            <p className="car-year">{car.year}</p>
            <p className="car-price">₹{car.price.toLocaleString()}</p>
            
            <div className="car-specs">
              <div className="spec">
                <strong>Mileage:</strong>
                <span>{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="spec">
                <strong>Fuel Type:</strong>
                <span>{car.fuelType}</span>
              </div>
              <div className="spec">
                <strong>Transmission:</strong>
                <span>{car.transmission}</span>
              </div>
              <div className="spec">
                <strong>Owner:</strong>
                <span>{car.owner}</span>
              </div>
              <div className="spec">
                <strong>Location:</strong>
                <span>{car.location}</span>
              </div>
            </div>
            
            <div className="contact-info">
              <h3>Contact JVM AutoHub</h3>
              <p><strong>Platform Number:</strong> {car.contact}</p>
              <p className="contact-note">All communications are handled through our platform for your safety</p>
            </div>
            
            <button 
              className="btn btn-primary contact-btn"
              onClick={() => setShowContactModal(true)}
            >
              📞 Contact About This Car
            </button>
            
            <div className="description">
              <h3>Description</h3>
              <p>{car.description}</p>
            </div>
            
            {car.features && car.features.length > 0 && (
              <div className="features">
                <h3>Features</h3>
                <ul>
                  {car.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        carDetails={car}
      />
    </div>
  );
};

export default CarDetails;