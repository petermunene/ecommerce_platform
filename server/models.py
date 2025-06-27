from app import db,bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Numeric
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
class Customer(db.Model,SerializerMixin):
    __tablename__='customers'
    serialize_rules = ('-orders.customer', '-cart_items.customer','-products.customers')
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
    serialize_rules = ('-products.seller','-orders')
    id = db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String, nullable=False)
    _hash_password=db.Column(db.String,nullable=False)
    
    products=db.relationship('Product',back_populates='seller',cascade="all,delete-orphan")
    # @property
    # def orders(self):
    #     return [order for product in self.products for order in product.orders]

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
    serialize_rules = ('-seller.products', '-orders.product', '-cart_items.product','-orders.customer.orders')
    id = db.Column(db.Integer,primary_key=True)
    product_name=db.Column(db.String,nullable=False)
    description = db.Column(db.String)
    quantity=db.Column(db.Integer, default=1)
    contact = db.Column(db.Integer)
    price = db.Column(Numeric(10,2),nullable=False)
    seller_id = db.Column(db.Integer,db.ForeignKey('sellers.id',ondelete='CASCADE'))
    image_url = db.Column(db.String, default='data:image/png;base64,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')
    orders=db.relationship('Order', back_populates='product')
    seller=db.relationship('Seller',back_populates='products')
    cart_items = db.relationship('CartItem',back_populates='product')
class Order(db.Model,SerializerMixin):
    __tablename__='orders'
    serialize_rules = ('-customer.orders', '-product.orders','-customer.cart_items' )
    id = db.Column (db.Integer,primary_key=True)
    product_name=db.Column(db.String)
    amount = db.Column(db.Integer,nullable=False)
    contact=db.Column(db.Integer)
    price = db.Column(Numeric(10,2))
    image_url = db.Column(db.String, default='data:image/png;base64,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')
    customer_id=db.Column(db.Integer,db.ForeignKey('customers.id',ondelete="CASCADE"))
    product_id=db.Column(db.Integer,db.ForeignKey('products.id',ondelete="CASCADE"))

    customer = db.relationship('Customer',back_populates='orders')
    product = db.relationship('Product',back_populates='orders')

class CartItem(db.Model,SerializerMixin):
    __tablename__='cart_items'
    serialize_rules = ('-customer.cart_items', '-product.cart_items','-customer.orders')
    id = db.Column (db.Integer,primary_key=True)
    product_name=db.Column(db.String)
    contact=db.Column(db.Integer)
    amount = db.Column(db.Integer,nullable=False)
    price = db.Column(Numeric(10,2))
    image_url = db.Column(db.String, default='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAAABAQH8/Pzv7+8vLy8FBQX5+fn09PTs7Oy/v7/29vbm5uYiIiK2trba2tqhoaHLy8uUlJRERERdXV1xcXEnJyfGxsY7OztVVVWGhoaampq8vLzX19dOTk6oqKh8fHwaGho0NDQjIyN2dnaMjIwRERFlZWVTU1NBQUF7e3su/bVTAAAJGElEQVR4nO2ci3LqIBCGQXLVmBjjXaPGVm37/g94dskFTGxPi7XizH5n5hRjdPhdYJeFwBhBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEATxtwgmhPxzcU3+L8S1DxD2EST9eJMHrYv5Ju7ng8fU6PfAVjg/n7hkGUN79cs2u5mU107n+aPreBMgJV2ADo/34B/ns00puu+WF3t48fDUGsWeS2klUJpAW/XPXMPjfOo/up6GCBZsuQcK3kdpku7eOL54iQauvLjdpcl89C51Lxz2nIPq4B21uHUrTJZosVO0AstleXUxzeQ9zqPqeBMiwya4Ysod7lBiESz5urwo/eEaLx4G7Ml8I9b9lXs9PrpofymqycLNxb0x/hCTZ1MIujaVwIuKS4lj5gvtRpAIF3dP1hUFc7Da01a1k02MuhOmKxRsjMPN03VF8BPcbV9c8ugMarYXwqGcyV/juYjQ16UtE0IbPQTo/i+cPLTjBA2es6fiFXSc211rCTr6o64RBVgcb38mAjRh0roY4aAZDDz51uUIJE0ePtNgswMxk/bFI6jY4x8PvGRrujjlOPA+C2CeLVS4f3mRCRcu5qW9vLbCFGS/P48NhWykl9XF4cTjQ5Tvdluw8PETzrMoFKx/beAY1a3zCO/u2u9O4d0nmkeNZa9qTYpQg2y5qP+1/ZEdXBz/Te1uRzCcweftXgUzJR5V3q/lL5j0lc/k9Esxl/hDzk8yWTOAd1/aXS6Ssu1GNBlDMQMx7SSTgxmL8rYCiu15PQ41sz+o5U1A3X0ndBwnAHMNfSwpghwkLAZQCtkQx80WIVwrZGnAmKVuA+YT0zL3EoGEWcjbeFXKJkF3EXXe7nlVYRo+WspnOLzKO4WlQu9SQJOSimZ4T0e/drutQfiy1hQWV214XaHXa3NlHLIDjFn4zHXdWWnDk3udolR4qF51JcL3xI8WcwUho+3Sow3AhsMv7pUjTVU+8q4NPb6/c21NEGwNnbD87aXCLxoaKqyXMca8K7HXnZdYgGCrZj6BCl++uFdXOLoi0JOO0zbKKV4qy/4JPH7yiVMTLDxpCndXWym3Mrm45PWkaCWXIz5JnuFEyVOJp/iKDUGkhU5fsIxXwahTOrfPZgowIuHbVdy6UQpVj8SfxzqFjB3QB2AhKdfNOhOkihWXXa3y6n0la/aiyjb6fJw7FDLcHshG+mnaJeby/So0S5Wqw1SVbZwMO6cmBTzCWGXofzbSoLH5sXqZK1XuWJVtdPkYhi2qcrw97INP7xysFlmTxUiUqkKNOrg6ZR3aFPYng0TUjC+cp6q8v0MNbwVzE2X2SQjR3UGjIzRv52gKE1Xu5MstYA4KP37+MV9TqNnTxoRGbJYsE5pCmHU1nsM+E8p04Migbek2zFTZuv0ZuMxpNq3TFOZTVbZwwXTfWar4HoU2lq61UefXK3gzmNJODT7nKie42Vkd1Lzxbhb4O2RK1W5udVBzgFZq0nnelKqx5i4sXEyEeb3RADhRfW+vuf/Vr1fwZjCcNnFiZ2XDqTjVmTcLV/VxUdTITb8qG07Ygtfl7NdreCsYeBvVaq9smOHqeFXu7MV5OBh4G+UAV9oknymXX3w++3oQeTO1+CHatJerF00OwB7AlfG9yQfXusJYDabWBTU4tTj+/7YuWhzDg3mt0Cw+uisj0y0/WsKUR0njLewLao7cMNLqawrTwOJMDe62NIqW51oiuM8sDmrUqsUPSbkebrtNP7QuqIHw0mz4yzWFIxWH8/ffruGtvINCIxemK1xBU+DVSFPYtvxkOrXQEqYQeqsIxyyMvyc4tTD6oK5wWS+YlgsbVmkUxgodrofe/aaV2hbU1Hu6fowYaMm2gxpZuW1BTXJt2/N3EEKzYeFreQzLgpqU90w3T14s/WpJ/rVd/bAvNwAb4TUKPR5dBDVWKYzl80xGFJrCRKVPbdtPu/tiWfs/zLRWmmpBzZtNNhTmUwvRZJ/QQ8RaYqr47VregpBPARlNLYTKPmHWW+1zM3Svd+NsuitUbntvFI7VlN+2BbalaRAimmC7J5fv50qhySrIvRByd75hdmyltdIz09byrQpqhKttxvsh2g5TCEy1oGbz/8/+HYMTNx77tB2m3GWB10SmVi0/YeBt+rTEWu2D5oVgQ14FOXZlaiJtQ9RPGWkKoaUvqpeGKfR7gasWS8M9odoeWhw/J830yao9NTdMLWRI2yhM1FqUcaO4Cxtu3m30lDBEDU23rPZyWgKuWqwNk2N6wpT39aDGpj01I3nugxl6OhG+ZN4MPFYFNcZTC3ahEAPTpOmWVgU1r9w8cxTpClfgWmt/aFWmZsI94+xfxC9ywlruzaagBo/uMO01oW7DrXxsv7Kh0YrrnXC5+cinp4Qx9Ns2Cm3K1MzMpxYsOOkSmy1EeBqRPZkanFoMTafkvkq2gSrGPpolRNee5afwhsAbn/xu+qEHbX2tFtiENUa87WF6V7dhgnFq3WTtWX7KTTdESRa6wjku7Jce0ablp9uOfHjXEqYTn4kYhx5exuG2sDFftWDoHkqTeZ4UCD1zXT7ibVGmZsdv2f+ybNzDWbC8GI4TFuDZBTYFNetrJ858mzOvm6goH3vj2cjJM6uOcxlXk6fKfYmfnRBcbrn0YDQeTJqzF5brd27RQXyYiHD7eRQaeX3MW8AXLOWjU3Uaqjx9wRqF6giIobudHte7TRqFwXflHqXdls5K6QOTwrjzYY1AmfOsTy5RzBbbycdxF8/zsJVxEcIvT0yUyGMTMzyPt1cPqvLLzvboY748i62ip7czJXd7nq7Wu36ehO2Ky9Fly3W/j/rm7YOmHgmMK9H49fy2KFq6oNV5Pd6R+5Kd9+NRnCaR45frx1warrl12v/yEc0H4g/CJN3s1qvpdjE7tdTKx/S9ltjCzWSWG41fHlFzep3blEbsoP3ugzDK5/Ho+Drp2PayJeuNcz/37TReiWj91d+K0Ljj/bQjV5pOqj2t0urj9kr8HiKI8n48Wk0n2WFYC3VXNiUPb0JcmMh3sOfG8whPCntcpe6E+PIlQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQZjxD+1dXdM5y092AAAAAElFTkSuQmCC')
    customer_id=db.Column(db.Integer,db.ForeignKey('customers.id',ondelete="CASCADE"))
    product_id=db.Column(db.Integer,db.ForeignKey('products.id',ondelete="CASCADE"))

    customer = db.relationship('Customer',back_populates='cart_items')
    product = db.relationship('Product',back_populates='cart_items')






