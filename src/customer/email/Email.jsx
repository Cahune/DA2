import React from "react";
import "./email.css";
import "./email-responsive.css";

const Email = () => {
  return (
    <div className="mail system-font">
      <h1 className="mailTitle system-font">Save time, save money!</h1>

      <span className="mailDesc system-font">
        Đăng ký và chúng tôi sẽ gửi cho bạn thông tin mới nhất
      </span>
      <form>
        <div className="mailInputContainer system-font mb-2">
          <input
            type="text"
            placeholder="Your Email"
            name="email"
          />
          <button type="submit">Subscribe</button>
          
        </div>
      </form>

    </div>
  );
};

export default Email;
