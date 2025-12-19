// src/CookieConsent.js
import React, { useState, useEffect } from 'react';
import './CookieConsent.css';
import { FaCookieBite } from 'react-icons/fa';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem("site_cookie_consent");
    if (!consent) {
      // If no choice saved, show the banner after a 1-second delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    // Save "true" to local storage so the popup never comes back
    localStorage.setItem("site_cookie_consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Save "false" (or just close it for this session)
    localStorage.setItem("site_cookie_consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <FaCookieBite className="cookie-icon" />
        <p>
          We use cookies to enhance your experience and serve educational content. 
          By continuing to visit this site you agree to our use of cookies.
        </p>
      </div>
      <div className="cookie-actions">
        <button onClick={handleDecline} className="btn-decline">Decline</button>
        <button onClick={handleAccept} className="btn-accept">Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;