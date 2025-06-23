import React from 'react';
import './SkeletonPost.css';

const SkeletonPost = () => {
    return (
        <div className="skeleton-post-card">
            <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-author-info">
                    <div className="skeleton-author"></div>
                    <div className="skeleton-timestamp"></div>
                </div>
            </div>
            <div className="skeleton-content"></div>
            <div className="skeleton-content short"></div>
        </div>
    );
};

export default SkeletonPost;