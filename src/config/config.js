const mongoose = require('mongoose');
const { Schema } = mongoose;


const placeSchema = new mongoose.Schema({
    name: String,
    images: [String]
    // Các trường khác trong collection 'place' có thể được thêm vào đây
});
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên đầy đủ của người dùng
    email: { type: String, required: true, unique: true }, // Email phải là duy nhất
    password: { type: String, required: true } // Mật khẩu đã được mã hóa
});

const commentSchema = new Schema({
    placeId: {
        type: Schema.Types.ObjectId,
        ref: 'place', // Tham chiếu tới nơi bạn lấy từ bộ sưu tập place
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    replies: [{
        username: {
            type: String,
            required: true,
        },
        commentId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        reply: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const taxiSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, // Tên của hãng taxi
    phoneNumber: { 
        type: String, 
        required: true 
    }, // Số điện thoại của taxi
    places: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Place' // Tham chiếu đến collection Place
        }
    ] 
});

const Place = mongoose.model('Place', placeSchema);
            
const Comment = mongoose.model('Comment', commentSchema);

const User = mongoose.model('User', userSchema);

const Taxi = mongoose.model('Taxi', taxiSchema);

module.exports = {
    User,
    Comment,
    Place,
    Taxi
};
