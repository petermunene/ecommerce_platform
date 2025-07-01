import React, { useEffect, useState } from "react";
import {
  deleteCartItem,
  customerLogout,
  fetchCartItems,
  fetchCustomerOrders,
  placeOrder,
  sellerLogout,
  deleteOrder,
  fetchProducts, // ✅ NEW
} from "../api";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { FaSignOutAlt, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function Cart({ setCustomer, setSeller }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [viewOrders, setViewOrders] = useState(false);
  const [quantityMap, setQuantityMap] = useState({});
  const [contact, setContact] = useState("");
  const [activeProduct, setActiveProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]); // ✅ NEW

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const cart = await fetchCartItems();
        const orderData = await fetchCustomerOrders();
        const allProducts = await fetchProducts(); // ✅ NEW

        const productList = Array.isArray(cart) ? cart : cart.products || [];
        const orderList = Array.isArray(orderData) ? orderData : orderData.orders || [];

        setProducts(productList);
        setOrders(orderList);

        const qMap = {};
        productList.forEach(item => {
          qMap[item.id] = item.amount || 1;
        });
        setQuantityMap(qMap);

        // Filter suggested products
        const suggestions = allProducts.filter(
          p => !productList.some(cartItem =>
            cartItem.product_id === p.product_id || cartItem.id === p.id
          )
        );
        setSuggestedProducts(suggestions);
      } catch (err) {
        alert("Error loading data: " + err.message);
      }
    }

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    customerLogout();
    sellerLogout();
    setCustomer(false);
    setSeller(false);
    navigate("/");
  };

  const handleRemoveItem = async (id) => {
    await deleteCartItem(id);
    const updated = await fetchCartItems();
    setProducts(updated);
  };

  const handlePlaceOrder = async () => {
    const quantity = quantityMap[activeProduct.id] || 1;
    if (!contact) return alert("Please enter your contact number.");
    try {
      await placeOrder({
        product_name: activeProduct.product_name,
        contact,
        amount: quantity,
        price: activeProduct.price * quantity,
        image_url: activeProduct.image_url,
        product_id: activeProduct.product_id || activeProduct.id,
      });
      await deleteCartItem(activeProduct.id);
      const updatedCart = await fetchCartItems();
      const updatedOrders = await fetchCustomerOrders();
      setProducts(updatedCart);
      setOrders(updatedOrders);
      setActiveProduct(null);
      setContact("");
      alert(`Order placed for ${activeProduct.product_name}`);
    } catch (err) {
      alert("Failed to place order: " + err.message);
    }
  };

  const handlePlaceAllOrders = async () => {
    if (!contact) return alert("Please enter your contact number.");
    try {
      for (let product of products) {
        const quantity = quantityMap[product.id] || 1;
        await placeOrder({
          product_name: product.product_name,
          contact,
          amount: quantity,
          price: product.price * quantity,
          image_url: product.image_url,
          product_id: product.product_id || product.id,
        });
        await deleteCartItem(product.id);
      }
      const updatedCart = await fetchCartItems();
      const updatedOrders = await fetchCustomerOrders();
      setProducts(updatedCart);
      setOrders(updatedOrders);
      alert("All orders placed successfully!");
    } catch (err) {
      alert("Failed to place all orders: " + err.message);
    }
  };

  const handleCancelOrder = async (id) => {
    await deleteOrder(id);
    const updated = await fetchCustomerOrders();
    setOrders(updated);
  };

  const calculateTotal = () =>
    products.reduce((sum, item) => sum + (quantityMap[item.id] || 1) * item.price, 0);

  return (
    <div style={{ background: "grey", minHeight: "100vh" }}>
      <NavBar setProducts={setProducts} />
      <div style={topBarStyle}>
        <button onClick={handleLogout} style={btn("darkred")}>
          <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
        </button>
        <div style={topBtnGroup}>
          <button onClick={() => setViewOrders(false)} style={btn("black")}>
            Cart ({products.length})
          </button>
          <button onClick={() => setViewOrders(true)} style={btn("black")}>
            Orders ({orders.length})
          </button>
          <button onClick={() => navigate("/")} style={btn("#213547")}>
            Dashboard
          </button>
        </div>
      </div>

      {!viewOrders ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", padding: 20 }}>
          {/* Cart Items */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: "68%" }}>
            {products.map(product => (
              <div key={product.id} style={cardStyle}>
                <img src={product.image_url} alt={product.product_name} style={imgStyle} />
                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <h3>{product.product_name}</h3>
                  <p>Ksh {Number(product.price).toFixed(2)} each</p>
                  <label>
                    Qty:
                    <input
                      type="number"
                      value={quantityMap[product.id]}
                      onChange={(e) =>
                        setQuantityMap({ ...quantityMap, [product.id]: Number(e.target.value) })
                      }
                      min={1}
                      max={product.amount}
                      style={{ marginLeft: 10, width: 60 }}
                    />
                  </label>
                  <div style={actionRow}>
                    <button onClick={() => handleRemoveItem(product.id)} style={btn("gray", 8)}>
                      Remove
                    </button>
                    <button onClick={() => setActiveProduct(product)} style={btn("green", 8)}>
                      <FaCheckCircle style={{ marginRight: 5 }} /> Place Order
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Suggested Products */}
            {suggestedProducts.length > 0 && (
              <div style={{ marginTop: 30 }}>
                <h3 style={{ marginBottom: 10 }}>You might also like</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {suggestedProducts.map(product => (
                    <div key={product.id} style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      background: "#fff",
                      padding: 10,
                      borderRadius: 8,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      width: "100%",
                      maxWidth: 300
                    }}>
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        style={{ width: 60, height: 60, borderRadius: 6, objectFit: "cover" }}
                      />
                      <div style={{ marginLeft: 10, flex: 1 }}>
                        <p style={{ margin: 0 }}>{product.product_name}</p>
                        <p style={{ margin: "4px 0" }}>Ksh {Number(product.price).toFixed(2)}</p>
                        <button
                          onClick={() => {
                            const newItem = { ...product, id: product.id || Date.now() };
                            setProducts(prev => [...prev, newItem]);
                            setQuantityMap(prev => ({ ...prev, [newItem.id]: 1 }));
                            setSuggestedProducts(prev => prev.filter(p => p.id !== product.id));
                          }}
                          style={btn("orange", 6)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ minWidth: 280, maxWidth: 350, background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
            <h2>Order Summary</h2>
            <hr />
            <p>Total Items: {products.length}</p>
            <p>Subtotal: <strong>Ksh {calculateTotal().toFixed(2)}</strong></p>
            <input
              type="text"
              placeholder="Enter phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 10, marginBottom: 10 }}
            />
            <button onClick={handlePlaceAllOrders} style={{ ...btn("darkgreen", 10), width: "100%" }}>
              <FaCheckCircle style={{ marginRight: 5 }} /> Place All Orders
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, padding: 20, justifyContent: "center" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ ...cardStyle, maxWidth: 500 }}>
              <img src={order.image_url} alt={order.product_name} style={imgStyle} />
              <div style={{ flex: 1, paddingLeft: 20 }}>
                <h3>{order.product_name}</h3>
                <p><strong>Qty:</strong> {order.amount}</p>
                <p><strong>Total:</strong> Ksh {Number(order.price).toFixed(2)}</p>
                <p><strong>Contact:</strong> {order.contact || "N/A"}</p>
                <p style={{ fontSize: "0.85em", color: "#4CAF50" }}>
                  <strong>Estimated Delivery:</strong> 2–3 business days
                </p>
                <button onClick={() => handleCancelOrder(order.id)} style={btn("darkred", 8)}>
                  <MdCancel style={{ marginRight: 6 }} /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {activeProduct && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Place Order</h3>
            <p><strong>{activeProduct.product_name}</strong></p>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantityMap[activeProduct.id]}
              onChange={(e) =>
                setQuantityMap({ ...quantityMap, [activeProduct.id]: Number(e.target.value) })
              }
              min={1}
              max={activeProduct.amount}
              style={{ width: "100%", marginBottom: 10 }}
            />
            <label>Phone Number:</label>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="e.g. 0712345678"
              required
            />
            <p><strong>Total:</strong> Ksh {(quantityMap[activeProduct.id] || 1) * activeProduct.price}</p>
            <div style={{ marginTop: 10 }}>
              <button onClick={handlePlaceOrder} style={btn("darkgreen", 8)}>
                <FaCheckCircle style={{ marginRight: 5 }} /> Confirm
              </button>
              <button onClick={() => setActiveProduct(null)} style={btn("gray", 8)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const btn = (bg, pad = 6) => ({
  backgroundColor: bg,
  color: "#fff",
  border: "none",
  padding: `${pad}px 12px`,
  borderRadius: 6,
  margin: "4px",
  cursor: "pointer",
});

const topBarStyle = {
  padding: 10,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
};

const topBtnGroup = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const actionRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 10,
};

const cardStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  background: "#fff",
  padding: 15,
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  marginBottom: 20,
  width: "100%",
  flexWrap: "wrap",
};

const imgStyle = {
  height: 120,
  width: 120,
  borderRadius: 6,
  objectFit: "cover",
};

const modalOverlay = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 999,
};

const modalBox = {
  background: "#fff",
  padding: 25,
  borderRadius: 8,
  width: 300,
};
