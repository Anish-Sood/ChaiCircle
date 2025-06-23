import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            login(data.access_token);
            history.push('/');

        } catch (err) {
            setError('Invalid email or password. Please try again.');
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
                    <h2>Welcome Back!</h2>
                    <p className="auth-subheading">Please enter your details to sign in to your account.</p>
                    
                    <form onSubmit={handleLogin} className="auth-form">
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
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={isLoading ? 'loading' : ''}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="switch-auth">
                        Don't have an account? <Link to="/signup">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;