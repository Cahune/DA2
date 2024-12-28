import React, { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import LoadingSpinner from '../../../components/loading-spinner/LoadingSpinner';
import Navbar from '../../navbar/Navbar';

import './accountManagement.css';

const AccountManagement = () => {
  const [selectedMenu, setSelectedMenu] = useState('Thông tin cá nhân');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'example@gmail.com',
    dateOfBirth: '1990-01-01',
    phone: '0123456789',
    gender: 'Nam',
  });

  const [isEditing, setIsEditing] = useState(false); // Chuyển trạng thái chỉnh sửa ra ngoài
  const [tempFormData, setTempFormData] = useState({ ...formData }); // Dữ liệu tạm thời khi chỉnh sửa

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempFormData({ ...tempFormData, [name]: value });
  };

  const handleEditClick = () => {
    setTempFormData({ ...formData }); // Sao chép dữ liệu hiện tại
    setIsEditing(true); // Bật chế độ chỉnh sửa
  };

  const handleCancelClick = () => {
    setTempFormData({ ...formData }); // Reset lại dữ liệu ban đầu
    setIsEditing(false); // Tắt chế độ chỉnh sửa
  };

  const handleSaveClick = () => {
    setFormData({ ...tempFormData }); // Lưu thay đổi
    setIsEditing(false); // Tắt chế độ chỉnh sửa
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Thông tin cá nhân':
        return (
          <div className="personal-info">
            <h2>Thông tin cá nhân</h2>
            {!isEditing ? (
              <div>
                <p><strong>Họ và tên:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Ngày sinh:</strong> {formData.dateOfBirth}</p>
                <p><strong>Số điện thoại:</strong> {formData.phone}</p>
                <p><strong>Giới tính:</strong> {formData.gender}</p>
                <button className="edit-button" onClick={handleEditClick}>
                  Edit
                </button>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label>Họ và tên:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={tempFormData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={tempFormData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày sinh:</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={tempFormData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    name="phone"
                    value={tempFormData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính:</label>
                  <select
                    name="gender"
                    value={tempFormData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="action-buttons">
                  <button className="cancel-button" onClick={handleCancelClick}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={handleSaveClick}>
                    Save changes
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'Đổi mật khẩu':
        return <h1>Đổi mật khẩu</h1>;
      case 'Xóa tài khoản':
        return <h1>Xóa tài khoản</h1>;
      case 'Giúp đỡ':
        return <h1>Giúp đỡ</h1>;
      default:
        return <h1>Chọn một mục để hiển thị nội dung</h1>;
    }
  };

  return (
    <div className="manage-bg">
      <Navbar />
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Cài đặt</h2>
          </div>
          <ul className="sidebar-menu">
            <li
              className="menu-item"
              onClick={() => handleMenuClick('Thông tin cá nhân')}
            >
              <span>Thông tin cá nhân</span>
            </li>
            <li
              className="menu-item"
              onClick={() => handleMenuClick('Đổi mật khẩu')}
            >
              <span>Đổi mật khẩu</span>
            </li>
            <li
              className="menu-item"
              onClick={() => handleMenuClick('Xóa tài khoản')}
            >
              <span>Xóa tài khoản</span>
            </li>
            <li
              className="menu-item"
              onClick={() => handleMenuClick('Giúp đỡ')}
            >
              <span>Giúp đỡ</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="contend-account">
          {loading ? <LoadingSpinner /> : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
