import React, { useEffect, useState } from 'react';
import Post from './Post';
import SkeletonPost from './SkeletonPost';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostDeleted = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    };

    if (loading) {
        return (
            <div className="feed">
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
            </div>
        );
    }

    return (
        <div className="feed">
            {posts.map(post => (
                <Post 
                    key={post._id} 
                    post={post} 
                    onPostDeleted={handlePostDeleted}
                />
            ))}
        </div>
    );
};

export default Feed;