import React, { useState } from 'react';
import './reply.css';

const Reply = ({ reply, onEditReply, onDeleteReply }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedReply, setEditedReply] = useState(reply.reply);

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleEditReply = () => {
        const newReply = prompt("Chỉnh sửa bình luận:", reply.reply);
        if (newReply) {
            onEditReply(reply._id, newReply);
        }
    };

    return (
        <div className='reply'>
            <div className="reply-container">
                <div className='reply-header'>
                    <div className="reply-content">
                        <p className="reply-username">
                            <img
                                className="reply-avatar"
                                src="https://topdanangcity.com/wp-content/uploads/2024/09/avatar-trang-1Ob2zMM.jpg"
                                alt="User Avatar"
                            />
                            {reply?.username}
                        </p>
                        <p className="reply-time">
                            <time pubdate dateTime={reply?.createdAt} title={new Date(reply?.createdAt).toLocaleString()}>
                                {new Date(reply?.createdAt).toLocaleString()}
                            </time>
                        </p>
                    </div>
                    <div className='setting-for-reply'>
                        <button
                            className="reply-settings-button"
                            type="button"
                            onClick={toggleDropdown}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                                <path className='dropdown-btn' d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                            </svg>
                        </button>
                        <div className={`settings-dropdown ${showDropdown ? 'show' : ''}`}>
                            <div className="settings-list">
                                <div>
                                    <a className="settings-item" onClick={handleEditReply}>Edit</a>
                                </div>
                                <div>
                                    <a className="settings-item" onClick={() => onDeleteReply(reply._id)}>Remove</a>
                                </div>
                                <div><a className="settings-item">Report</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="reply-text">{reply?.reply}</p>
            </div>
        </div>
    );
}

export default Reply;
