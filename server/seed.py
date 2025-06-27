from app import app, db
from models import Customer, Seller, Product, Order, CartItem
from sqlalchemy import text  # Needed for raw SQL commands

def seed_data():
    with app.app_context():
        print("🌱 Seeding data...")

        # Reset tables
        db.session.query(Order).delete()
        db.session.query(CartItem).delete()
        db.session.query(Product).delete()
        db.session.query(Customer).delete()
        db.session.query(Seller).delete()
        db.session.commit()

        # Reset primary key sequences
        db.session.execute(text("ALTER SEQUENCE customers_id_seq RESTART WITH 1"))
        db.session.execute(text("ALTER SEQUENCE sellers_id_seq RESTART WITH 1"))
        db.session.execute(text("ALTER SEQUENCE products_id_seq RESTART WITH 1"))
        db.session.execute(text("ALTER SEQUENCE orders_id_seq RESTART WITH 1"))
        db.session.execute(text("ALTER SEQUENCE cart_items_id_seq RESTART WITH 1"))
        db.session.commit()

        # Create Sellers
        seller1 = Seller(username="seller1")
        seller1.hash_password = "password123"

        seller2 = Seller(username="seller2")
        seller2.hash_password = "password456"

        db.session.add_all([seller1, seller2])
        db.session.commit()

        # Create Customers
        customer1 = Customer(username="customer1")
        customer1.hash_password = "cust123"

        customer2 = Customer(username="customer2")
        customer2.hash_password = "cust456"

        db.session.add_all([customer1, customer2])
        db.session.commit()

        # Create Products
        product1 = Product(
            product_name="Laptop",
            description="A fast laptop",
            quantity=10,
            price=1500.00,
            image_url="/images/shopping.png",
            contact="0712345678",
            seller_id=seller1.id
        )

        product2 = Product(
            product_name="Headphones",
            description="Noise cancelling",
            quantity=25,
            price=200.00,
            image_url="/images/shopping.png",
            contact="0798765432",
            seller_id=seller2.id
        )

        db.session.add_all([product1, product2])
        db.session.commit()

        # Create Orders
        order1 = Order(
            product_name=product1.product_name,
            amount=1,
            price=product1.price,
            contact="0712345678",
            image_url=product1.image_url,
            customer_id=customer1.id,
            product_id=product1.id
        )

        db.session.add(order1)

        # Create CartItems
        cart_item1 = CartItem(
            product_name=product2.product_name,
            amount=2,
            price=product2.price,
            contact="0798765432",
            image_url=product2.image_url,
            customer_id=customer2.id,
            product_id=product2.id
        )

        db.session.add(cart_item1)
        db.session.commit()

        print("✅ Seeding complete.")

if __name__ == "__main__":
    seed_data()
