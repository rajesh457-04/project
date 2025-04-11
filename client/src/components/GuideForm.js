import React, { useState } from 'react';
import axios from 'axios';
import './form.css';

const GuideForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        guideExperience: '',
        modeOfTransport: [],
        languagesSpoken: '',
        guideType: '',
        location: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData(prevData => ({
                ...prevData,
                [name]: checked
                    ? [...prevData[name], value]
                    : prevData[name].filter(item => item !== value)
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep = () => {
        const newErrors = {};
        if (step === 1 && !formData.username.trim()) newErrors.username = "Username is required";
        if (step === 2) {
            if (!formData.email.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        }
        if (step === 3 && !formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (step === 4 && !formData.guideExperience.trim()) newErrors.guideExperience = "Experience is required";
        if (step === 5 && formData.modeOfTransport.length === 0) newErrors.modeOfTransport = "Select at least one transport mode";
        if (step === 6 && !formData.languagesSpoken.trim()) newErrors.languagesSpoken = "Languages spoken is required";
        if (step === 7 && !formData.guideType) newErrors.guideType = "Guide type is required";
        if (step === 8 && !formData.location) newErrors.location = "Location is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep()) setStep(step + 1);
    };

    const handlePreviousStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        try {
            const response = await axios.post('http://localhost:5000/api/guide/guide-register', formData);
            alert(response.data.message);
            setFormData({
                username: '',
                email: '',
                phone: '',
                guideExperience: '',
                modeOfTransport: [],
                languagesSpoken: '',
                guideType: '',
                location: ''
            });
            setStep(1);
        } catch (err) {
            console.error(err);
            alert('Error registering guide: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="form">
            <div className="form-header">
                <h1>Become a Tour Guide</h1>
                <p>Join our platform and help travelers explore the world with your expertise.</p>
                <img src="/images/g1.jpeg" alt="Guide Adventure" className="header-image" />
            </div>
            {step === 1 && (
                <div className="step-container">
                    <h2>Step 1: Your Full Name</h2>
                    <p>Let's start with your name. This will be displayed to travelers.</p>
                    <input type="text" name="username" value={formData.username} placeholder="Enter your full name" onChange={handleChange} className={errors.username ? "error form-input" : "form-input"} />
                    {errors.username && <p className="error-message">{errors.username}</p>}
                    <div className="form-navigation">
                        <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="step-container">
                    <h2>Step 2: Your Email Address</h2>
                    <p>We'll use this email to contact you about your guide profile.</p>
                    <input type="email" name="email" value={formData.email} placeholder="example@example.com" onChange={handleChange} className={errors.email ? "error form-input" : "form-input"} />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    <div className="form-navigation">
                        <button type="button" className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div className="step-container">
                    <h2>Step 3: Your Phone Number</h2>
                    <p>Travelers may need to contact you directly. Please provide your phone number.</p>
                    <input type="tel" name="phone" value={formData.phone} placeholder="Enter your phone number" onChange={handleChange} className={errors.phone ? "error form-input" : "form-input"} />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                    <div className="form-navigation">
                        <button type="button" className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}
            {step === 4 && (
                <div className="step-container">
                    <h2>Step 4: Your Experience</h2>
                    <p>How many years of experience do you have as a tour guide?</p>
                    <input type="text" name="guideExperience" value={formData.guideExperience} placeholder="Enter years of experience" onChange={handleChange} className={errors.guideExperience ? "error form-input" : "form-input"} />
                    {errors.guideExperience && <p className="error-message">{errors.guideExperience}</p>}
                    <div className="form-navigation">
                        <button type="button" className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}
            {step === 5 && (
                <div className="step-container">
                    <h2>Step 5: Transport Preferences</h2>
                    <p>What modes of transport are you comfortable using with travelers?</p>
                    <div className="transport-options">
                        {["Car", "Bike", "Bus", "Train", "Flight"].map((transport) => (
                            <div className="transport-option" key={transport}>
                                <input type="checkbox" id={`transport-${transport}`} name="modeOfTransport" value={transport} checked={formData.modeOfTransport.includes(transport)} onChange={handleChange} className="transport-checkbox" />
                                <label htmlFor={`transport-${transport}`} className="transport-label">{transport}</label>
                            </div>
                        ))}
                    </div>
                    {errors.modeOfTransport && <p className="error-message">{errors.modeOfTransport}</p>}
                    <div className="form-navigation">
                        <button type="button" className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}
            {step === 6 && (
                <div className="step-container">
                    <h2>Step 6: Languages You Speak</h2>
                    <p>Which languages can you communicate in with travelers?</p>
                    <input type="text" name="languagesSpoken" value={formData.languagesSpoken} placeholder="e.g. English, Hindi, etc." onChange={handleChange} className={errors.languagesSpoken ? "error form-input" : "form-input"} />
                    {errors.languagesSpoken && <p className="error-message">{errors.languagesSpoken}</p>}
                    <div className="form-navigation">
                        <button type="button" className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}
            {step === 7 && (
                <div className="step-container">
                    <h2>Step 7: Your Guide Type</h2>
                    <p>What type of guide are you? This helps us match you with the right travelers.</p>
                    <select name="guideType" value={formData.guideType} onChange={handleChange} className={errors.guideType ? "error form-input" : "form-input"}>
                        <option value="">Select Guide Type</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="No Preference">No Preference</option>
                    </select>
                    {errors.guideType && <p className="error-message">{errors.guideType}</p>}
                    <div className="form-navigation">
                        <button type="button" className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}
            {step === 8 && (
                <div className="step-container">
                    <h2>Step 8: Your Location</h2>
                    <p>Where do you usually operate or provide guiding services?</p>
                    <input type="text" name="location" value={formData.location} placeholder="Enter your city or region" onChange={handleChange} className={errors.location ? "error form-input" : "form-input"} />
                    {errors.location && <p className="error-message">{errors.location}</p>}
                    <div className="form-navigation">
                        <button type="button" className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuideForm;
