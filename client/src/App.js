import React, { useState, createContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './Nav';
import Register from './Register';
import Login from './Login';
import MyProfile from './Myprofile';
import MyBookings from './components/MyBookings'; 
import FindLocations from './components/FindLocations'; 
import Weather from './components/Weather'; 

import './index.css';
import TouristForm from './components/TouristForm';
import GuideForm from './components/GuideForm';

export const store = createContext();

const App = () => {
    const [token, setToken] = useState(null);
    return (
        <store.Provider value={[token, setToken]}>
            <BrowserRouter>
                <div className="app-container">
                    
                    <Routes>
                        <Route path='/' element={<Nav />} /> 
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/myprofile' element={<MyProfile />} />
                        <Route path='/mybookings' element={<MyBookings />} />
                        <Route path='/findlocations' element={<FindLocations />} />
                        <Route path='/weather' element={<Weather />} />
                        
                        <Route path="/tourist-form" element={<TouristForm />} />
                        <Route path="/guide-form" element={<GuideForm />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </store.Provider>
    );
};

export default App; 