import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { store } from './App';
import './nav.css';

const Nav = () => {
  const [token] = useContext(store);
  const location = useLocation();
  const isLoginOrRegisterPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      <div className="nav-bar">
        <div className="navlinks">
          {!token ? (
            <>
              <Link className="navlink" to="/register">Register</Link>
              <Link className="navlink" to="/login">Login</Link>
            </>
          ) : null}
        </div>
      </div>

      {!token && !isLoginOrRegisterPage && (
        <div className="content-container">
          <h2 className="welcome-title">Welcome to Our Platform!</h2>
          <p className="professional-sentence">
            We are dedicated to helping you achieve your goals with ease and efficiency. 
            Join our community and unlock your potential today!
          </p>
          <p className="additional-info">
            Our platform offers a variety of tools and resources designed to support your journey. 
            Whether you're looking to enhance your skills, connect with like-minded individuals, or 
            access exclusive content, we have something for everyone.
          </p>
          <Link to="/register" className="cta-button">Get Started</Link>
          <div>
            <img src="/images/semi.jpg" alt="Empowering view" className="responsive-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
