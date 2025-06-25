from app import app, db, bcrypt
from models import Customer, Seller, Product, Order, CartItem

with app.app_context():
    # Clear existing data
    print("Clearing database...")
    CartItem.query.delete()
    Order.query.delete()
    Product.query.delete()
    Seller.query.delete()
    Customer.query.delete()
    db.session.commit()

    print("Seeding sellers...")
    seller1 = Seller(username="nairobi_shoes")
    seller1.hash_password = "shoes123"

    seller2 = Seller(username="munene_electronics")
    seller2.hash_password = "tech456"

    db.session.add_all([seller1, seller2])
    db.session.commit()

    print("Seeding products...")
    product1 = Product(
        product_name="Air Max Sneakers",
        description="Trendy sneakers for sports and casual wear.",
        quantity=10,
        price=5999.99,
        seller_id=seller1.id
    )

    product2 = Product(
        product_name="Bluetooth Speaker",
        description="Portable wireless speaker with deep bass.",
        quantity=5,
        price=3499.50,
        seller_id=seller2.id
    )

    product3 = Product(
        product_name="Running Shoes",
        description="Lightweight and breathable running shoes.",
        quantity=20,
        price=4499.00,
        seller_id=seller1.id
    )

    db.session.add_all([product1, product2, product3])
    db.session.commit()

    print("Seeding customers...")
    customer1 = Customer(username="johndoe")
    customer1.hash_password = "doepass"

    customer2 = Customer(username="janedoe")
    customer2.hash_password = "janepass"

    db.session.add_all([customer1, customer2])
    db.session.commit()

    print("Seeding orders...")
    order1 = Order(
        product_name=product1.product_name,
        amount=2,
        price=product1.price,
        customer_id=customer1.id,
        product_id=product1.id
    )

    order2 = Order(
        product_name=product2.product_name,
        amount=1,
        price=product2.price,
        customer_id=customer1.id,
        product_id=product2.id
    )

    db.session.add_all([order1, order2])
    db.session.commit()

    print("Seeding cart items...")
    cart_item1 = CartItem(
        product_name=product3.product_name,
        amount=3,
        price=product3.price,
        customer_id=customer2.id,
        product_id=product3.id
    )

    cart_item2 = CartItem(
        product_name=product2.product_name,
        amount=1,
        price=product2.price,
        customer_id=customer2.id,
        product_id=product2.id
    )

    db.session.add_all([cart_item1, cart_item2])
    db.session.commit()

    print("✅ Seeding complete!")
