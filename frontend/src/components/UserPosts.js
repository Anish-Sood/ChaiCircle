import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Post from './Post';
import SkeletonPost from './SkeletonPost';
import './UserPosts.css';
import { apiRequest } from '../config/api';

const UserPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

    const fetchUserPosts = async () => {
        setLoading(true);
        try {
            const response = await apiRequest('/api/posts/my-posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError('Failed to load your posts');
            console.error('Error fetching user posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserPosts();
        }
    }, [token]);

    const handlePostDeleted = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    };

    if (loading) {
        return (
            <>
                <div className="posts-section-header">
                    <h3 className="posts-section-title">My Posts</h3>
                </div>
                <SkeletonPost />
                <SkeletonPost />
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="posts-section-header">
                    <h3 className="posts-section-title">My Posts</h3>
                </div>
                <div className="user-posts-error">{error}</div>
            </>
        );
    }

    return (
        <>
            <div className="posts-section-header">
                <h3 className="posts-section-title">
                    My Posts
                    <span className="posts-count-badge">{posts.length}</span>
                </h3>
            </div>
            
            {posts.length === 0 ? (
                <div className="no-posts-message">
                    <p>You haven't created any posts yet.</p>
                    <p>Click the "Create" button in the sidebar to share your first post!</p>
                </div>
            ) : (
                <div className="posts-feed">
                    {posts.map(post => (
                        <Post 
                            key={post._id} 
                            post={post} 
                            onPostDeleted={handlePostDeleted}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default UserPosts;