import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <p>Error: {err}</p>;

  return (
    <div>
      <h2>Available Products</h2>
      {products.length === 0 && <p>No products found.</p>}
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <strong>{p.product_name}</strong>: {p.description} — ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
