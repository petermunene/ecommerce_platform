import React, { useEffect, useState } from "react";
import { deleteCartItem,customerLogout, fetchCartItems, fetchCustomerOrders, placeOrder, sellerLogout } from "../api";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
export default function Cart({setCustomer,setSeller}) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [allproducts, setAllProducts]=useState([])
  const [activeId,setActiveId]=useState(null)
  const [quantity,setQuantity]=useState(1)
  const [viewOrders,setViewOrders]=useState(false)
  const [orders,setOrders]=useState([])
  const [count,setCount]=useState(0)
  const [orderCount,setOrderCount]=useState(0)
  const [contact,setContact]=useState('')
  const Navigate =useNavigate()
  useEffect(() => {
    const getProducts=async () =>{
      try {
        const response = await fetchCartItems();
        if(Array.isArray(response)){
            setProducts(response);
            setCount(response.length)
        }
        else if (response.products && Array.isArray(response.products)){
            setProducts(response.products);
            setCount(response.products.length)
        }
        else{
            setProducts([]);
            setCount(null);
        }
        const res=await fetchCustomerOrders()
        if(Array.isArray(res)){
            setOrders(res);
            setOrderCount(res.length)
        }
        else if (res.orders && Array.isArray(res.orders)){
            setOrders(res.orders)
            setOrderCount(res.orders.length)
            
        }
        else{
            setOrders([]);
            setOrderCount(null);
        }
      } catch (err) {
        alert(err.message);
      }
    }
    getProducts();
  }, []);
  

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = productId ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [productId]);
  const selectedItem = (products.length>0)?products.find((p)=>p.id===activeId):null
  const selectedProduct = (products.length>0)?products.find((p) => p.id === productId):null

  async function deleteItem(id) {

  
    try {
      await deleteCartItem(id);
      alert("Item deleted successfully");
      
      const updatedCart = await fetchCartItems();
      setAllProducts(updatedCart);
      setProducts(updatedCart);
      setCount(updatedCart.length)
    } catch (err) {
      alert("Unable to delete item: " + err.message);
    }
  }
//   async function addOrder(product){
//     try {
//         const order = {
//           product_name: product.product_name,
//           amount: 1,
//           price: product.price,
//           product_id: product.id,
//           image_url: product.image_url,
//         };
    
//         const res = await placeOrder(order);
//         const updatedOrders = await fetchCustomerOrders();
//         setOrders(updatedOrders);
//         setOrderCount(updatedOrders.length)
//         if (res.error) {
//           alert(res.error);
//         } 
//       } catch (err) {
//         alert("Something went wrong: " + err.message);
//       }
//   }
  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem('seller')
    sellerLogout()
    customerLogout()
    setCustomer(false);
    setSeller(false)
    Navigate('/');
  }
  return (
    <>
    <NavBar  setProducts={setProducts} />
      <div style={{backgroundColor:'darkblue'}}>
         <div className="category-filter" >
                <ul>
                <li
                    className="filter-item"
                    style={{
                        backgroundColor: 'darkred',
                        color:'white'
                    }}
                     onClick={handleLogout}>
                        Log Out
                    </li>
                    {[
                    `CartItems : ${count}`, `Orders : ${orderCount}`,'DashBoard'
                    ].map((category) => (
                    <li
                        key={category}
                        onClick={() =>{
                            if(category.toLowerCase().startsWith('cartitems')){
                                setViewOrders(false)
                            }
                            else if (category.toLowerCase().startsWith('orders')){
                                setViewOrders(true)
                            }
                            else if (category.toLowerCase()==='dashboard'){
                                Navigate('/')
                            }
                        }
                        

                        }
                        className="filter-item"
                    >
                        {category}
                    </li>
                    ))}
                </ul>
         </div>

      </div>
        <div
        style={{
            background:'linear-gradient(to right ,  darkblue,darkgreen)',
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            padding: "20px",
        }}
        >
        
        
        {productId && activeId && (
            <div
            onClick={() => setProductId(null)}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: "100vw",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1001,
            }}
            />
        )}
            {viewOrders ? (
                orders.length > 0 ? (
                    orders.map(order => (
                    <div
                        key={order.id}
                        style={{
                        width: "220px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        padding: "10px",
                        backgroundColor: "#fff",
                        textAlign: "center",
                        transition: "transform 0.2s",
                        }}
                    >
                        <img
                        src={order.image_url || "https://via.placeholder.com/150"}
                        alt={order.product_name}
                        style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px",
                        }}
                        />
                        <h3>{order.product_name}</h3>
                        <p>Quantity: {order.amount}</p>
                        <p><strong>Total:</strong> Ksh {order.price}</p>
                        
                    </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )
                ) : (products.length > 0 ?(
                    products.map((product) => (
                        <div
                        key={product.id}
        
                        style={{
                            width: "220px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            padding: "10px",
                            backgroundColor: "#fff",
                            textAlign: "center",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.03)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                        >
                        <img
                            onClick={() =>
                                setProductId(productId === product.id ? null : product.id)
                            }
                            src={product.image_url || "https://via.placeholder.com/150"}
                            alt={product.name}
                            style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px",
                            }}
                        />
                        <h3 style={{ fontSize: "1.1rem", margin: "5px 0" }}>{product.product_name}</h3>
                        <h3 style={{ color: "gray" }}>
                            Quantity: {product.amount}
                        </h3>
                        <h3>
                            <b style={{ color: "darkgreen" }}>ksh</b>: {product.price}
                        </h3>
                        <button
                            onClick={()=>{deleteItem(product.id);alert(`${product.id}`)}}
                            style={{
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: 'darkred',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                            >
                        Remove From Cart
                        </button>
                        <button
                            onClick={() =>
                                setActiveId(activeId === product.id ? null : product.id)
                            }
                            style={{
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: 'darkblue',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                            >
                        place Order
                        </button>
                        </div>
                    ))
                ) : (<p>no products found</p>))}
           
        {activeId && selectedItem && (
            <div
                style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                zIndex: 1003,
                minWidth: "300px",
                }}
            >
                <h2>Place Order</h2>
                <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const orderData = {
                    product_name: selectedItem.product_name,
                    contact:selectedItem.contact,
                    amount: quantity,
                    contact: contact,
                    price: (quantity * selectedItem.price).toFixed(2),
                    image_url: selectedItem.image_url,
                    product_id: selectedItem.id,
                    
                    };
                    try {
                    await placeOrder(orderData);
                    alert("Order placed successfully!");
                    const updated = await fetchCustomerOrders();
                    setOrders(updated);
                    setOrderCount(updated.length)
                    setActiveId(null);
                    } catch (err) {
                    alert("Order failed: " + err.message);
                    }
                }}
                >
                <p><strong>Product:</strong> {selectedItem.product_name}</p>
                <p><strong>Unit Price:</strong> Ksh {selectedItem.price}</p>
                <label>
                    Quantity:
                    <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max={selectedItem.amount}
                    style={{ marginLeft: "10px", padding: "5px", width: "60px" }}
                    />
                </label> <br/><br/>
                <label>
                    Contact:
                    <input
                    required
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(parseInt(e.target.value))}
                    style={{ marginLeft: "10px", padding: "5px", width: "70px" }}
                    />
                </label>
                <p><strong>Total:</strong> Ksh {(quantity * selectedItem.price).toFixed(2)}</p>
                <button
                    // onClick={()=>{addOrder(selectedItem)}}
                    type="submit"
                    style={{
                    padding: "8px 12px",
                    backgroundColor: "darkgreen",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    marginRight: "10px",
                    cursor: "pointer",
                    }}
                >
                    Confirm Order
                </button>
                <button
                    onClick={() => setActiveId(null)}
                    type="button"
                    style={{
                    padding: "8px 12px",
                    backgroundColor: "gray",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
                </form>
            </div>
            )}


        {selectedProduct && (
            <div
            style={{
                width: "50vw",
                maxWidth: "600px",
                height: "auto",
                maxHeight: "90vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "20px",
                border: "1px solid #ccc",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                padding: "20px",
                backgroundColor: "#fafafa",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1002,
            }}
            >
            <img
                src={selectedProduct.image_url || "https://via.placeholder.com/200"}
                alt={selectedProduct.name}
                style={{
                height: "200px",
                width: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                }}
            />
            <div style={{ flex: 1 }}>
                <h2>{selectedProduct.product_name}</h2>
                <p style={{ fontSize: "1rem", color: "#555" }}>
                {selectedProduct.description}
                </p>
                <p>
                <strong>Price:</strong> Ksh {selectedProduct.price}
                </p>
                <p>
                <strong>Remaining:</strong> {selectedProduct.quantity}
                </p>
            </div>

            <button
                onClick={() => setProductId(null)}
                style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                }}
            >
                X
            </button>

            </div>
        )}
        </div>
    </>
  );
}
