import React from 'react';
import '../styles/ContactModal.css';

const ContactModal = ({ isOpen, onClose, carDetails }) => {
  const platformNumber = '9524244849';

  const handleCall = () => {
    window.open(`tel:${platformNumber}`, '_self');
  };

  const handleAddToContacts = () => {
    alert(`Add ${platformNumber} to your contacts as JVM AutoHub`);
  };

  const handleWhatsApp = () => {
    const message = `Hello, I'm interested in the ${carDetails?.make} ${carDetails?.model} (${carDetails?.year}) listed on JVM AutoHub.`;
    window.open(`https://wa.me/${platformNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Contact JVM AutoHub</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="contact-info">
            <div className="platform-number">
              <span className="number-label">Platform Contact Number:</span>
              <span className="number-value">{platformNumber}</span>
            </div>
            
            {carDetails && (
              <div className="car-info">
                <p>Regarding: <strong>{carDetails.make} {carDetails.model} ({carDetails.year})</strong></p>
                <p>Price: <strong>₹{carDetails.price?.toLocaleString()}</strong></p>
              </div>
            )}
            
            <div className="contact-options">
              <button className="contact-btn call-btn" onClick={handleCall}>
                📞 Call Now
              </button>
              <button className="contact-btn whatsapp-btn" onClick={handleWhatsApp}>
                💬 WhatsApp
              </button>
              <button className="contact-btn contact-btn" onClick={handleAddToContacts}>
                👤 Add to Contacts
              </button>
            </div>
            
            <div className="contact-note">
              <p>💡 <strong>Note:</strong> All communications are handled through our platform number for your safety and convenience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;