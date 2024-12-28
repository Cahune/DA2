import Home from "../customer/pages/home/Home";
import Login from "../customer/pages/login-register/login/Login";
import Signup from "../customer/pages/login-register/signup/Signup";
import Search  from "../customer/pages/search-result/Search";
import AccountManagement from "../customer/pages/account-management/accountManagement";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function CustomerRouters() {
  return (
    <div>
      
       
          {/* <BrowserRouter> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search/:id" element={<Search />} />
            <Route path="/accountManagenment" element={<AccountManagement />} />
            {/* <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />  */}
          </Routes>
          {/* </BrowserRouter> */}
        
    </div>
  )
}

export default CustomerRouters;