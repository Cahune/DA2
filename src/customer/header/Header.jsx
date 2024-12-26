import {
    faXmark,
    faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import "./header-responsive.css";
import { useState, useEffect, useRef } from "react";
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import { useLocation, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import SuggestItem from "./SuggestItem";
import api from "../../api/AxiosConfig";

const Header = () => {
    const [destInput, setDestInput] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const FUSE_OPTIONS = {
        shouldSort: true,
        threshold: 0.5,
        isCaseSensitive: false,//không phân biệt chữ hoa chữ thường
        keys: ['name']
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (destInput.trim() === '') {
            setErrorMessage('Vui lòng nhập điểm đến để bắt đầu tìm kiếm.');// Nếu chưa nhập địa chỉ
            setButtonClicked(true); // Đánh dấu rằng người dùng đã nhấn nút
        } else {
            // Xử lý tìm kiếm khi có đủ điều kiện
            const location = searchSuggestions?.[0] ? encodeURIComponent(searchSuggestions[0].name) : encodeURIComponent(destInput);
            setDestInput(decodeURIComponent(location));//Giải mã chuỗi location vừa mã hóa và đặt nó lại vào biến destInput
            setShowResult(false);
            inputRef.current.blur();//bỏ con chuột ra khỏi ô tìm kiếm
            if (searchSuggestions.length > 0) {
                const selectedId = searchSuggestions[0]._id; // Lấy ID của địa điểm đầu tiên
                navigate(`/search/${selectedId}`); // Điều hướng tới trang chi tiết với ID
            }
        }
    };


    useEffect(() => {
        if (!destInput.trim()) {
            setSearchSuggestions([]);
            return;
        } //nếu trống thì thoát khỏi hàm
        const timeoutId = setTimeout(() => { //trì hoãn việc gọi API
            api.get(`http://localhost:7000/api/place/search-by-name?name=${encodeURIComponent(destInput)}`)
                .then(response => {
                    const fuse = new Fuse([...data, ...response.data], FUSE_OPTIONS);
                    const results = fuse.search(destInput);
                    const suggested = results.map(result => result.item);
                    setSearchSuggestions(suggested); //cập nhật gợi ý 
                });
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [destInput]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonClicked && !event.target.closest('.header-search-btn')) {
                setButtonClicked(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [buttonClicked]);

    const handleHideResult = () => {
        setShowResult(false);
        setButtonClicked(false);
    };

    const componentRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                setErrorMessage(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const inputRef = useRef();
    const handleClear = () => {
        setDestInput('');  // Xóa nội dung ô nhập liệu
        setSearchSuggestions([]);  // Xóa các gợi ý tìm kiếm
        inputRef.current.focus();  // Đặt lại focus vào ô nhập liệu
    }

    const handleClickSuggestion = (dest, id) => {
        if (!!id) { //boolean
            navigate(`/search/${id}`);
        }
        setDestInput(dest);
        setSearchSuggestions([])
        setShowResult(false);
    }

    return (
        <div className="header">
            <div className="header-container">
                <div className="header-introduce">
                    <h1 className="header-title">Khám phá Việt Nam qua những bức hình tuyệt vời</h1>
                    <div className="btn-container">
                        <a class="btn-link" href="/vi/simulations/browse">Đóng góp hình ảnh</a>
                    </div>
                </div>
                <form className="header-search" action="" onSubmit={handleSearch}>
                    <HeadlessTippy
                        placement="bottom"
                        interactive="true"
                        appendTo={() => document.body}
                        visible={showResult && searchSuggestions.length > 0}
                        render={attrs => (
                            <div className="search-result" tabIndex="-1" {...attrs}>
                                <div className="search-result-text">Điểm đến được ưa thích gần đây</div>
                                { searchSuggestions.map((searchSuggestion, index) => (
                                    <SuggestItem key={index} handleClickSuggestion={handleClickSuggestion} searchSuggestion={searchSuggestion} />
                                ))}
                            </div>
                        )}
                        onClickOutside={handleHideResult}
                    >
                    <div className="header-search-item-box">
                        <div className="header-search-item">
                            <div className="header-search-text">
                                <span className="header-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.75 12h18.5c.69 0 1.25.56 1.25 1.25V18l.75-.75H.75l.75.75v-4.75c0-.69.56-1.25 1.25-1.25zm0-1.5A2.75 2.75 0 0 0 0 13.25V18c0 .414.336.75.75.75h22.5A.75.75 0 0 0 24 18v-4.75a2.75 2.75 0 0 0-2.75-2.75H2.75zM0 18v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 0 18zm22.5 0v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0zm-.75-6.75V4.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 4.5v6.75a.75.75 0 0 0 1.5 0V4.5a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 0 1.5 0zm-13.25-3h7a.25.25 0 0 1 .25.25v2.75l.75-.75h-9l.75.75V8.5a.25.25 0 0 1 .25-.25zm0-1.5A1.75 1.75 0 0 0 6.75 8.5v2.75c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75V8.5a1.75 1.75 0 0 0-1.75-1.75h-7z"></path></svg>
                                </span>
                                <input
                                    ref={inputRef}
                                    value={destInput}
                                    type="text"
                                    placeholder="Bạn muốn đến đâu?"
                                    spellCheck={false}
                                    onChange={(event) => setDestInput(event.target.value)}
                                    onFocus={() => setShowResult(true)}
                                    className="header-search-input"
                                />
                                {errorMessage && buttonClicked && <div className="error-message" ref={componentRef}><div className="icon-up"><FontAwesomeIcon icon={faCaretUp} /></div>{errorMessage}</div>}
                            </div>                                                  
                            {!!destInput && (
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    onClick={handleClear}
                                    className="header-icon-close"
                                />
                            )}
                        </div>
                    </div>
                    </HeadlessTippy>
                        <button className="header-search-btn" type="submit">Tìm kiếm</button>
                </form>
            </div>
        </div>
    )
    ;
};

export default Header;