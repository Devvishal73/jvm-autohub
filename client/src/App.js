import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarListings from './pages/CarListings';
import CarDetails from './pages/CarDetails';
import AddCar from './pages/AddCar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarListings />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/add-car" element={<AddCar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-cars" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;