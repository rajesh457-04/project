import React, { useState } from 'react';
import './style5.css';
import axios from 'axios';

const Register = () => {
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (data.password !== data.confirmpassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/register', data);
            alert(res.data);
            setData({
                username: '',
                email: '',
                password: '',
                confirmpassword: ''
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data.message || 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-containers">
            <h2 className="heading">Register</h2>
            <form onSubmit={submitHandler} autoComplete="off">
                <div className="input">
                    <span className="icon"><ion-icon name="person-outline"></ion-icon></span>
                    <input
                        type="text"
                        name="username"
                        required
                        
                        value={data.username}
                        onChange={changeHandler}
                    />
                    <label>Username</label>
                </div>
                <div className="input">
                    <span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
                    <input
                        type="email"
                        name="email"
                        required
                        
                        value={data.email}
                        onChange={changeHandler}
                    />
                    <label>Email</label>
                </div>
                <div className="input">
                    <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                    <input
                        type="password"
                        name="password"
                        required
                        
                        value={data.password}
                        onChange={changeHandler}
                    />
                    <label>Password</label>
                </div>
                <div className="input">
                    <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                    <input
                        type="password"
                        name="confirmpassword"
                        required
                       
                        value={data.confirmpassword}
                        onChange={changeHandler}
                    />
                    <label>Confirm Password</label>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="btn1" disabled={loading}>
                    {loading ? 'Processing...' : 'Register'}
                </button>
                <div className="login-register">
                    <p>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;