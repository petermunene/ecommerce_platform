const API_BASE= process.env.REACT_APP_API_URL;

async function request(endpoint, method="GET", body=null ) {
    const headers = {
        'Content-Type':'application/json'
    }
    const res = await fetch(`${API_BASE}${endpoint}`,{
        method,
        headers,
        body:body ? JSON.stringify(body):null,
        credentials:'include'
    })
    const data= await res.json().catch (()=>({}))
    if (res.ok){
        return data
    }
    else{
        return { error :data.error || 'error with fetch request'}
    }
    
}

export async function customerSignup(username, password) {
  return request("/signup/customer", "POST", {username, password});
}

export async function sellerSignup(username, password) {
  return request("/signup/seller", "POST", {username, password});
}

export async function customerLogin(username, password) {
  return request("/login/customer", "POST", {username, password});
}

export async function sellerLogin(username, password) {
  return request("/login/seller", "POST", {username, password});
}

export async function customerLogout() {
  return request("/logout/customer", "GET");
}

export async function sellerLogout() {
  return request("/logout/seller", "GET");
}

export async function fetchProducts() {
  return request("/products", "GET");
}

export async function fetchSellerProducts() {
  return request("/myproducts", "GET");
}

export async function addProduct(product) {
  return request("/myproducts", "POST", product);
}

export async function updateProduct(id, updates) {
  return request(`/myproducts/${id}`, "PATCH", updates);
}

export async function deleteProduct(id) {
  return request(`/myproducts/${id}`, "DELETE");
}

export async function fetchCustomerOrders() {
  return request("/orders", "GET");
}

export async function placeOrder(order) {
  return request("/orders", "POST", order);
}

export async function fetchSellerOrders() {
  return request("/myorders", "GET");
}

export async function fetchCartItems() {
  return request("/cart_items", "GET");
}

export async function addCartItem(item) {
  return request("/cart_items", "POST", item);
}

export async function updateCartItem(id, updates) {
  return request(`/cart_items/${id}`, "PATCH", updates);
}

export async function deleteCartItem(id) {
  return request(`/cart_items/${id}`, "DELETE");
}
export async function deleteOrder(id){
  return request(`/orders/${id}`,'DELETE');
}
