import React, { useState } from "react";
import CustomerSignup from "./components/auth/CustomerSignup";
import CustomerLogin from "./components/auth/CustomerLogin";
import ProductList from "./components/products/ProductList";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{padding:"2rem"}}>
      <h1>My E-commerce Platform</h1>

      {!user && (
        <>
          <CustomerSignup />
          <CustomerLogin onLogin={setUser} />
        </>
      )}

      {user && (
        <div>
          <h2>Welcome, {user.username}!</h2>
          <ProductList />
        </div>
      )}
    </div>
  );
}

export default App;
