const express = require('express');
const Tourist = require('./Tourist');
const Guide = require('./Guide');
const router = express.Router();
const verifyToken = require('../middleware');
const Booking = require('./Booking');
const jwt = require('jsonwebtoken');
const User = require('../model');

const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
};

router.post('/tourist-register', async (req, res) => {
    const { 
        username, 
        email, 
        destination, 
        dateFrom, 
        dateTo, 
        preferredModeOfTransport, 
        travelCompanion, 
        languagePreferences, 
        preferredGuideType 
    } = req.body;

    try {
        if (!username || !email || !destination || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const validCompanions = ['Friends', 'Family', 'Solo', 'Other'];
        if (!validCompanions.includes(travelCompanion)) {
            return res.status(400).json({ 
                message: `Invalid travel companion option. Valid options are: ${validCompanions.join(', ')}` 
            });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist. Please register first.' });
        }

        if (existingUser.username !== username) {
            return res.status(400).json({ message: 'Username does not match the registered username.' });
        }

        const existingTourist = await Tourist.findOne({ userId: existingUser._id });
        if (existingTourist) {
            return res.status(400).json({ message: 'You have already registered as a tourist.' });
        }

        const guides = await Guide.find({ location: destination });
        if (!guides.length) {
            return res.status(404).json({
                message: 'Registration successful! No guide assigned.',
                booking: false,
            });
        }

        let assignedGuide = guides.find(guide => guide.guideType === preferredGuideType) || guides[0];
        let guideMessage = assignedGuide.guideType === preferredGuideType
            ? `Guide found: ${assignedGuide.username}, located in ${assignedGuide.location}.`
            : 'No matching guide found for preferred type, assigned first available guide.';

        const newTourist = new Tourist({ 
            username, 
            email, 
            destination, 
            dateFrom, 
            dateTo, 
            preferredModeOfTransport, 
            travelCompanion, 
            languagePreferences, 
            preferredGuideType,
            assignedGuide: assignedGuide._id,
            userId: existingUser._id
        });

        await newTourist.save();

        const payload = { user: { id: existingUser._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({
            message: `Registration successful! ${guideMessage}`,
            booking: true,
            token,
            assignedGuide: {
                username: assignedGuide.username,
                location: assignedGuide.location,
                guideType: assignedGuide.guideType,
            },
            tourist: newTourist,
        });
    } catch (err) {
        console.error('Error during tourist registration:', err); 
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Tourist.find({ userId }).populate('assignedGuide', 'username location');

        if (!bookings || bookings.length === 0) {
            return res.status(204).json({ message: 'No bookings found for this user.' });
        }

        const transformedBookings = bookings.map(booking => ({
            id: booking._id,
            username: booking.username,
            email: booking.email,
            destination: booking.destination,
            travelCompanion: booking.travelCompanion,
            dateFrom: booking.dateFrom,
            dateTo: booking.dateTo,
            preferredModeOfTransport: booking.preferredModeOfTransport,
            languagePreferences: booking.languagePreferences,
            preferredGuideType: booking.preferredGuideType,
            assignedGuide: booking.assignedGuide ? {
                username: booking.assignedGuide.username,
                location: booking.assignedGuide.location,
            } : null,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        }));

        return res.status(200).json({
            message: 'Bookings retrieved successfully.',
            bookings: transformedBookings,
        });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
