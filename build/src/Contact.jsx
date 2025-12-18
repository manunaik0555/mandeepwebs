import React from 'react';
import { FaGithub, FaInstagram, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-section">
      <h2 className="contact-heading"> contact us</h2>
      
      <div className="team-container">
        
        {/* --- CARD 1: YOU (Manu) --- */}
        <div className="profile-card">
          <div className="profile-img-box">
             {/* Uses your existing image logic */}
             <img 
               src={process.env.PUBLIC_URL + '/manu.jpg'} 
               onError={(e) => {e.target.onerror = null; e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}} 
               alt="Manu Naik K" 
             />
          </div>
          <h3>Manu Naik K</h3>
          <p className="role"> team lead</p>
          <p className="bio">Full-stack developer passionate about building tools for students.</p>
          
          <div className="social-row">
            <a href="mailto:manunaik0555@outlook.com" className="icon-btn email"><FaEnvelope /></a>
            <a href="https://github.com/manunaik0555" target="_blank" rel="noreferrer" className="icon-btn github"><FaGithub /></a>
            <a href="https://instagram.com/manu_naik_05" target="_blank" rel="noreferrer" className="icon-btn insta"><FaInstagram /></a>
          </div>
        </div>

        {/* --- CARD 2: TEAM MEMBER --- */}
        <div className="profile-card">
          <div className="profile-img-box">
             {/* Placeholder Image for Team Member */}
             <img 
               src={process.env.PUBLIC_URL + '/ven.jpg'} 
               onError={(e) => {e.target.onerror = null; e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}} 
               alt="Manu Naik K" 
             />
          </div>
          <h3>Venkatesh M T</h3>
          <p className="role">UI/UX Designer</p>
          <p className="bio">Creative designer focusing on user experience and interface.</p>
          
          <div className="social-row">
            <a href="mailto:Venkatesh7625d@gmail.com" className="icon-btn email"><FaEnvelope /></a>
            <a href="https://github.com/venkateshmt055/venkateshmt055" target="_blank" rel="noreferrer" className="icon-btn github"><FaGithub /></a>
            <a href="https://instagram.com/appu_venkatesh_s" target="_blank" rel="noreferrer" className="icon-btn insta"><FaInstagram /></a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;