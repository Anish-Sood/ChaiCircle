import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { token } = useContext(AuthContext);

    const CLOUDINARY_CLOUD_NAME = 'duntpleg0';
    const CLOUDINARY_UPLOAD_PRESET = 'social_media_uploads';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'social-media-posts');

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
                throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            let imageUrl = '';
            
            if (imageFile) {
                setUploadingImage(true);
                try {
                    imageUrl = await uploadImageToCloudinary(imageFile);
                } catch (error) {
                    alert(`Failed to upload image: ${error.message}`);
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    content: content.trim(), 
                    image: imageUrl
                })
            });

            if (response.ok) {
                setIsSuccess(true);
                setContent('');
                setImageFile(null);
                setImagePreview('');
                
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                }
                
                setTimeout(() => {
                    setIsSuccess(false);
                    if (onPostCreated) {
                        onPostCreated();
                    }
                }, 1000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert(`Failed to create post: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview('');
        }
    };

    const getButtonText = () => {
        if (isSuccess) return '✓ Posted Successfully!';
        if (uploadingImage) return 'Uploading Image...';
        if (isSubmitting) return 'Publishing...';
        return 'Share Post';
    };

    const getButtonClass = () => {
        let classes = 'create-submit-btn';
        if (isSubmitting || uploadingImage) classes += ' loading';
        if (isSuccess) classes += ' success';
        return classes;
    };

    return (
        <div className="create-post-modal-container">
            <div className="create-post-header">
                <h2>Create New Post</h2>
                <p>Share what's on your mind</p>
            </div>

            <form onSubmit={handleSubmit} className="create-post-form-modal">
                <div className="create-content-field">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening in your world?"
                        maxLength="500"
                        disabled={isSubmitting}
                        className="create-textarea"
                    />
                    <div className="create-char-count">
                        <span className={content.length > 450 ? 'warning' : ''}>
                            {content.length}/500
                        </span>
                    </div>
                </div>

                {imagePreview && (
                    <div className="create-image-preview-section">
                        <div className="create-image-container">
                            <img src={imagePreview} alt="Preview" className="create-preview-img" />
                            <div className="create-image-overlay">
                                <button 
                                    type="button" 
                                    className="create-remove-btn"
                                    onClick={removeImage}
                                    disabled={isSubmitting}
                                >
                                    <span>Remove Image</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="create-actions-bar">
                    <div className="create-media-section">
                        <label htmlFor="create-image-upload" className="create-image-btn">
                            <svg viewBox="0 0 24 24" className="create-icon">
                                <path fill="currentColor" d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 16l3-4 2 3 3-4 4 5H5z"/>
                            </svg>
                            <span>Add Photo</span>
                        </label>
                        <input
                            id="create-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isSubmitting}
                            style={{ display: 'none' }}
                        />
                        
                        {imageFile && (
                            <div className="create-file-info">
                                <span className="create-filename">{imageFile.name}</span>
                                <span className="create-filesize">
                                    {(imageFile.size / 1024 / 1024).toFixed(2)}MB
                                </span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={!content.trim() || isSubmitting || uploadingImage}
                        className={getButtonClass()}
                    >
                        <span>{getButtonText()}</span>
                        {(isSubmitting || uploadingImage) && (
                            <div className="create-spinner"></div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;