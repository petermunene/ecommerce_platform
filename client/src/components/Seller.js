import React, { useEffect, useState } from "react";
import {
  fetchSellerProducts,
  fetchSellerOrders,
  sellerLogout,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaPlusCircle, FaTrash, FaEdit } from "react-icons/fa";

export default function Seller({ setSeller }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [viewOrders, setViewOrders] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    quantity: "",
    description: "",
    contact: "",
    image_url: "/images/shopping.png",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadSellerData();
  }, []);

  async function loadSellerData() {
    try {
      const prods = await fetchSellerProducts();
      setProducts(Array.isArray(prods) ? prods : prods.products || []);

      const ords = await fetchSellerOrders();
      const normalizedOrders = Array.isArray(ords)
        ? ords
        : Array.isArray(ords.orders)
        ? ords.orders
        : ords.orders
        ? [ords.orders]
        : [];

      setOrders(normalizedOrders);
    } catch (err) {
      alert("Error loading data: " + err.message);
    }
  }

  const handleLogout = () => {
    sellerLogout();
    localStorage.removeItem("seller");
    setSeller(false);
    navigate("/");
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      price: "",
      quantity: "",
      description: "",
      contact: "",
      image_url: "/images/shopping.png",
    });
    setFormMode(null);
    setSelectedProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    alert("Product deleted");
    loadSellerData();
  };

  const handleEdit = (product) => {
    setFormData({ ...product });
    setSelectedProduct(product);
    setFormMode("edit");
  };

  const handleAddProduct = () => {
    resetForm();
    setFormMode("add");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      if (formMode === "add") {
        await addProduct(data);
        alert("Product added successfully");
      } else if (formMode === "edit" && selectedProduct) {
        await updateProduct(selectedProduct.id, data);
        alert("Product updated successfully");
      }

      resetForm();
      loadSellerData();
    } catch (err) {
      alert("Failed to submit: " + err.message);
    }
  };

  return (
    <div style={{ backgroundColor: "grey", minHeight: "100vh" }}>
      <NavBar />
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          Seller Dashboard
        </div>
        <button onClick={handleLogout} style={buttonStyle("darkred")}>
          <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
        </button>
      </div>

      <div style={navTabsStyle}>
        <button style={buttonStyle()} onClick={() => setViewOrders(false)}>
          My Products
        </button>
        <button style={buttonStyle()} onClick={() => setViewOrders(true)}>
          Orders ({orders.length})
        </button>
        <button style={buttonStyle("darkgreen")} onClick={handleAddProduct}>
          <FaPlusCircle style={{ marginRight: 6 }} /> Add Product
        </button>
        <button style={buttonStyle("#213547")} onClick={() => navigate("/")}>
          Dashboard
        </button>
      </div>

      <div style={gridStyle}>
        {viewOrders ? (
          orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} style={cardStyle}>
                <img
                  src={order.image_url}
                  alt={order.product_name}
                  style={imgStyle}
                />
                <h3>{order.product_name}</h3>
                <p>Qty: {order.amount}</p>
                <p>Total: Ksh {order.price}</p>
              </div>
            ))
          ) : (
            <p>No orders placed.</p>
          )
        ) : (
          products.map((product) => (
            <div key={product.id} style={cardStyle}>
              <img
                src={product.image_url}
                alt={product.product_name}
                style={imgStyle}
              />
              <h3>{product.product_name}</h3>
              <p>Ksh {product.price}</p>
              <p>Qty: {product.quantity}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <button
                  onClick={() => handleDelete(product.id)}
                  style={buttonStyle("darkred", "6px")}
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  style={buttonStyle("darkgreen", "6px")}
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {formMode && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>{formMode === "edit" ? "Edit Product" : "Add Product"}</h2>
            <form
              onSubmit={handleFormSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <input
                type="text"
                placeholder="Product Name"
                value={formData.product_name}
                onChange={(e) =>
                  setFormData({ ...formData, product_name: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price (Ksh)"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone No"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
              />
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <button type="submit" style={buttonStyle("darkgreen")}>
                  {formMode === "edit" ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={buttonStyle("gray")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const navTabsStyle = {
  display: "flex",
  gap: 10,
  padding: "10px 20px",
  flexWrap: "wrap",
};

const gridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  justifyContent: "center",
  padding: 20,
};

const cardStyle = {
  background: "#fff",
  padding: 15,
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  width: 220,
  textAlign: "center",
};

const imgStyle = {
  height: 150,
  width: "100%",
  objectFit: "cover",
  borderRadius: 8,
  marginBottom: 10,
};

const buttonStyle = (bg = "#333", pad = "8px 12px") => ({
  backgroundColor: bg,
  color: "#fff",
  border: "none",
  padding: pad,
  borderRadius: 6,
  cursor: "pointer",
});

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalBox = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  minWidth: 350,
  maxWidth: "90vw",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
};
