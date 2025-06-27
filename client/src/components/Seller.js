import React, { useEffect, useState } from "react";
import { fetchSellerProducts,sellerLogout,addProduct,updateProduct,deleteProduct,fetchSellerOrders} from "../api";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
export default function Seller({setSeller}) {
  const [products,setProducts]=useState([])
  const [sellersOrders,setSellersOrders]=useState([])
  const [filtered_orders,setFilteredOrders]=useState([])
  const [filtered_products,setFilteredProducts]=useState([])
  const [productForm,setShowForm]=useState(false)
  const [viewOrders,setViewOrders]=useState(false)
  const [activeId,setActiveId]=useState(false)
  const [product_name, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image_url, setImageUrl] = useState('/images/shopping.png');
  const [description,setDescription]=useState('')
  const [contact,setContact]=useState('')
  
  const Navigate = useNavigate();
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetchSellerProducts();
        
        if(Array.isArray(response)){
            setProducts(response);
            setFilteredProducts(response)
        }
        else if (response.products && Array.isArray(response.products)){
            setProducts(response.products);
            setFilteredProducts(response.products.length)
        }
        else{
            setProducts([]);
            setFilteredProducts([]);
        }
        const res= await fetchSellerOrders();
        
        if(Array.isArray(res)){
            setSellersOrders(res);
            setFilteredOrders(res)
        }
        else if (res.orders && Array.isArray(res.orders)){
            setSellersOrders(res.orders)
            setFilteredOrders(res.orders)
            
        }
        else{
            setSellersOrders([]);
            setFilteredOrders([]);
        }
      } catch (err) {
        alert(err.message);
      }
    };
  
    fetchSellerData();
  }, []);
  async function deleteItem(id){
    try{
        deleteProduct(id)
        alert('product deleted')
        const updated=await fetchSellerOrders()
        setProducts(updated)
    }catch(err) {
       alert(err.message)
    }
  }
  const selectedItem = (products.length>0) ? products.find((p)=>p.id===activeId):null
  const handleLogout = () => {
    sellerLogout()
    localStorage.removeItem("seller");
    
    setSeller(false);
    Navigate('/');
  };
  return (
    <>
    <NavBar setProducts={setProducts} />
    <div style={{backgroundColor:'darkgreen'}} onClick={()=>setActiveId(false)}>
         <div className="category-filter" style={{ marginBottom: '30px' }}>
                <ul>
                    <li
                     className="filter-item"
                     style={{backgroundColor:'darkred'}}
                     onClick={handleLogout}>
                        Log Out
                    </li>
                    {[
                    'My-Products', `Placed-Orders : ${sellersOrders.length}`,'Add New Product','DashBoard'
                    ].map((category) => (
                    <li
                        key={category}
                        onClick={() =>{
                            if(category.toLowerCase().startsWith('my-products')){
                                setViewOrders(false)
                            }
                            else if (category.toLowerCase().startsWith('placed-orders')){
                                setViewOrders(true)
                            }
                            else if(category.toLowerCase().startsWith('add new product')){
                                setShowForm(!productForm)
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
            background:'linear-gradient(to right ,  #f5f5dc,darkgreen)',
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            padding: "20px",
        }}
        >
            {productForm && (
                <div
                onClick={() => setActiveId(!activeId)}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100vw",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1001,
                }}
            />)}
            {viewOrders ? (
                sellersOrders.length > 0 ? (
                    sellersOrders.map(order => (
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
                        src={order.image_url || "/images/shopping.png"}
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
                ) :  (products.length>0 ?(
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
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 10px" }}>
                                <svg viewBox="0 0 36 36" width="100%" height="100%">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#eee"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="green"
                                    strokeWidth="2"
                                    strokeDasharray={`${product.quantity * 10}, 100`}
                                    strokeLinecap="round"
                                />
                                </svg>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color: "black"
                                    }}
                                    >
                                    {product.quantity}
                                </div>
                            </div>
                            <h3 style={{ fontSize: "1.1rem", margin: "5px 0" }}>{product.product_name}</h3>
                            <h3 style={{ color: "gray" }}>
                                Quantity: {product.quantity}
                            </h3>
                            <h3>
                                <b style={{ color: "darkgreen" }}>ksh</b>: {product.price}
                            </h3>
                            <button
                                onClick={()=>{deleteItem(product.id)}}
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
                            Delete Product
                            </button><br/>
                            <button
                                onClick={() =>
                                    setActiveId(activeId === product.id ? null : product.id)
                                }
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 12px',
                                    backgroundColor: 'darkgreen',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                }}
                                >
                            edit
                            </button>
                            </div>
                        ))
                ):(<p>No products found</p>))}
            {selectedItem && (
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
                    minWidth: "350px",
                    }}
                >
                    <h2 style={{ marginBottom: "15px" }}>Edit Product</h2>
                    <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const newProduct = {
                        contact:contact,
                        product_name,
                        price: parseFloat(price),
                        quantity: parseInt(quantity),
                        description,
                        image_url,
                        };
                        try {
                        await updateProduct(newProduct);
                        alert("Product updated successfully!");
                        setActiveId(null);
                        // optionally refresh product list
                        const updated = await fetchSellerProducts();
                        setProducts(updated);
                        setFilteredProducts(updated);
                        } catch (err) {
                        alert("Failed to add product: " + err.message);
                        }
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                    >
                    <img
                        src={selectedItem.image_url}
                        alt={selectedItem.product_name}
                        style={{
                        height: "200px",
                        width: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={selectedItem.product_name}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="number"
                        placeholder="Price (Ksh)"
                        value={selectedItem.price}
                        onChange={(e) => setPrice(e.target.value)}
                        min={0}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={selectedItem.description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={selectedItem.quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                     <input
                        type="text"
                        placeholder="phone No"
                        value={selectedItem.contact}
                        onChange={(e) => setContact(parseInt(e.target.value))}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={selectedItem.image_url}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                        type="submit"
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "darkgreen",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                        >
                        Edit Product
                        </button>
                        <button
                        type="button"
                        onClick={() => setActiveId(null)}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "gray",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                        >
                        Cancel
                        </button>
                    </div>
                    </form>
                </div>
                )}
             {productForm && (
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
                    minWidth: "350px",
                    }}
                >
                    <h2 style={{ marginBottom: "15px" }}>Add New Product</h2>
                    <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const newProduct = {
                        product_name,
                        contact:contact,
                        price: parseFloat(price),
                        quantity: parseInt(quantity),
                        description,
                        image_url,
                        };
                        try {
                        await addProduct(newProduct);
                        alert("Product added successfully!");
                        setShowForm(false);
                        // optionally refresh product list
                        const updated = await fetchSellerProducts();
                        setProducts(updated);
                        setFilteredProducts(updated);
                        } catch (err) {
                        alert("Failed to add product: " + err.message);
                        }
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                    >
                    <img
                        src={ image_url? image_url : "/images/shopping.png"}
                        alt={product_name}
                        style={{
                        height: "200px",
                        width: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={product_name}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="number"
                        placeholder="Price (Ksh)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min={0}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min={1}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        placeholder="phone No"
                        value={contact}
                        onChange={(e) => setContact(parseInt(e.target.value))}
                        min={1}
                        required
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={image_url}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                        type="submit"
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "darkgreen",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                        >
                        Add Product
                        </button>
                        <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "gray",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                        >
                        Cancel
                        </button>
                    </div>
                    </form>
                </div>
                )}

        </div>
     
     
    </>
  );
}
