from app import db,bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Numeric
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
class Customer(db.Model,SerializerMixin):
    __tablename__='customers'
    serialize_rules = ('-orders.customer', '-cart_items.customer')
    id = db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String,nullable=False,unique=True)
    _hash_password=db.Column(db.String,nullable=False)

    orders = db.relationship("Order", back_populates="customer",cascade='all,delete-orphan')
    cart_items = db.relationship('CartItem',back_populates='customer',cascade='all,delete-orphan')
    products = association_proxy('orders', 'product')
    @hybrid_property
    def hash_password(self):
        raise AttributeError(' you cannot access the password directly')
    @hash_password.setter
    def hash_password(self,password):
        self._hash_password = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._hash_password, password)
class Seller(db.Model,SerializerMixin):
    __tablename__='sellers'
    serialize_rules = ('-products.seller',)
    id = db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String, nullable=False)
    _hash_password=db.Column(db.String,nullable=False)
    
    products=db.relationship('Product',back_populates='seller',cascade="all,delete-orphan")
    @property
    def orders(self):
        return [order for product in self.products for order in product.orders]

    @hybrid_property
    def hash_password(self):
        raise AttributeError('you cannot access the password directly')
    @hash_password.setter
    def hash_password(self,password):
        self._hash_password = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._hash_password, password)

class Product(db.Model,SerializerMixin):
    __tablename__='products'
    serialize_rules = ('-seller.products', '-orders.product', '-cart_items.product')
    id = db.Column(db.Integer,primary_key=True)
    product_name=db.Column(db.String,nullable=False)
    description = db.Column(db.String)
    quantity=db.Column(db.Integer, default=1)
    price = db.Column(Numeric(10,2),nullable=False)
    seller_id = db.Column(db.Integer,db.ForeignKey('sellers.id',ondelete='CASCADE'))
    
    orders=db.relationship('Order', back_populates='product')
    seller=db.relationship('Seller',back_populates='products')
    cart_items = db.relationship('CartItem',back_populates='product')
class Order(db.Model,SerializerMixin):
    __tablename__='orders'
    serialize_rules = ('-customer.orders', '-product.orders')
    id = db.Column (db.Integer,primary_key=True)
    product_name=db.Column(db.String)
    amount = db.Column(db.Integer,nullable=False)
    price = db.Column(Numeric(10,2))
    customer_id=db.Column(db.Integer,db.ForeignKey('customers.id',ondelete="CASCADE"))
    product_id=db.Column(db.Integer,db.ForeignKey('products.id',ondelete="CASCADE"))

    customer = db.relationship('Customer',back_populates='orders')
    product = db.relationship('Product',back_populates='orders')

class CartItem(db.Model,SerializerMixin):
    __tablename__='cart_items'
    serialize_rules = ('-customer.cart_items', '-product.cart_items')
    id = db.Column (db.Integer,primary_key=True)
    product_name=db.Column(db.String)
    amount = db.Column(db.Integer,nullable=False)
    price = db.Column(Numeric(10,2))
    customer_id=db.Column(db.Integer,db.ForeignKey('customers.id',ondelete="CASCADE"))
    product_id=db.Column(db.Integer,db.ForeignKey('products.id',ondelete="CASCADE"))

    customer = db.relationship('Customer',back_populates='cart_items')
    product = db.relationship('Product',back_populates='cart_items')






