import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to JVM AutoHub</h1>
          <p>Your trusted partner for pre-owned cars</p>
          <div className="hero-buttons">
            <Link to="/cars" className="btn btn-primary">
              Browse Cars
            </Link>
            <Link to="/add-car" className="btn btn-secondary">
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose JVM AutoHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Quality Checked</h3>
              <p>All vehicles undergo thorough inspection and verification</p>
            </div>
            <div className="feature-card">
              <h3>Best Prices</h3>
              <p>Competitive pricing with transparent deals</p>
            </div>
            <div className="feature-card">
              <h3>Wide Selection</h3>
              <p>Various makes and models to choose from</p>
            </div>
            <div className="feature-card">
              <h3>Easy Process</h3>
              <p>Simple and hassle-free buying experience</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <h3>500+</h3>
              <p>Cars Sold</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Brands Available</p>
            </div>
            <div className="stat">
              <h3>98%</h3>
              <p>Customer Satisfaction</p>
            </div>
            <div className="stat">
              <h3>5+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;