const express = require("express");
const router = express.Router();
const { Comment } = require("../config/config"); 

router.post("/comments/:placeId/createComment", async (req, res) => {
  try {
    const { placeId } = req.params; // Nhận placeId từ URL
    const { username, comment } = req.body;

    const newComment = new Comment({
      placeId,
      username,
      comment,
    });

    await newComment.save();
    res.status(201).json({ message: "Bình luận được tạo thành công", newComment });
  } catch (error) {
    console.error("Lỗi khi tạo bình luận:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi tạo bình luận" });
  }
});

// Get all comments for a specific place
router.get("/comments/:placeId", async (req, res) => {
  const { placeId } = req.params;
  try {
    // Tìm tất cả bình luận của một địa điểm cụ thể
    const comments = await Comment.find({ placeId: placeId });

    if (comments.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bình luận nào cho địa điểm này." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi lấy bình luận." });
  }
});

// Add a reply to a comment
router.post("/comments/:commentId/reply", async (req, res) => {
  try {
      const { commentId } = req.params;

      const { username, reply } = req.body;

      const comment = await Comment.findById(commentId);
      if (!comment) {
          return res.status(404).json({ message: "Không tìm thấy bình luận" });
      }

      const newReply = {
          username,
          commentId: comment._id,
          reply,
          createdAt: new Date(),
      };

      comment.replies.push(newReply);
      await comment.save();

      res.status(201).json({ message: "Phản hồi đã được thêm thành công", newReply });
  } catch (error) {
      console.error("Lỗi khi phản hồi bình luận:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi phản hồi bình luận." });
  }
});

// Xóa bình luận
router.delete("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log("id là ", commentId)
    // Tìm và xóa bình luận theo ID
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    res.status(200).json({ message: "Bình luận đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi xóa bình luận." });
  }
});

// Chỉnh sửa bình luận
router.put("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    // Tìm bình luận và cập nhật nội dung
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    res.status(200).json({ message: "Bình luận đã được cập nhật", updatedComment });
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa bình luận:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi chỉnh sửa bình luận." });
  }
});

// Chỉnh sửa phản hồi
router.put("/comments/reply/:replyId", async (req, res) => {
  try {
    const { replyId } = req.params;
    const replyObjectId = new mongoose.Types.ObjectId(replyId); // Sử dụng new

    const { reply } = req.body;

    // Tìm và cập nhật phản hồi
    const comment = await Comment.findOne({ "replies._id": replyObjectId });
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    }

    const replyToUpdate = comment.replies.id(replyObjectId);
    replyToUpdate.reply = reply;
    await comment.save();

    res.status(200).json({ message: "Phản hồi đã được cập nhật", reply: replyToUpdate });
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa phản hồi:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi chỉnh sửa phản hồi." });
  }
});

// Xóa phản hồi
router.delete("/comments/reply/:replyId", async (req, res) => {
  try {
      const { replyId } = req.params;

      // Chuyển đổi replyId thành ObjectId
      const replyObjectId = new mongoose.Types.ObjectId(replyId); // Sử dụng new

      // Tìm và xóa phản hồi theo ID
      const comment = await Comment.findOne({ "replies._id": replyObjectId });

      if (!comment) {
          return res.status(404).json({ message: "Không tìm thấy phản hồi" });
      }

      // Xóa phản hồi bằng cách sử dụng pull
      comment.replies = comment.replies.filter(reply => reply._id.toString() !== replyId);
      
      // Lưu lại comment sau khi đã cập nhật
      await comment.save();

      res.status(200).json({ message: "Phản hồi đã được xóa thành công" });
  } catch (error) {
      console.error("Lỗi khi xóa phản hồi:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi xóa phản hồi." });
  }
});

module.exports = router;
