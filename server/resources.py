from flask import request, jsonify, session
from flask_restful import Resource
from models import  Customer, Seller, Product, Order, CartItem
from app import db

class CustomerSignUp(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return ({'error':'you must include both username and password'}),422
        user = Customer.query.filter(Customer.username==username).first()
        if user :
            return ({'error':'username already exists'}),422
        new_customer=Customer(username=username)
        new_customer.hash_password=password
        db.session.add(new_customer)
        db.session.commit()
        session['customer_id']=new_customer.id
        session.permanent = True
        return new_customer.to_dict(),201
class SellerSignup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return ({'error':'you must include both username and password'}),422
        user = Seller.query.filter(Seller.username==username).first()
        if user :
            return ({'error':'username already exists'}),422
        new_seller=Seller(username=username)
        new_seller.hash_password=password
        db.session.add(new_seller)
        db.session.commit()
        session['seller_id']=new_seller.id
        session.permanent = True
        return new_seller.to_dict(),201
class CustomerLogin(Resource):
    def post(self):
        data = request.get_json()
        username=data.get('username')
        password=data.get('password')
        if not username or not password:
            return ({'error':'you must include both username and password'}),422
        user = Customer.query.filter(Customer.username==username).first()
        if not user or not user.authenticate(password):
            return ({'error':'user not signed in '}),401
        session['customer_id']=user.id
        session.permanent = True
        return user.to_dict(only=('id','username')),201
class SellerLogin(Resource):
    def post(self):
        data = request.get_json()
        username=data.get('username')
        password=data.get('password')
        if not username or not password:
            return ({'error':'you must include both username and password'}),422
        user = Seller.query.filter(Seller.username==username).first()
        if not user or not user.authenticate(password):
            return ({'error':'user not signed in '}),401
        session['seller_id']=user.id
        session.permanent = True
        return user.to_dict(only=('id','username')),201
class CustomerLogout(Resource):
    def get(self):
        if 'customer_id' in session:
            session.pop('customer_id')
            return '',204
        return {'error':'customer is not logged in'},401
class SellerLogout(Resource):
    def get(self):
        if 'seller_id' in session:
            session.pop('seller_id')
            return '',204
        return {'error':'seller is not logged in'},401
class ProductResource(Resource):
    def get(self):
        products = Product.query.all()
        return [p.to_dict() for p in products],200

class OrderResource(Resource):
    def post(self):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to make orders'},401
        customer_id=session.get('customer_id')
        data = request.get_json()
        product_name = data.get('product_name')
        amount = data.get('amount')
        price = data.get('price')
        contact=data.get('contact')
        image_url=data.get('image_url')
        product_id = data.get('product_id')
        
        if not all([product_name,amount,price,contact,product_id]):
            return {'error':'you must include all details to make an order'},422
        new_order=Order(contact=contact,product_name=product_name, amount=amount, price=price,customer_id=customer_id,image_url=image_url, product_id=product_id)
        db.session.add(new_order)
        db.session.commit()
        return new_order.to_dict(only=('id','product_name', 'amount', 'price')),201
    def get(self):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to view orders'},401
        customer_id = session.get('customer_id')
        customer = Customer.query.get(customer_id)
        orders = customer.orders

        return [o.to_dict(only=('id','product_name','amount','price','image_url','contact'))for o in orders],200
class OrderEdit(Resource):
    def delete(self,id):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to delete an order'},401
        order = Order.query.get(id)
        if not order:
            return {'error':'order is non existent'},422
        db.session.delete(order)
        db.session.commit()
        return '',204
    def patch(self,id):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to update an order'},401
        order = Order.query.get(id)
        if not order:
            return {'error':'order is non existent'},422
        data = request.get_json()
        for key,value in data.items():
            if hasattr(order,key):
                setattr(order,key,value)
        db.session.commit()
        return order.to_dict(only=('id','product_name','amount','price','image_url')),200
class CartItemResource(Resource):
    def post(self):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to add to cart'},401
        customer_id=session.get('customer_id')
        data = request.get_json(force=True)
        product_name = data.get('product_name')
        amount = data.get('amount')
        contact = data.get('contact')
        price = data.get('price')
        product_id = data.get('product_id')
        image_url=data.get('image_url')
        if not all([product_name,amount,amount,price,product_id]):
            return {'error':'you must include all details to make add to cart'},422
        new_cart_item=CartItem(contact=contact,product_name=product_name, amount=amount, price=price,customer_id=customer_id, product_id=product_id,image_url=image_url)
        db.session.add(new_cart_item)
        db.session.commit()
        return new_cart_item.to_dict(only=('id','product_name', 'amount', 'price','image_url','contact')),201
    def get(self):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to view cart_items'},401
        customer_id = session.get('customer_id')
        
        customer = Customer.query.get(customer_id)
        if not customer:
            return {'error':"couldn't find user"},401
        cart_items= customer.cart_items

        return [c.to_dict(only=('product_name','amount','price','image_url','id','contact'))for c in cart_items],200
class CartListItem(Resource):
    def delete(self,id):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to delete a cart_item'},401
        cart_item = CartItem.query.get(id)
        if not cart_item:
            return {'error':'cart_item is non existent'},422
        db.session.delete(cart_item)
        db.session.commit()
        return '',204
    def patch(self,id):
        if 'customer_id' not in session:
            return {'error':'you must be logged in to update a cart_item'},401
        cart_item = CartItem.query.get(id)
        if not cart_item:
            return {'error':'cart_item is non existent'},422
        data = request.get_json()
        for key,value in data.items():
            if hasattr(cart_item,key):
                setattr(cart_item,key,value)
        db.session.commit()
        return cart_item.to_dict(only=('id','product_name','amount','price','image_url')),200
class ProductList(Resource):
    def post(self):
        if 'seller_id' not in session:
            return {'error':'you must be logged in to add a product'},401
        data = request.get_json()
        product_name=data.get('product_name')
        description=data.get('description')
        quantity=data.get('quantity')
        contact=data.get('contact')
        price = data.get('price')
        image_url = data.get('image_url')
        seller_id=session.get('seller_id')
        if not all([product_name,description,quantity,price]):
            return {'error':'you must include all details to add a product'},422
        new_product=Product(contact=contact,product_name=product_name,description=description,quantity=quantity,price=price,seller_id=seller_id,image_url=image_url)
        db.session.add(new_product)
        db.session.commit()
        return new_product.to_dict(),200
    def get(self):
        if 'seller_id' not in session:
            return {'error':'you must be logged in to view your products'},401
        seller_id=session.get('seller_id')
        seller=Seller.query.get(seller_id)
        products=seller.products
        if not products:
            return {'error':'no products'},422
        return  [product.to_dict(only=('id', 'product_name','contact', 'price', 'image_url', 'quantity', 'description')) for product in products],200
class SellerOrder(Resource):
    def get(self):
        if 'seller_id' not in session:
            return {'error':'you must be logged in to get all the orders for your products'},401
        seller_id=session.get('seller_id')
        seller=Seller.query.get(seller_id)
        products=seller.products
        orders=[]
        if products:
            for p in products :
                for order in p.orders:
                    orders.append(order)
        return [o.to_dict(only=('id','product_name', 'amount', 'price', 'image_url','contact')) for o in orders],200
class SellerEdit(Resource):
    def delete(self,id):
        if 'seller_id' not in session:
            return {'error':'you must be logged in to delete a product'},401
        seller_id=session.get('seller_id')
        seller=Seller.query.get(seller_id)
        product = next((p for p in seller.products if p.id==id),None)
        if not product:
            return {'error':'product not found '},422
        db.session.delete(product)
        db.session.commit()
        return '',204
    def patch(self,id):
        if 'seller_id' not in session:
            return {'error':'you must be logged in to update a product'},401
        seller_id=session.get('seller_id')
        seller=Seller.query.get(seller_id)
        product = next((p for p in seller.products if p.id==id),None)
        if not product:
            return {'error':'product not found '},422
        data = request.get_json()
        for key,value in data.items():
            if hasattr(product,key):
                setattr(product,key,value)
        db.session.commit()
        return product.to_dict(),200