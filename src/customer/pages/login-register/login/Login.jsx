import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../components/loading-spinner/LoadingSpinner';
import Navbar from '../../../navbar/Navbar';
import './login.css'; 
import './login-responsive.css'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);  // State to manage "Remember me"
  const navigate = useNavigate();

  // Load saved email and password if remember me is selected
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true); // Automatically check the "Remember me" checkbox
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Reset thông báo lỗi
    setErrorMessage({ email: '', password: '' });
  
    let valid = true;
  
    if (email.trim() === '') {
      setErrorMessage(prev => ({ ...prev, email: 'Vui lòng nhập email.' }));
      valid = false;
    }
  
    if (password.trim() === '') {
      setErrorMessage(prev => ({ ...prev, password: 'Vui lòng nhập mật khẩu.' }));
      valid = false;
    }
  
    if (valid) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const result = await response.json();
        setLoading(false);
  
        if (response.ok) {
          // Đăng nhập thành công
          const { name } = result;
          setUserName(name); // Store the user's name in state
          localStorage.setItem('userFullName', name);
         
      
          // Lưu email và mật khẩu nếu "Nhớ mật khẩu" được chọn
          if (rememberMe) {
            localStorage.setItem('email', email);
            localStorage.setItem('password', password); // Lưu mật khẩu (cẩn thận với dữ liệu nhạy cảm)
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
          }
          
          navigate('/');
        } else {
          // Xử lý thông báo lỗi từ backend cho email hoặc mật khẩu
          if (result.error) {
            if (result.error === "Không tìm thấy người dùng") {
              setErrorMessage(prev => ({ ...prev, email: result.error }));
            } else if (result.error === "Sai mật khẩu") {
              setErrorMessage(prev => ({ ...prev, password: result.error }));
            } else {
              setErrorMessage(prev => ({ ...prev, email: 'Có lỗi xảy ra. Vui lòng thử lại.' }));
            }
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Lỗi trong quá trình đăng nhập:", error);
        setErrorMessage(prev => ({ ...prev, email: 'Có lỗi xảy ra. Vui lòng thử lại.' }));
      }
    }
  
    setButtonClicked(true);
  };
  

  const componentRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setErrorMessage({ email: '', password: '' });
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className='login-bg'>
      <Navbar />
      <div>
        {loading && <LoadingSpinner />}
        <div className="login">
          <div className="login-container">
            <div className="login-header">
              Sign in
            </div>
            <form onSubmit={handleSubmit}> 
              <div className="form-outline">
                <label className="form-label">
                  Email address <span className="star-force">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className='text-input'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errorMessage.email && buttonClicked && <div className="error-message" ref={componentRef}>
                  <div className="icon-up"><FontAwesomeIcon icon={faCaretUp} /></div>{errorMessage.email}
                </div>}
              </div>

              <div className="form-outline">
                <label className="form-label">
                  Password <span className="star-force">*</span>
                </label>
                <div className='login-password'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className='password-setting'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
                {errorMessage.password && buttonClicked && <div className="error-message" ref={componentRef}>
                  <div className="icon-up"><FontAwesomeIcon icon={faCaretUp} /></div>{errorMessage.password}
                </div>}
              </div>

              <div className="form-check-login">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)} // Toggle remember me
                />
                <label className="form-check-label">
                  Remember password
                </label>
              </div>

              <button type="submit" className="login-btn">Login</button>

              <p className="text-login">
                Don't have an account? {' '}
                <Link to="/signup">
                  <u style={{ color: 'black', fontWeight: 'bold' }}>Register here</u>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
