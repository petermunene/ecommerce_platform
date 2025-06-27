# 🛒 Full-Stack E-Commerce Platform

A full-stack e-commerce web application built using Flask (Python) for the backend and React.js for the frontend. It allows sellers to post products and customers to browse, add to cart, and place orders.

---

## 🚀 Features

### Backend (Flask)
- Models:
  - `Customer`
  - `Seller`
  - `Product`
  - `Order` (Many-to-Many with submittable attributes like `amount`, `contact`, `image_url`)
  - `CartItem`
- Two one-to-many relationships:
  - Seller ➝ Products
  - Customer ➝ Orders / CartItems
- One many-to-many relationship with additional attributes:
  - Customer ⬌ Product via `Order` and `CartItem`
- Password hashing using `bcrypt`
- Full CRUD support for `Product`
- Create & Read support for all other resources
- JSON serialization using `sqlalchemy-serializer`

### Frontend (React)
- React Router for navigation between:
  - Home
  - Products
  - Cart
  - Seller Dashboard
- Formik forms with Yup validations:
  - At least one data type validation (e.g., number for quantity/price)
  - At least one format validation (e.g., contact number)
- Fetch API used to connect to Flask backend
- Live cart and order updates

---

## 🧪 Validations

- All form inputs use Formik and Yup for:
  - Required fields (e.g., username, product name, contact)
  - Type enforcement (e.g., number for price and quantity)
  - Format checks (e.g., phone numbers)

---

## 📬 API & Functionality Summary

- `POST /signup` and `POST /login` for user authentication
- `GET /products`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`
- `POST /cart`, `GET /cart`, `DELETE /cart/:id`
- `POST /orders`, `GET /orders`

---

## ✅ Phase 4 Requirements Met

- ✅ Flask API + React frontend  
- ✅ 3+ models  
- ✅ 2 one-to-many relationships  
- ✅ 1 many-to-many with a submittable attribute  
- ✅ Full CRUD on products  
- ✅ Create + Read on all resources  
- ✅ Formik + Yup validations  
- ✅ Format and type checks  
- ✅ 3+ React routes with navigation  
- ✅ Fetch API for client-server communication  

---

## 🧑‍💻 Author

**Peter**  
Full-stack Developer | Phase 4 Project

---