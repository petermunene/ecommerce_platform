import React, { useEffect, useState } from "react";
import { fetchProducts,addCartItem } from "../api";
import { FaShoppingCart, FaCheckCircle} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import NavBar from "./NavBar";
export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [allproducts, setAllProducts]=useState([])
  const [cartIds, setCartIds] = useState(new Set()); 
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetchProducts();
        
        // Check if response is an array (direct products list)
        if (Array.isArray(response)) {
          setAllProducts(response);
          setProducts(response);
        } 
        // Handle object response with products array
        else if (response.products && Array.isArray(response.products)) {
          setAllProducts(response.products);
          setProducts(response.products);
        }
        // Handle unexpected format
        else {
          console.error("Unexpected API response:", response);
          setAllProducts([]);
          setProducts([]);
        }
      } catch (err) {
        alert(err.message);
        setAllProducts([]);
        setProducts([]);
      }
    };
  
    fetchAllProducts();
  }, []);
  async function addToCart(product) {
    try {
      const cartItem = {
        product_name: product.product_name,
        amount: 1,
        price: product.price,
        product_id: product.id,
        image_url: product.image_url,
      };
  
      const res = await addCartItem(cartItem);
  
      if (res.error) {
        alert(res.error);
      } else {
        alert("Added to cart!");
        setCartIds((prev) => new Set(prev).add(product.id)); 
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  }

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = productId ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [productId]);

  const selectedProduct =(products.length>0)
  ? products.find((p) => p.id === productId)
  : null;
  async function handleFilter(search){
    const new_filtered= products.filter((product)=>product.product_name?.toLowerCase().includes(search.toLowerCase()) || product.description?.toLowerCase().includes(search.toLowerCase()))
    setProducts(new_filtered)
  }

 
  return (
    <div >
   <NavBar setProducts={setProducts}/>
      <div style={{backgroundColor:'darkgreen'}}>
         <div className="category-filter" >
                <h3 style={{ color: "white", paddingLeft: "20px" }}>
                    <MdCategory style={{ marginRight: "6px" }} />
                    Browse by Category
                </h3>
                <ul>
                    {[
                    'all', 'shoes', 'kids', 'men fashion', 'utility', 'women fashion',
                    'boys fashion', 'phone', 'computer', 'electronic', 'food'
                    ].map((category) => (
                    <li
                        key={category}
                        onClick={() =>
                        category === 'all'
                            ? setProducts(allproducts)
                            : handleFilter(category)
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
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            padding: "20px",
            background:'linear-gradient(to right , rgba(245, 245, 220, 0.66),darkgreen)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)'
        }}
        >
        
        
        {productId && (
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

        {products.map((product) => (
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
                Amount remaining: {product.quantity}
            </h3>
            <h3>
                <b style={{ color: "darkgreen" }}>ksh</b>: {product.price}
            </h3>
            {!cartIds.has(product.id)? (           
                <button
                    onClick={async () => {
                       try{
                        const res= await addToCart(product);
                       }catch{
                          alert('error adding to cart')
                       }
                    }}
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
                    <FaShoppingCart style={{ marginRight: "5px" }} />
                    Add to Cart
                </button>
            ) :  (
                    <p style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
                     <FaCheckCircle style={{ marginRight: '5px' }} />   In Cart</p>
                )
            }
            <h3>
                <b style={{ color: "darkgreen" }}><BsTelephoneFill style={{ marginRight: "6px", color: "darkgreen" }} />contact</b>: 0{product.contact}
            </h3>
            </div>
        ))}

        {selectedProduct && (
            <div
            style={{
                width: "50vw",
                maxWidth: "600px",
                height: "auto",
                maxHeight: "70vh",
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
                <h2>{selectedProduct.name}</h2>
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
    </div>
  );
}
