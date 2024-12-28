
import { useEffect, useState } from "react";
import Comment from '../commentDetail/CommentDetail';
import "./comment-form.css";

const CommentForm = ({ placeId }) => { // Nhận placeId từ props
    const [comments, setComments] = useState([]); // Danh sách bình luận
    const [comment, setComment] = useState("");   // Bình luận mới
    const [username, setUsername] = useState(localStorage.getItem('userFullName') || ""); // Lấy username từ localStorage
    const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar') || ''); // Lấy avatar nếu có
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || "");
    
    const handleReply = async (commentId, reply) => {
        if (!reply.trim()) {
            alert("Bình luận không được để trống!");
            return;
        }

        if (!username) {
            alert("Vui lòng đăng nhập để bình luận!");
            return; // Ngừng thực hiện nếu chưa đăng nhập
        }

        try {
            const response = await fetch(`https://da2-ghy9.onrender.com/api/comments/${commentId}/reply`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username,
                  reply,
                }),
            });              
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log("Phản hồi đã tạo:", data);
    
            // Cập nhật danh sách bình luận để bao gồm phản hồi mới
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, replies: [...comment.replies, data.newReply] }
                        : comment
                )
            );
        } catch (error) {
            console.error("Lỗi khi tạo phản hồi:", error);
        }
    };
       
    const handleEditReply = async (replyId, newReply, commentId) => {
        const commentToEdit = comments.find(comment => comment._id === commentId);
        
        if (!commentToEdit) {
            alert("Bình luận không tồn tại.");
            return;
        }
    
        const replyToEdit = commentToEdit.replies.find(reply => reply._id === replyId);
        if (!replyToEdit) {
            alert("Phản hồi không tồn tại.");
            return;
        }
    
        // Kiểm tra nếu người dùng không phải là chủ sở hữu của phản hồi
        if (replyToEdit.username !== username && userRole !== "admin") {
            alert("Bạn chỉ có thể chỉnh sửa phản hồi của chính mình!");
            return;
        }
    
        try {
            const response = await fetch(`https://da2-ghy9.onrender.com/api/comments/reply/${replyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reply: newReply }),
            });
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log("Phản hồi đã chỉnh sửa:", data);
    
            // Cập nhật lại danh sách phản hồi
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            replies: comment.replies.map((reply) =>
                                reply._id === replyId ? { ...reply, reply: newReply } : reply
                            ),
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa phản hồi:", error);
        }
    };

    
    const handleDeleteReply = async (replyId, commentId) => {
    const comment = comments.find(comment => comment._id === commentId);
    
    // Kiểm tra nếu phản hồi tồn tại trong bình luận
    const replyToDelete = comment?.replies.find(reply => reply._id === replyId);
    if (!replyToDelete) {
        alert("Phản hồi không tồn tại.");
        return;
    }

    // Kiểm tra quyền xóa (chỉ cho phép xóa phản hồi của chính mình hoặc của admin)
    if (userRole !== "admin" && replyToDelete.username !== username) {
        alert("Bạn chỉ có thể xóa phản hồi của chính mình!");
        return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phản hồi này không?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`https://da2-ghy9.onrender.com/api/comments/reply/${replyId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        // Cập nhật lại danh sách bình luận sau khi xóa phản hồi
        setComments((prevComments) =>
            prevComments.map((comment) => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.filter(reply => reply._id !== replyId),
                    };
                }
                return comment;
            })
        );
    } catch (error) {
        console.error("Lỗi khi xóa phản hồi:", error);
    }
};
      
    const handleEditComment = async (commentId, newComment) => {
        const commentToEdit = comments.find(comment => comment._id === commentId);
        
        if (!commentToEdit) {
            alert("Bình luận không tồn tại.");
            return;
        }
    
        // Kiểm tra nếu người dùng không phải là chủ sở hữu của bình luận
        if (commentToEdit.username !== username) {
            alert("Bạn chỉ có thể chỉnh sửa bình luận của chính mình!");
            return;
        }
    
        try {
            const response = await fetch(`https://da2-ghy9.onrender.com/api/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ comment: newComment }),
            });
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log("Bình luận đã chỉnh sửa:", data);
    
            // Cập nhật danh sách bình luận bằng cách thay thế bình luận đã chỉnh sửa
            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId ? { ...comment, comment: newComment } : comment
                )
            );
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa bình luận:", error);
        }
    };
          
    const handleDeleteComment = async (commentId) => {
        const commentToDelete = comments.find(c => c._id === commentId);
        console.log("id", commentId);
    
        // Kiểm tra xem comment có tồn tại
        if (!commentToDelete) {
            alert("Bình luận không tồn tại.");
            return;
        }
    
        // Nếu người dùng không phải admin, chỉ cho phép xóa bình luận của chính họ
        if (userRole !== "admin" && commentToDelete.username !== username) {
            alert("Bạn chỉ có thể xóa bình luận của chính mình!");
            return;
        }
    
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`https://da2-ghy9.onrender.com/api/comments/${commentId}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            setComments((prev) => prev.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
        }
    };


    
    // Lấy danh sách bình luận khi component được mount
    useEffect(() => {
        const fetchComments = async () => {
            if (!placeId) {
                console.error("Thiếu placeId");
                return;
            }

            try {
                const response = await fetch(`https://da2-ghy9.onrender.com/api/comments/${placeId}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setComments(data); // Cập nhật danh sách bình luận
            } catch (error) {
                console.error("Lỗi khi lấy bình luận:", error);
            }
        };

        fetchComments();
    }, [placeId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Kiểm tra nếu người dùng chưa đăng nhập
        if (!username) {
            alert("Vui lòng đăng nhập để bình luận!");
            return; // Ngừng thực hiện nếu chưa đăng nhập
        }
    
        if (!placeId) {
            alert("Thiếu ID địa điểm!");
            return;
        }
    
        try {
            const response = await fetch(`https://da2-ghy9.onrender.com/api/comments/${placeId}/createComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment,
                    username
                }),
            });
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log("Bình luận đã tạo:", data);
            // Thêm bình luận mới vào danh sách
            setComments((prev) => [...prev, data.newComment]);
            setComment(''); // Reset lại bình luận
        } catch (error) {
            console.error("Lỗi khi tạo bình luận:", error);
        }
    };
    

    return (
        <section className="comment-form">
            <div className="comment-form-container">
                <div className="comment-form-label">
                    <h2 className="comment-form-label-text">Discussion ({comments.length})</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="comment-form-text">
                        <textarea 
                            id="comment-form" 
                            rows="6" 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="cmt-text-write"
                            placeholder="Write a comment..." 
                            required 
                        />
                    </div>
                    <button type="submit" className="cmt-submit-btn">
                        Post comment
                    </button>
                </form>

                {comments.map(comment => (
                    <Comment 
                        key={comment._id} 
                        comment={comment} 
                        onEdit={handleEditComment} 
                        onDelete={handleDeleteComment}
                        onReply={handleReply}
                        onEditReply={handleEditReply}
                        onDeleteReply={handleDeleteReply}
                    />
                ))}
            </div>
        </section>
    );
};

export default CommentForm;
