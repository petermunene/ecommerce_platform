from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_cors import CORS

import os

app = Flask(__name__)
app.secret_key = "muriukimunene"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"

CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
api = Api(app)

from resources import (
    CustomerSignUp, SellerSignup, CustomerLogin, SellerLogin,
    CustomerLogout, SellerLogout, ProductResource, ProductList,
    SellerEdit, OrderResource, OrderEdit, SellerOrder,
    CartItemResource, CartListItem
)

# Auth
api.add_resource(CustomerSignUp, '/signup/customer')
api.add_resource(SellerSignup, '/signup/seller')
api.add_resource(CustomerLogin, '/login/customer')
api.add_resource(SellerLogin, '/login/seller')
api.add_resource(CustomerLogout, '/logout/customer')
api.add_resource(SellerLogout, '/logout/seller')

# Products
api.add_resource(ProductResource, '/products')
api.add_resource(ProductList, '/myproducts')
api.add_resource(SellerEdit, '/myproducts/<int:id>')

# Orders
api.add_resource(OrderResource, '/orders')
api.add_resource(OrderEdit, '/orders/<int:id>')
api.add_resource(SellerOrder, '/myorders')

# Cart
api.add_resource(CartItemResource, '/cart_items')
api.add_resource(CartListItem, '/cart_items/<int:id>')


if __name__ == '__main__':
    app.run(debug=True)



