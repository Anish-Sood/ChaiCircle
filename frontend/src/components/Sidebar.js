import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiUser, FiPlusSquare, FiLogOut } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import Modal from './Modal';
import './Sidebar.css';

const Sidebar = ({ onOpenCreatePostModal }) => {
    const { token, logout } = useContext(AuthContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const history = useHistory();

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        history.push('/login');
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    if (!token) {
        return null;
    }

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <img src="/logo.png" alt="ChaiCircle Logo" className="sidebar-logo" />
                    <span>ChaiCircle</span>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/" exact activeClassName="active">
                        <FiHome /> <span>Home</span>
                    </NavLink>
                    <NavLink to="/profile" activeClassName="active">
                        <FiUser /> <span>Profile</span>
                    </NavLink>
                    <button onClick={onOpenCreatePostModal}>
                        <FiPlusSquare /> <span>Create</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <ThemeToggle />
                    <button onClick={handleLogoutClick} className="logout-button">
                        <FiLogOut /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            <Modal show={showLogoutModal} onClose={handleCancelLogout}>
                <div className="logout-confirmation">
                    <div className="logout-confirmation-header">
                        <div className="logout-icon">
                            <FiLogOut />
                        </div>
                        <h2>Confirm Logout</h2>
                        <p>Are you sure you want to log out of your account?</p>
                    </div>
                    
                    <div className="logout-confirmation-actions">
                        <button 
                            className="logout-cancel-btn"
                            onClick={handleCancelLogout}
                        >
                            Cancel
                        </button>
                        <button 
                            className="logout-confirm-btn"
                            onClick={handleConfirmLogout}
                        >
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Sidebar;