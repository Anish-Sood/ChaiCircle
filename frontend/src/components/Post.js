import React, { useState, useEffect, useContext } from 'react';
import { FiHeart, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import './Post.css';
import { apiRequest } from '../config/api';


const formatTimestamp = (timestamp) => {
    const now = new Date();
    
    let postDate;
    try {
        if (typeof timestamp === 'string') {
            postDate = new Date(timestamp.endsWith('Z') ? timestamp : timestamp + 'Z');
        } else {
            postDate = new Date(timestamp);
        }
        
        if (isNaN(postDate.getTime())) {
            console.error('Invalid timestamp:', timestamp);
            return 'Invalid date';
        }
    } catch (error) {
        console.error('Error parsing timestamp:', timestamp, error);
        return 'Invalid date';
    }
    
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    } else {
        return postDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
};

const Post = ({ post, onPostDeleted }) => {
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.sub);
            } catch (error) {
                console.error('Error parsing token:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLikes(prev => prev); 
        }, 60000); 

        return () => clearInterval(interval);
    }, []);

    const handleLike = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        
        try {
            const response = await apiRequest(`/api/posts/${post._id}/like`, {
                method: 'POST',
            });
            const data = await response.json();
            
            if (response.ok) {
                setLikes(data.likes);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        setIsDeleting(true);
        
        try {
            const response = await apiRequest(`/api/posts/${post._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                if (onPostDeleted) {
                    onPostDeleted(post._id);
                }
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        } finally {
            setIsDeleting(false);
            setShowOptions(false);
        }
    };

    const isAuthor = currentUserId && post.author.id === currentUserId;

    return (
        <div className="post-card">
            <div className="post-header">
                <img 
                    src={post.author.profile_picture || '/default-profile.png'} 
                    alt={post.author.name} 
                    className="post-author-img"
                />
                <div className="post-author-info">
                    <span className="post-author-name">{post.author.name}</span>
                    <span className="post-timestamp">{formatTimestamp(post.created_at)}</span>
                </div>
                {isAuthor && (
                    <div className="post-options">
                        <button 
                            className="post-options-button"
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            <FiMoreHorizontal />
                        </button>
                        {showOptions && (
                            <div className="post-options-menu">
                                <button 
                                    className="delete-button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <FiTrash2 />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="post-content">{post.content}</p>
            {post.image && <img src={post.image} alt="" className="post-image" />}
            <div className="post-actions">
                <button 
                    onClick={handleLike} 
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    disabled={isLoading}
                >
                    <FiHeart />
                    <span>{likes}</span>
                </button>
            </div>
        </div>
    );
};

export default Post;