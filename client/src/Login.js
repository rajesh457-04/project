import React, { useState, useContext } from 'react';
import axios from 'axios';
import { store } from './App'; 
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setToken] = useContext(store); 
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(''); 

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            console.log("Login Payload:", { email, password });

            
            const res = await axios.post('http://localhost:5000/login', { email, password });
            
            
            const token = res.data.token;

           
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', 'true');
            
            
            console.log("Login successful, token:", token);
            alert('Login successful');
            
            
            navigate('/myprofile');
        } catch (error) {
           
            if (error.response) {
                
                console.error("Error response:", error.response.data);
                setErrorMessage(error.response.data.message || "Invalid email or password");
            } else if (error.request) {
                
                console.error("Network error:", error.request);
                setErrorMessage("No response from server. Please try again.");
            } else {
                
                console.error("Error:", error.message);
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="form-containers">
            <h2 className="heading">Login</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="input">
                    <span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
                    <input
                        type="email"
                        required
                        value={email}
                        
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email</label>
                </div>
                <div className="input">
                    <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                </div>
                <button type="submit" className="btn1">Login</button>

                {errorMessage && (
                    <div className="error-message">
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div className="login-register">
                    <p>
                        Don't have an account?
                        <a href="/register">Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;