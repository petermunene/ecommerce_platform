import React, { useState } from "react";
import { fetchProducts } from "../api";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function NavBar({ setProducts }) {
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [customer] = useState(localStorage.getItem("customer") === "true");
  const [seller] = useState(localStorage.getItem("seller") === "true");
  const navigate = useNavigate();

  const menuItemStyle = {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#333',
    backgroundColor: '#fff',
    transition: 'background-color 0.2s ease-in-out'
  };

  function checkIfCustomerLoggedin() {
    navigate(customer ? '/cart' : '/customerLogin');
  }

  function checkIfSellerLoggedin() {
    navigate(seller ? '/seller' : '/sellerLogin');
  }

  async function filter(searchText) {
    try {
      setSearch(searchText);
      const products = await fetchProducts();
      const newFiltered = products.filter(product =>
        product.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setProducts(newFiltered);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 30px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
      backgroundColor: '#1c2e4a',
      color: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      flexWrap: 'wrap',
    }}>

      <h1 style={{ fontWeight: 'bold', color: '#ffffff', marginRight: '30px' }}>MallMarket</h1>

      <input
        type='text'
        placeholder='Search products...'
        value={search}
        onChange={(e) => filter(e.target.value)}
        className="navbar-search"
        style={{
          flex: 1,
          maxWidth: '600px',
          padding: '10px 15px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '1rem',
          marginRight: '20px'
        }}
      />

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button
          onClick={checkIfCustomerLoggedin}
          className="hide-sm"
          style={{
            backgroundColor: '#f2f2f2',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          My Activity
        </button>

        <button
          onClick={checkIfSellerLoggedin}
          className="hide-sm"
          style={{
            backgroundColor: '#f2f2f2',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          My Shop
        </button>

        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowOptions(!showOptions)}
            className="account-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f2f2f2',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              fontWeight: 500,
              color: '#000'
            }}
          >
            <FaUserCircle style={{ marginRight: '8px' }} />
            Account ▾
          </div>

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
                width: '220px',
                zIndex: 100
              }}
            >
              <div style={{ padding: '12px 16px', fontWeight: 'bold', background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                Sign Up
              </div>
              <div
                style={hoveredItem === 'csignup' ? { ...menuItemStyle, backgroundColor: '#f0f0f0' } : menuItemStyle}
                onMouseEnter={() => setHoveredItem('csignup')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => { setShowOptions(false); navigate('/customerSignup'); }}
              >
                Customer Sign Up
              </div>
              <div
                style={hoveredItem === 'ssignup' ? { ...menuItemStyle, backgroundColor: '#f0f0f0' } : menuItemStyle}
                onMouseEnter={() => setHoveredItem('ssignup')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => { setShowOptions(false); navigate('/sellerSignup'); }}
              >
                Seller Sign Up
              </div>

              <div style={{ padding: '12px 16px', fontWeight: 'bold', background: '#f9f9f9', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                Login
              </div>
              <div
                style={hoveredItem === 'clogin' ? { ...menuItemStyle, backgroundColor: '#f0f0f0' } : menuItemStyle}
                onMouseEnter={() => setHoveredItem('clogin')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => { setShowOptions(false); navigate('/customerLogin'); }}
              >
                Customer Login
              </div>
              <div
                style={hoveredItem === 'slogin' ? { ...menuItemStyle, backgroundColor: '#f0f0f0' } : menuItemStyle}
                onMouseEnter={() => setHoveredItem('slogin')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => { setShowOptions(false); navigate('/sellerLogin'); }}
              >
                Seller Login
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          .hide-sm {
            display: none !important;
          }
          .navbar-search {
            max-width: 160px !important;
            font-size: 0.85rem !important;
            padding: 6px 10px !important;
            margin-right: 10px !important;
          }
          .account-btn {
            padding: 6px 10px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
