import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserPosts from './UserPosts';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const { token } = useContext(AuthContext);

    const CLOUDINARY_CLOUD_NAME = 'duntpleg0';
    const CLOUDINARY_UPLOAD_PRESET = 'social_media_uploads';

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            
            const data = await response.json();
     
            setUser(data);
            setError('');
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                alert('Avatar image size should be less than 2MB');
                return;
            }

            setAvatarFile(file);
            
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const uploadAvatarToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'social-media-avatars');

        try {
            
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Avatar upload failed: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            const transformedUrl = data.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face,r_max,q_auto,f_auto/');

            return transformedUrl;
        } catch (error) {
            console.error('Cloudinary avatar upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            let updatedUser = { 
                ...user,
                name: user.name,
                email: user.email,
                bio: user.bio || '',
                profilePicture: user.profilePicture || ''
            };
            
            if (avatarFile) {
                setUploadingAvatar(true);
                try {
                    const avatarUrl = await uploadAvatarToCloudinary(avatarFile);
                    updatedUser.profilePicture = avatarUrl;
                } catch (error) {
                    console.error('Avatar upload failed:', error);
                    alert(`Failed to upload avatar: ${error.message}`);
                    return;
                } finally {
                    setUploadingAvatar(false);
                }
            }


            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser),
            });
            
            if (response.ok) {
                const savedUser = await response.json();
                
                const completeUserData = {
                    ...user, 
                    ...savedUser,
                    name: savedUser.name || user.name,
                    email: savedUser.email || user.email,
                    bio: savedUser.bio !== undefined ? savedUser.bio : user.bio,
                    profilePicture: savedUser.profilePicture || user.profilePicture
                };
                
                console.log('setting complete user data:', completeUserData); 
                
                setUser(completeUserData);
                
                setIsEditing(false);
                setAvatarFile(null);
                if (avatarPreview) {
                    URL.revokeObjectURL(avatarPreview);
                    setAvatarPreview('');
                }
                
                console.log('profile updated successfully'); 
                
                setTimeout(() => {
                    fetchUserProfile();
                }, 500);
                
            } else {
                const errorData = await response.json();
                console.error('profile update failed:', errorData);
                setError(`failed to update profile: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('profile update error:', err);
            setError('failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview('');
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }
    
    if (error && !user) {
        return (
            <div className="profile-error">
                <p>{error}</p>
                <button onClick={fetchUserProfile} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="profile-error">
                <p>No user data found</p>
                <button onClick={fetchUserProfile} className="retry-btn">
                    Reload Profile
                </button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {isEditing ? (
                    <div className="profile-edit-section">
                        <div className="profile-edit-container">
                            <div className="edit-header">
                                <h1>Edit Profile</h1>
                                <p>Update your information to personalize your experience</p>
                            </div>

                            {error && (
                                <div className="error-message">{error}</div>
                            )}

                            <form onSubmit={handleSubmit} className="edit-form">
                                <div className="form-section">
                                    <h3>Basic Information</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={user.name || ''}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                value={user.email || ''}
                                                disabled
                                                className="disabled-input"
                                            />
                                            <small>Email address cannot be changed</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Profile Picture</h3>
                                    <div className="profile-pic-section">
                                        <div className="current-pic">
                                            <img 
                                                src={avatarPreview || user.profilePicture || '/default-profile.png'} 
                                                alt="Profile" 
                                            />
                                        </div>
                                        <div className="pic-input">
                                            <div className="upload-controls">
                                                <label htmlFor="avatar-upload" className="avatar-upload-label">
                                                    📷 Change Avatar
                                                </label>
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    disabled={isSubmitting}
                                                    style={{ display: 'none' }}
                                                />
                                                
                                                {avatarFile && (
                                                    <button 
                                                        type="button" 
                                                        className="remove-avatar-btn"
                                                        onClick={removeAvatar}
                                                        disabled={isSubmitting}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {avatarFile && (
                                                <div className="file-info">
                                                    {avatarFile.name} ({(avatarFile.size / 1024 / 1024).toFixed(2)}MB)
                                                </div>
                                            )}
                                            
                                            <small>Upload a square image for best results. Max size: 2MB</small>
                                            
                                            {/* URL input as fallback */}
                                            <div className="url-fallback">
                                                <label>Or enter image URL</label>
                                                <input
                                                    type="url"
                                                    name="profilePicture"
                                                    value={user.profilePicture || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/your-photo.jpg"
                                                    disabled={isSubmitting || !!avatarFile}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>About You</h3>
                                    <div className="form-group">
                                        {/* <label>Bio</label> */}
                                        <textarea
                                            name="bio"
                                            value={user.bio || ''}
                                            onChange={handleChange}
                                            placeholder="Tell others about yourself..."
                                            rows="4"
                                            disabled={isSubmitting}
                                            maxLength="300"
                                        />
                                        <small>Share a bit about yourself ({(user.bio || '').length}/300)</small>
                                    </div>
                                </div>

                                <div className="form-actions-alt">
                                    <button 
                                        type="button" 
                                        className="btn-cancel-alt" 
                                        onClick={() => {
                                            setIsEditing(false);
                                            removeAvatar();
                                            setError('');
                                            fetchUserProfile();
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn-save-alt"
                                        disabled={isSubmitting || uploadingAvatar}
                                    >
                                        {uploadingAvatar ? 'Uploading Avatar...' : isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="profile-info-section">
                            <div className="profile-display-section">
                                <div className="profile-header">
                                    <div className="profile-avatar">
                                        <img 
                                            src={user.profilePicture || '/default-profile.png'} 
                                            alt="Profile" 
                                            className="profile-image"
                                            key={user.profilePicture} // Force re-render when avatar changes
                                        />
                                    </div>
                                    <div className="profile-info">
                                        <h1 className="profile-name">{user.name || 'No name provided'}</h1>
                                        <p className="profile-email">{user.email || 'No email'}</p>
                                        <p className="profile-bio">{user.bio || 'No bio available'}</p>
                                    </div>
                                </div>
                                
                                <div className="profile-actions">
                                    <button 
                                        className="edit-profile-btn" 
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="profile-posts-section">
                            <div className="posts-section-content">
                                <UserPosts />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;