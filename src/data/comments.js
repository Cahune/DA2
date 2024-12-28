const express = require("express");
const router = express.Router();
const { Comment } = require("../config/config"); // Model Comment

// Tạo một bình luận mới
router.post("/:placeId/createComment", async (req, res) => {
  try {
    const { placeId } = req.params;
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

// Lấy tất cả bình luận của một địa điểm
router.get("/:placeId", async (req, res) => {
  try {
    const { placeId } = req.params;
    const comments = await Comment.find({ placeId });

    if (comments.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bình luận nào cho địa điểm này." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi lấy bình luận." });
  }
});

// Chỉnh sửa một bình luận
router.put("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

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

// Xóa một bình luận
router.delete('/:commentId', async (req, res) => {
    try {
    const { commentId } = req.params;

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

// Thêm phản hồi vào bình luận
router.post("/:commentId/reply", async (req, res) => {
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
    console.error("Lỗi khi thêm phản hồi:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi thêm phản hồi." });
  }
});

// Chỉnh sửa phản hồi
router.put("/reply/:replyId", async (req, res) => {
  try {
    const { replyId } = req.params;
    const { reply } = req.body;

    const comment = await Comment.findOne({ "replies._id": replyId });
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    }

    const replyToUpdate = comment.replies.id(replyId);
    replyToUpdate.reply = reply;
    await comment.save();

    res.status(200).json({ message: "Phản hồi đã được cập nhật", reply: replyToUpdate });
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa phản hồi:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi chỉnh sửa phản hồi." });
  }
});

// Xóa phản hồi
router.delete("/reply/:replyId", async (req, res) => {
  try {
    const { replyId } = req.params;

    const comment = await Comment.findOne({ "replies._id": replyId });
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    }

    comment.replies = comment.replies.filter((reply) => reply._id.toString() !== replyId);
    await comment.save();

    res.status(200).json({ message: "Phản hồi đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa phản hồi:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi xóa phản hồi." });
  }
});

module.exports = router;
