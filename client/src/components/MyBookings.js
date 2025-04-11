import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Please log in to view your bookings.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/Tourist/my-bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.bookings) {
                    setBookings(response.data.bookings);
                } else {
                    setBookings([]);
                }
            } catch (err) {
                setError('Failed to fetch bookings: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div>Loading your bookings...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!bookings.length) {
        return <div className="no-data-message">No bookings found.</div>;
    }

    return (
        <div className="my-bookings-container">
            <h2>My Bookings</h2>
            {bookings.map((booking) => (
                <div key={booking.id} className="booking-details">
                    <h3>Booking Details</h3>
                    <p><strong>Username:</strong> {booking.username}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Destination:</strong> {booking.destination}</p>
                    <p><strong>Travel Companion:</strong> {booking.travelCompanion}</p>
                    <p><strong>Travel Dates:</strong> {new Date(booking.dateFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} to {new Date(booking.dateTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p><strong>Preferred Transport:</strong> {Array.isArray(booking.preferredModeOfTransport) ? booking.preferredModeOfTransport.join(', ') : booking.preferredModeOfTransport}</p>
                    <p><strong>Language Preferences:</strong> {booking.languagePreferences}</p>
                    <p><strong>Preferred Guide Type:</strong> {booking.preferredGuideType}</p>
                    {booking.assignedGuide ? (
                        <div className="assigned-guide">
                            <h4>Assigned Guide</h4>
                            <p><strong>Guide Name:</strong> {booking.assignedGuide.username}</p>
                            <p><strong>Location:</strong> {booking.assignedGuide.location}</p>
                        </div>
                    ) : (
                        <p>No guide assigned.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyBookings;
