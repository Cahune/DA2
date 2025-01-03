const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require("../config/config"); // Thay thế đường dẫn này với nơi bạn lưu mô hình User và Comment

// Register User
router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Kiểm tra nếu fullName hoặc email đã tồn tại
        const existingUserByName = await User.findOne({ name: fullName });
        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByName) {
            return res.status(400).json({ field: 'fullName', error: "Tên người dùng đã tồn tại. Vui lòng chọn tên khác." });
        }

        if (existingUserByEmail) {
            return res.status(400).json({ field: 'email', error: "Email đã tồn tại. Vui lòng chọn email khác." });
        }

        // Hash mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Lưu người dùng mới
        const newUser = new User({ name: fullName, email: email, password: hashedPassword, role: 'user' });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        console.error("Lỗi trong quá trình đăng ký:", error);
        res.status(500).json({ error: "Có lỗi xảy ra trong quá trình đăng ký." });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Không tìm thấy người dùng" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Sai mật khẩu" });
        }

        res.status(200).json({ message: "Đăng nhập thành công", name: user.name, role: user.role });

    } catch (error) {
        console.error("Lỗi trong quá trình đăng nhập:", error);
        res.status(500).json({ error: "Có lỗi xảy ra trong quá trình đăng nhập." });
    }
});

module.exports = router;
