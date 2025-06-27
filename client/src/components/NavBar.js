import React, { useState } from "react";
import { fetchProducts } from "../api";
import { useNavigate } from "react-router-dom";
export default function NavBar({setProducts }) {
  const [search,setSearch]=useState('')
  const [showOptions, setShowOptions] = useState(false);
  const [hover,setHover]=useState(false)
  const [customer, setCustomer] = useState(localStorage.getItem("customer") === "true");
  const [seller,setSeller]=useState(localStorage.getItem("seller") === "true")
  const Navigate=useNavigate()
  const dropdownItemStyle = {
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '0.9rem',
    color: '#333',
  };
  
  const dropdownItemHoverStyle = {
    ...dropdownItemStyle,
    backgroundColor: '#f0f0f0',
  };
  function checkIfCustomerLoggedin(){
    if (customer){
        Navigate('/cart')
    }
    else{
        Navigate('/customerLogin')
    }
  }
  function checkIfSellerLoggedin(){
    if(seller){
        Navigate('/seller')
    }
    else{
        Navigate('/sellerLogin')
    }
  }
  async function filter(search) {
    try{
     setSearch(search)
     const products =await fetchProducts()
     const new_filtered= products.filter((product)=>product.product_name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase()))
     setProducts(new_filtered)
     setProducts(new_filtered)
    } 
     catch(err){
         alert(err.message)
     }
  }
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'row',
        
        alignItems: 'center',
        padding: '15px 30px',
        background:'linear-gradient(to bottom , rgba(245, 245, 220, 0.66),darkgreen)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
      
      <h1>Amazing Shops</h1>
      
      <input
        type='text'
        placeholder='Enter product name to search'
        value={search}
        onChange={(e) => filter(e.target.value)}
        style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            flex: 1,
            margin: '0 20px',
            maxWidth: '700px',
          }}
      />
      <div style={{gap:'5 px'}}>
        <h4
          onClick={checkIfCustomerLoggedin}
          style={{
            cursor:'pointer',
            color: '#333',
            textDecoration: 'none',
            padding: '8px 16px',
            marginRight: '10px',
            display: 'inline-block',
            borderRadius: '8px',
            backgroundColor: '#eee',
            fontWeight: 500,
            transition: 'background 0.3s',
          }}
        >
          My Activity
        </h4> 
              
        <h4
          onClick={checkIfSellerLoggedin}
          style={{
            cursor:'pointer',
            color: '#333',
            textDecoration: 'none',
            padding: '8px 16px',
            marginRight: '10px',
            display: 'inline-block',
            borderRadius: '8px',
            backgroundColor: '#eee',
            fontWeight: 500,
            transition: 'background 0.3s',
          }}
        >
          My Shop
        </h4>
     </div>
     
      <div style={{ position: 'relative' }}>

      <h3
        onClick={() => setShowOptions(!showOptions)}
        style={{
            padding: '10px 20px',
            display: 'inline-block',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ccc',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s',
            fontWeight: '500',
          }}
        >
        Account ▾
        </h3>

        {showOptions && (
        <div
        style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
            zIndex: 100,
            overflow: 'hidden',
            width: '220px',
          }}
        >
            <div style={{
                borderBottom: '1px solid #eee',
                padding: '12px 16px',
                fontWeight: 'bold',
                background: '#f7f7f7',
                color: '#444',
                fontSize: '0.95rem',
                }}>
            Sign Up
            </div>
            <div
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            style= {hover?dropdownItemHoverStyle:dropdownItemStyle}
            onClick={() => { setShowOptions(false); Navigate('/customerSignup'); }}
            >
            Customer Sign Up
            </div>
            <div
            style={dropdownItemStyle}
            onClick={() => { setShowOptions(false); Navigate('/sellerSignup'); }}
            >
            Seller Sign Up
            </div>

            <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '10px', fontWeight: 'bold', background: '#fafafa' }}>
            Login
            </div>
            <div
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            style= {hover?dropdownItemHoverStyle:dropdownItemStyle}
            onClick={() => { setShowOptions(false); Navigate('/customerLogin'); }}
            >
            Customer Login
            </div>
            <div
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            style= {hover?dropdownItemHoverStyle:dropdownItemStyle}
            onClick={() => { setShowOptions(false); Navigate('/sellerLogin'); }}
            >
            Seller Login
            </div>
        </div>
        )}
     
        
      </div>

    </div>
  );
}
