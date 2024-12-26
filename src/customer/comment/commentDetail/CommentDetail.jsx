import React, { useState } from 'react';
import Reply from '../reply/Reply';
import './comment.css';

const Comment = ({ comment, onEdit, onDelete, onReply, onEditReply, onDeleteReply }) => {
    const [reply, setReply] = useState('');
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const submitReplyHandler = (e) => {
        e.preventDefault();
        onReply(comment._id, reply);
        setReply('');
        setShowReplyBox(false);
    };

    const handleEdit = () => {
        const newComment = prompt("Chỉnh sửa bình luận:", comment.comment);
        if (newComment) {
            onEdit(comment._id, newComment);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    return (
        <article className="comment">
            <div className="comment-header">
                <div className="comment-user-info">
                    <p className="comment-username">
                        <img
                            className="comment-avatar"
                            src={comment?.avatarUrl || 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'} // Nếu không có ảnh đại diện, dùng ảnh mặc định
                            alt="User Avatar"
                        />
                        {comment?.username} {/* Hiển thị tên người dùng */}
                    </p>
                    <p className="comment-time">
                        <time pubdate datetime={comment?.createdAt} title={comment?.createdAt}>
                            {new Date(comment?.createdAt).toLocaleString()}
                        </time>
                    </p>
                </div>
                <div className='setting-for-cmt'>
                    <button
                        className="comment-settings-button"
                        type="button"
                        onClick={toggleDropdown}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                            <path className='dropdown-btn' d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                        </svg>
                    </button>
                    <div className={`settings-dropdown ${showDropdown ? 'show' : ''}`}>
                        <div className="settings-list">
                            <div><a className="settings-item" onClick={handleEdit}>Edit</a></div>
                            <div><a className="settings-item" onClick={() => onDelete(comment._id)}>Remove</a></div>
                            <div><a className="settings-item">Report</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="comment-text">{comment?.comment}</p>
            <div className="comment-actions">
                <button type="button" className="reply-button" onClick={() => setShowReplyBox(prev => !prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                        <path className="setting-btn" d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64h112c97.2 0 176 78.8 176 176 0 113.3-81.5 163.9-100.2 174.1-2.5 1.4-5.3 1.9-8.1 1.9-10.9 0-19.7-8.9-19.7-19.7 0-7.5 4.3-14.4 9.8-19.5 9.4-8.8 22.2-26.4 22.2-56.7 0-53-43-96-96-96h-96v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4L10.6 232.2C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8L170.6 40.2c9.4-8.5 22.9-10.6 34.4-5.4z"/>
                    </svg>
                    Reply
                </button>
                {showReplyBox && (
                    <form className='reply-form' onSubmit={submitReplyHandler}>
                        <input
                            className="reply-input"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            type="text"
                            placeholder="add reply..."
                        />
                        <button className="submit-reply-button">Reply</button>
                    </form>
                )}
            </div>

            <div className="reply-list">
                {comment.replies?.map(reply => (
                    <Reply key={reply._id} 
                    reply={reply} 
                    onEditReply={onEditReply} 
                    onDeleteReply={onDeleteReply}/>
                ))}
            </div>
        </article>
    );
};

export default Comment;
