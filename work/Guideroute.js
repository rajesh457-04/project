const express = require('express');
const router = express.Router();
const Guide = require('./Guide');

router.post('/guide-register', async (req, res) => {
    const { 
        username, 
        email, 
        phone, 
        guideExperience, 
        modeOfTransport, 
        languagesSpoken, 
        guideType, 
        location 
    } = req.body;

    if (!username || !email || !phone || !guideExperience || !modeOfTransport || !languagesSpoken || !guideType || !location) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
    }

    try {
        const existingGuide = await Guide.findOne({ email });
        if (existingGuide) {
            return res.status(400).json({ message: "Guide with this email already exists" });
        }

        const newGuide = new Guide({
            username,
            email,
            phone,
            guideExperience,
            modeOfTransport,
            languagesSpoken,
            guideType,
            location
        });

        await newGuide.save();
        return res.status(201).json({ 
            message: "Guide registered successfully",
            guide: {
                username: newGuide.username,
                email: newGuide.email,
                phone: newGuide.phone,
                guideExperience: newGuide.guideExperience,
                modeOfTransport: newGuide.modeOfTransport,
                languagesSpoken: newGuide.languagesSpoken,
                guideType: newGuide.guideType,
                location: newGuide.location
            }
        });
    } catch (error) {
        console.error("Error during guide registration:", error);
        return res.status(500).json({ message: "Server error during guide registration" });
    }
});

module.exports = router;
