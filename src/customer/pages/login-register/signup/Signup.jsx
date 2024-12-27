import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../components/loading-spinner/LoadingSpinner';
import Navbar from '../../../navbar/Navbar';
import './signup.css'; 
import './signup-responsive.css'; 

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ fullName: '', email: '', password: '', confirmPassword: '', checkbox: '' });
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // Track checkbox state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Reset error messages
    setErrorMessage({ fullName: '', email: '', password: '', confirmPassword: '', checkbox: '' });
  
    let valid = true;
  
    if (fullName.trim() === '') {
      setErrorMessage(prev => ({ ...prev, fullName: 'Vui lòng nhập tên đầy đủ.' }));
      valid = false;
    } else if (fullName.length < 6) {
      setErrorMessage(prev => ({ ...prev, fullName: 'Tên đầy đủ phải có ít nhất 6 ký tự.' }));
      valid = false;
    }

    if (email.trim() === '') {
      setErrorMessage(prev => ({ ...prev, email: 'Vui lòng nhập email.' }));
      valid = false;
    }

    if (password.trim() === '') {
      setErrorMessage(prev => ({ ...prev, password: 'Vui lòng nhập mật khẩu.' }));
      valid = false;
    }else if (password.length < 8) {
      setErrorMessage(prev => ({ ...prev, password: 'Mật khẩu phải có ít nhất 8 ký tự.' }));
      valid = false;
    }

    if (confirmPassword.trim() === '') {
      setErrorMessage(prev => ({ ...prev, confirmPassword: 'Vui lòng nhập lại mật khẩu.' }));
      valid = false;
    }

    if (password !== confirmPassword) {
      setErrorMessage(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp.' }));
      valid = false;
    }
    
    if (!isChecked) {
      setErrorMessage(prev => ({ ...prev, checkbox: 'Vui lòng chấp nhận điều khoản dịch vụ.' }));
      valid = false;
    }
  
    if (valid) {
      setLoading(true);
      try {
        const response = await fetch('https://da2-ghy9.onrender.com/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password }),
        });
  
        const result = await response.json();
        setLoading(false);
  
        if (response.ok) {
          navigate('/login'); // Navigate to login page on successful registration
        } else {
          if (result.field === 'fullName') {
            setErrorMessage(prev => ({ ...prev, fullName: result.error }));
          }
          if (result.field === 'email') {
            setErrorMessage(prev => ({ ...prev, email: result.error }));
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error during signup:", error);
        setErrorMessage(prev => ({ ...prev, email: 'An error occurred. Please try again.' }));
      }
    }
  
    setButtonClicked(true);
  };

  const componentRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setErrorMessage({ fullName: '', email: '', password: '', confirmPassword: '', checkbox: '' });
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className='signup-bg'>
      <Navbar />
      <div>
        {loading && <LoadingSpinner />}
        <div className="signup">
          <div className="signup-container">
            <div className="signup-header">
              <p>CREATE AN ACCOUNT</p>
            </div>
            <form onSubmit={handleSubmit}> 
              <div className="form-outline">
                <label className="form-label">
                  Full Name <span className="star-force">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className='text-input'
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
                {errorMessage.fullName && buttonClicked && <div className="error-message" ref={componentRef}>
                  <div className="icon-up"><FontAwesomeIcon icon={faCaretUp} /></div>{errorMessage.fullName}
                </div>}
              </div>

              <div className="form-outline">
                <label className="form-label">
                  Your Email <span className="star-force">*</span>
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
                <div className='signup-password'>
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

              <div className="form-outline">
                <label className="form-label">
                  Repeat Password <span className="star-force">*</span>
                </label>
                <div className='signup-password'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className='password-setting'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-eye"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
                {errorMessage.confirmPassword && buttonClicked && <div className="error-message" ref={componentRef}>
                  <div className="icon-up"><FontAwesomeIcon icon={faCaretUp} /></div>{errorMessage.confirmPassword}
                </div>}
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)} // Update checkbox state
                />
                <label className="form-check-label">
                  I agree all statements in{' '}
                  <a href="#!" className="text-body">
                    <u style={{ color: 'black' }}>Terms of service</u>
                  </a>
                </label>
                {errorMessage.checkbox && buttonClicked && <div className="error-message-last" ref={componentRef}>
                  <div className="icon-up"><FontAwesomeIcon icon={faCaretUp} /></div>{errorMessage.checkbox}
                </div>}
              </div>

              <button type="submit" className="signup-btn">Register</button>

              <p className="text-login">
                Already have an account?{' '}
                <Link to="/login">
                  <u style={{ color: 'black', fontWeight: 'bold' }}>Login here</u>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
