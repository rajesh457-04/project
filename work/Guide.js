const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    guideExperience: {
        type: String,  
        required: true
    },
    modeOfTransport: {
        type: [String], 
        required: true
    },
    languagesSpoken: {
        type: String,
        required: true
    },
    guideType: {
        type: String, 
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
