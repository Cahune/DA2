import "./navbar.css";
import "./navbar-responsive.css";
import Logo from '../../images/Logo.jpg';
import Logo2 from '../../images/Logo2.png';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [userFullName, setUserFullName] = useState(localStorage.getItem('userFullName') || ''); // Retrieve user name from localStorage
    const navigate = useNavigate();

    const getInitials = (name) => {
        const firstWord = name.split(' ')[0];
        return firstWord ? firstWord[0].toUpperCase() : '';
    };
    
    const getRandomColor = () => {
        const predefinedColors = ["#b16e4b", "#f24444", "#f39c12", "#1abc9c", "#f35ea3"];
        const randomColorIndex = Math.floor(Math.random() * predefinedColors.length);
        return predefinedColors[randomColorIndex];
    };
    
    const avatarBackgroundColor = getRandomColor();

    const renderAvatar = (name, backgroundColor) => (
        <div className="nav-user-img" style={{ backgroundColor, color: "#fff" }}>
            {getInitials(name)}
        </div>
    );

    const handleLogoutClick = () => {
        localStorage.removeItem('userFullName');  // Clear user data from localStorage on logout
        setUserFullName('');
        navigate('/');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <div className={isScrolled ? "home-navbar scrolled" : "home-navbar"}>
            <div className="home-nav-container">
                <div className="home-logo-left">
                    <img className="home-nav-logo" src={Logo} alt="TravelWeb Logo" onClick={handleLogoClick} />
                    <img className="home-nav-logo2" src={Logo2} alt="TravelWeb Logo" onClick={handleLogoClick} />
                </div>
            
                <div className="nav-items">
                    <a href="/business/register" className="nav-icon" style={{ textDecoration: 'none' }} target="not_blank">
                        TÀI TRỢ
                    </a>

                    {/* Show HeadlessTippy if user is logged in */}
                    {userFullName ? (
                        <HeadlessTippy
                            placement="bottom"
                            trigger="click"
                            interactive="true"
                            appendTo={() => document.body}
                            render={attrs => (
                                <div className="nav-menu-logout" tabIndex="-1" {...attrs}>
                                    <div className="nav-user-logout" onClick={() => navigate('/')}>
                                        <div className="user-logout-text">Lịch sử bình luận</div>
                                    </div>
                                    <div className="nav-user-logout" onClick={() => navigate(`/accountManagenment`)}>
                                        <div className="user-logout-text">Quản lý tài khoản</div>
                                    </div>
                                    <div className="nav-user-logout" onClick={handleLogoutClick}>
                                        <div className="user-logout-text">Đăng xuất</div>
                                    </div>
                                </div>
                            )}
                        >
                            <div className="nav-user-button">
                                {renderAvatar(userFullName, avatarBackgroundColor)}
                                <span className="nav-user-account">{userFullName}</span>
                            </div>
                        </HeadlessTippy>
                    ) : (
                        // If not logged in, show the sign-up and login buttons
                        <div className="nav-items-btn">
                            <button className="nav-button" onClick={() => navigate("/signup")}>Đăng ký</button>
                            <button className="nav-button" onClick={() => navigate("/login")}>Đăng nhập</button>
                            <button className="nav-button-avt" onClick={() => navigate("/login")}>
                                <FontAwesomeIcon icon={faUser} />
                            </button>
                        </div>
                    )}
                </div>              
            </div>
        </div>
    );
};

export default Navbar;
