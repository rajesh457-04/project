const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    destination: {
        type: String,
        required: true,
        enum: ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai']
    },
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
    },
    preferredModeOfTransport: {
        type: [String],
        enum: ['Car', 'Bike', 'Bus'],
        required: true
    },
    travelCompanion: {
        type: String,
        enum: ['Family', 'Friends', 'Solo', 'Couple', 'Group'],
        required: true
    },
    languagePreferences: {
        type: String,
        required: true
    },
    preferredGuideType: {
        type: String,
        enum: ['Male', 'Female', 'No Preference'],
        required: true
    },
    assignedGuide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide'
    }
}, {
    timestamps: true
});

touristSchema.methods.assignGuide = function(guide) {
    this.assignedGuide = guide;
    return this.save();
};

const Tourist = mongoose.model('Tourist', touristSchema);

module.exports = Tourist;
