import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { store } from './App';
import ImageCarousel from './components/ImageCarousel';
import Footer from './components/Footer';
import './MyProfile.css';

const MyProfile = () => {
    const [token, setToken] = useContext(store);
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (!token) {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
            } else {
                navigate('/login');
            }
        }
    }, [token, setToken, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
    };

    const toggleNotification = () => {
        setShowNotification(prev => !prev);
    };

    return (
        <div className="my-profile">
            <div className="menu-icon" onClick={toggleNotification}>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </div>

            {showNotification && (
                <div className="notification-icon">
                    <span className="badge">1</span>
                    <span className="icon">🔔</span>
                </div>
            )}

            <nav className="profile-nav">
                <ul>
                    <li><Link to="/mybookings">My Bookings</Link></li>
                    <li><Link to="/findlocations">Find Locations</Link></li>
                    <li><Link to="/weather">Weather Updates</Link></li>
                    <li>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            <div className="gold-shadow"></div>

            <section className="profile-content">
                <ImageCarousel />
            </section>

            <div className="card-container">
                <div className="card">
                    <h2>Explore Amazing Destinations</h2>
                    <p>Join us as we take you to the best tourist spots around the world.</p>
                    <Link to="/tourist-form">
                        <button>Register as Tourist</button>
                    </Link>
                </div>
                <div className="card">
                    <h2>Become a Guide</h2>
                    <p>Share your knowledge and experience with travelers. Join our team!</p>
                    <Link to="/guide-form">
                        <button>Register as Guide</button>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MyProfile;
