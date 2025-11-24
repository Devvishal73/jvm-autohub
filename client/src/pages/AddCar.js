import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AddCar.css';

const AddCar = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    owner: '',
    location: '',
    description: '',
    features: []
  });
  const [images, setImages] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
    setError('');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (images.length === 0) {
      setError('Please upload at least one image of the car');
      setLoading(false);
      return;
    }

    if (!formData.make || !formData.model || !formData.price || !formData.mileage || !formData.owner || !formData.location || !formData.description) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        setError('Please login to add a car');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          formData.features.forEach(feature => {
            formDataToSend.append('features', feature);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post('http://localhost:5000/api/cars', formDataToSend, config);
      
      if (response.data.success) {
        alert('Car listed successfully!');
        navigate('/profile');
      } else {
        setError(response.data.message || 'Failed to add car');
      }
    } catch (error) {
      console.error('Error adding car:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors.map(err => err.msg).join(', ');
        setError(validationErrors);
      } else {
        setError('Failed to add car. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-page">
      <div className="container">
        <h1>Sell Your Car Through JVM AutoHub</h1>
        
        <div className="sell-info">
          <div className="info-card">
            <h3>📞 Platform Contact</h3>
            <p>All communications will be handled through our platform number: <strong>9876543210</strong></p>
          </div>
          <div className="info-card">
            <h3>🛡️ Safe & Secure</h3>
            <p>We ensure secure transactions and handle all buyer communications for you.</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="car-form">
          <div className="form-row">
            <div className="form-group">
              <label>Make *</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                placeholder="e.g., Toyota, Honda, BMW"
              />
            </div>
            
            <div className="form-group">
              <label>Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="e.g., Camry, Civic, X5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1990"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Expected price"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mileage (km) *</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                placeholder="Current mileage"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Fuel Type *</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Transmission *</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange}>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Owner Type *</label>
              <select name="owner" value={formData.owner} onChange={handleChange} required>
                <option value="">Select Owner Type</option>
                <option value="First Owner">First Owner</option>
                <option value="Second Owner">Second Owner</option>
                <option value="Third Owner">Third Owner</option>
                <option value="Fourth Owner+">Fourth Owner+</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Car Images (Max 5) *</label>
            <div className="image-upload">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <div className="upload-area">
                <span>📷 Click to upload images</span>
                <small>Supported formats: JPG, PNG, WebP (Max 5MB each)</small>
                <small>Minimum 1 image required</small>
              </div>
            </div>
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="preview-item">
                  <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(index)}>×</button>
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <small className="error-text">Please upload at least one image</small>
            )}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Describe your car's condition, features, reason for selling, etc."
            />
          </div>

          <div className="form-group">
            <label>Features</label>
            <div className="features-input">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature (e.g., Power Steering, AC, Sunroof)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <button type="button" onClick={addFeature} className="btn btn-secondary">
                Add
              </button>
            </div>
            <div className="features-list">
              {formData.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-note">
            <p>💡 <strong>Note:</strong> After submitting, our team will contact you at <strong>9876543210</strong> to verify details and schedule inspections if needed.</p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
            {loading ? 'Adding Car...' : 'List My Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;