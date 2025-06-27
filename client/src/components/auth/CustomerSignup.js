import React, { useState } from "react";
import { customerSignup } from "../../api";
import { useNavigate } from "react-router-dom";
export default function CustomerSignup({setCustomer}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMsg] = useState("");
  const Navigate=useNavigate()
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res=await customerSignup(username, password);
      const msg='sign-up succesiful'
      setMsg(msg)
      if (msg){
        localStorage.removeItem("customer");
        localStorage.setItem("customer", "true");
        setCustomer(true)
        Navigate('/cart')
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
<div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          height:'400px'
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' , gap:'20px'}}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Customer Signup</h2>

          <input
            name="username"
            value={username}
            placeholder="Username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />

          <input
            name="password"
            value={password}
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />

          {message && (
            <p style={{ marginBottom: '15px', color: '#f44336', textAlign: 'center' }}>{message}</p>
          )}

          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
