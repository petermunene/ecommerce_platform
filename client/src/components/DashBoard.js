import React, { useEffect, useState } from "react";
import { fetchProducts, addCartItem } from "../api";
import { FaShoppingCart, FaCheckCircle, FaBars } from "react-icons/fa";
import NavBar from "./NavBar";

const ads = [
  { text: "🎉 Big Sale Today! Free delivery on all orders!", bg: "#ffd700" },
  { text: "🔥 New Arrivals in Fashion & Electronics!", bg: "#ff9999" },
  { text: "🚚 Fast & Secure M-Pesa Payments!", bg: "#b3f0ff" },
];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cartIds, setCartIds] = useState(new Set());
  const [productId, setProductId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    fetchProducts()
      .then(resp => {
        const list = Array.isArray(resp) ? resp : resp.products;
        setAllProducts(list);
        setProducts(list);
      })
      .catch(err => alert(err.message));
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen || productId ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen, productId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex(i => (i + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = async (product) => {
    const res = await addCartItem({
      product_name: product.product_name,
      amount: 1,
      price: product.price,
      product_id: product.id,
      image_url: product.image_url,
    });
    if (res.error) alert(res.error);
    else {
      alert("Added to cart!");
      setCartIds(prev => new Set(prev).add(product.id));
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(s => !s);
  };

  const closeOverlay = () => {
    setSidebarOpen(false);
    setProductId(null);
  };

  const selectedProduct = products.find(p => p.id === productId);

  return (
    <div style={{ background: "grey", minHeight: "100vh", paddingBottom: 60 }}>
      <NavBar setProducts={setProducts} />

      <div style={{ padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "1.1rem", backgroundColor: ads[adIndex].bg, transition: "background-color 1s" }}>
        {ads[adIndex].text}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", padding: "10px" }}>
        <button onClick={toggleSidebar} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <FaBars size={24} />
        </button>
      </div>

      {(sidebarOpen || productId) && (
        <div onClick={closeOverlay} style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1002
        }} />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-260px",
          height: "100%",
          width: 250,
          background: "#fff",
          boxShadow: sidebarOpen ? "2px 0 10px rgba(0,0,0,0.4)" : "none",
          transition: "left 0.3s",
          zIndex: 1006,
          overflowY: "auto"
        }}
      >
        <div style={{
          backgroundColor: "#213547",
          color: "#fff",
          padding: "20px",
          fontWeight: "bold",
          fontSize: "1.2rem",
          borderBottom: "1px solid #ccc"
        }}>
          Menu
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {["My Activity", "My Shop", "all", "shoes", "kids", "fashion", "electronics"].map((c, i) => (
            <li
              key={i}
              onClick={() => {
                if (c === "My Activity") window.location.href = "/cart";
                else if (c === "My Shop") window.location.href = "/seller";
                else {
                  setProducts(
                    c === "all"
                      ? allProducts
                      : allProducts.filter(p =>
                          p.product_name.toLowerCase().includes(c.toLowerCase())
                        )
                  );
                }
                closeOverlay();
              }}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                color: "#222",
                fontWeight: "500",
                borderBottom: "1px solid #eee"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f2f2f2"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* All Products Displayed Individually */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          flexWrap: "wrap",
          padding: 30
        }}
      >
        {products.map(product => (
          <div
          key={product.id}
          style={{
            minWidth: "260px",
            maxWidth: "360px",
            flex: "1 0 260px",
            cursor: "pointer"
          }}
          onClick={() => setProductId(product.id)}
        >
          <div
            style={{
              border: "1px solid #ccc",
              background: "linear-gradient(135deg, #fff9f0, #f0f9ff)",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderRadius: 10,
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            <img
              src={product.image_url || "https://via.placeholder.com/300"}
              alt=""
              style={{
                height: 200,
                width: "100%",
                objectFit: "contain",
                backgroundColor: "#fff",
                padding: "12px",
                imageRendering: "auto",
                borderBottom: "1px solid #eee"
              }}
            />
            <div style={{ padding: 16 }}>
              <h4 style={{ fontSize: "1.1rem", margin: "0 0 6px", color: "#1a1a1a" }}>
                {product.product_name}
              </h4>
              <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: 6 }}>
                {(product.description || "").slice(0, 60)}...
              </p>
              <p style={{
                fontWeight: "bold",
                color: "#2c3e50",
                backgroundColor: "#e2f7dc",
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "4px"
              }}>
                Ksh {product.price}
              </p>
            </div>
          </div>
        </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          onClick={closeOverlay}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1008
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              maxWidth: 500,
              width: "90%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              position: "relative"
            }}
          >
            <button
              onClick={closeOverlay}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#f44336",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: 5,
                cursor: "pointer"
              }}
            >
              X
            </button>
            <h2>{selectedProduct.product_name}</h2>
            <img
              src={selectedProduct.image_url || "https://via.placeholder.com/200"}
              alt=""
              style={{ width: "100%", height: 250, objectFit: "cover" }}
            />
            <p>{selectedProduct.description}</p>
            <p><strong>Price:</strong> Ksh {selectedProduct.price}</p>
            {!cartIds.has(selectedProduct.id) ? (
              <button
                onClick={() => addToCart(selectedProduct)}
                style={{
                  marginTop: 10,
                  padding: "10px 20px",
                  background: "darkgreen",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                <FaShoppingCart style={{ marginRight: 5 }} />
                Add to Cart
              </button>
            ) : (
              <p style={{ marginTop: 10, color: "green", fontWeight: "bold" }}>
                <FaCheckCircle style={{ marginRight: 5 }} /> In Cart
              </p>
            )}
          </div>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: "20px 10px", backgroundColor: "#213547", color: "#fff" }}>
        <div style={{ fontSize: "0.95rem" }}>
          &copy; {new Date().getFullYear()} MallMarket. All rights reserved.
        </div>
        <div style={{ marginTop: 5, fontSize: "0.85rem" }}>
          Built with ❤️ in Kenya
        </div>
      </footer>
    </div>
  );
}
