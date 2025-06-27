import React, { useState } from "react";
import { Route,Routes} from "react-router-dom";
import CustomerSignup from "./components/auth/CustomerSignup";
import CustomerLogin from "./components/auth/CustomerLogin";
import ProductList from "./components/products/ProductList";
import SellerLogin from "./components/auth/SellerLogin";
import SellerSignup from "./components/auth/SellerSignUp";
import NavBar from "./components/NavBar";
import Dashboard from "./components/DashBoard";
import Cart from "./components/Cart";
function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{padding:"2rem"}}>
    
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/customerLogin' element={<CustomerLogin/>} />
        <Route path='/customerSignup' element={<CustomerSignup/>} />
        <Route path='/sellerLogin' element={<SellerLogin/>} />
        <Route path='/sellerSignup' element={<SellerSignup/>} />
      </Routes>
     
    </div>
  );
}

export default App;
