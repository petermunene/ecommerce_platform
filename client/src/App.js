import React, { useState ,useEffect} from "react";
import { Route,Routes} from "react-router-dom";
import CustomerSignup from "./components/auth/CustomerSignup";
import CustomerLogin from "./components/auth/CustomerLogin";
import SellerLogin from "./components/auth/SellerLogin";
import SellerSignup from "./components/auth/SellerSignUp";
import NavBar from "./components/NavBar";
import Dashboard from "./components/DashBoard";
import Cart from "./components/Cart";
import Seller from "./components/Seller";
function App() {
  const [customer, setCustomer] = useState(localStorage.getItem("customer") === "true");
  const [seller,setSeller]=useState(localStorage.getItem("seller") === "true")
 

  return (
    <div style={{padding:"2rem"}}>
    
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/Navbar' element = {<NavBar />}/>
        <Route path='/cart' element={<Cart setCustomer={setCustomer} setSeller={setSeller}/>} />
        <Route path='/seller' element={<Seller setSeller={setSeller}/>} />
        <Route path='/customerLogin' element={<CustomerLogin setCustomer = {setCustomer}/>} />
        <Route path='/customerSignup' element={<CustomerSignup setCustomer = {setCustomer}/>} />
        <Route path='/sellerLogin' element={<SellerLogin setSeller={setSeller} />} />
        <Route path='/sellerSignup' element={<SellerSignup setSeller={setSeller}/>} />
      </Routes>
     
    </div>
  );
}

export default App;
