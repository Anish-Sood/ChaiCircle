import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css'; // Import styles

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { token } = useContext(AuthContext);

    const fetchUserProfile = async () => {
        const response = await fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user),
        });
        setIsEditing(false);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-edit-form">
                    <h3>Edit Profile</h3>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        name="profilePicture"
                        value={user.profilePicture}
                        onChange={handleChange}
                        placeholder="Profile Picture URL"
                    />
                    <textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        placeholder="Short Bio"
                    />
                    <div className="form-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="profile-view">
                    <div className="profile-header">
                        <img src={user.profilePicture || '/default-profile.png'} alt="Profile" className="profile-picture" />
                        <h2 className="profile-name">{user.name}</h2>
                        <p className="profile-bio">{user.bio}</p>
                    </div>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default Profile;