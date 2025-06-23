import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './Auth.css';
import { apiRequest } from '../config/api';


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const history = useHistory();

    const validateForm = () => {
        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters long');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const response = await apiRequest('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email, password })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.msg || 'Signup failed');
            }
            
            setIsSuccess(true);
            setTimeout(() => {
                history.push('/login');
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-showcase">
                <div className="showcase-content">
                    <img src="/logo.png" alt="ChaiCircle Logo" className="auth-logo" />
                    <h1 className="brand-logo">ChaiCircle</h1>
                    <p className="tagline">Connect, Share, and Sip on Conversations.</p>
                </div>
            </div>
            
            <div className="auth-form-container">
                <div className="auth-container">
                    <h2>Join the Circle</h2>
                    <p className="auth-subheading">Create your account to get started with ChaiCircle.</p>

                    <form onSubmit={handleSignup} className="auth-form">
                        <div className="form-field">
                            {/* <label>Full Name</label> */}
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Enter your full name"
                                required 
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="form-field">
                            {/* <label>Email Address</label> */}
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Enter your email address"
                                required 
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="form-field">
                            {/* <label>Password</label> */}
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Create a strong password"
                                required 
                                disabled={isLoading}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`${isLoading ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
                        >
                            {isSuccess ? '✓ Account Created!' : isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="switch-auth">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;