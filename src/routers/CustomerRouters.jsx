import Home from "../customer/pages/home/Home";
import Login from "../customer/pages/login-register/login/Login";
import Signup from "../customer/pages/login-register/signup/Signup";
import Search  from "../customer/pages/search-result/Search";
// import ReservationPage from "../customer/pages/reservation/ReservationPage";
// import Bookings from "../customer/bookings/Bookings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthContext, useAuth } from "../context/AuthContext";
// import AuthProvider from "../context/AuthContext";
// import { useContext } from "react";
// import OAuth2RedirectHandler from "../customer/oauth2/OAuth2RedirectHandler";

function CustomerRouters() {
  return (
    <div>
      
       
          {/* <BrowserRouter> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search/:id" element={<Search />} />
            {/* <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />  */}
          </Routes>
          {/* </BrowserRouter> */}
        
    </div>
  )
}

export default CustomerRouters;