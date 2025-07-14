from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
import uuid
from PIL import Image
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jewelry_store.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'products'), exist_ok=True)

db = SQLAlchemy(app)
cors = CORS(app)
jwt = JWTManager(app)

# Database Models
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default='customer')
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True)
    addresses = db.relationship('Address', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)
    wishlist_items = db.relationship('WishlistItem', backref='user', lazy=True)

class Category(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float)
    category_id = db.Column(db.String(36), db.ForeignKey('category.id'), nullable=False)
    images = db.Column(db.Text)  # JSON string of image URLs
    in_stock = db.Column(db.Boolean, default=True)
    stock_quantity = db.Column(db.Integer, default=0)
    pre_order = db.Column(db.Boolean, default=False)
    estimated_dispatch = db.Column(db.Date)
    materials = db.Column(db.Text)  # JSON string
    sizes = db.Column(db.Text)  # JSON string
    colors = db.Column(db.Text)  # JSON string
    rating = db.Column(db.Float, default=0.0)
    review_count = db.Column(db.Integer, default=0)
    tags = db.Column(db.Text)  # JSON string
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    reviews = db.relationship('Review', backref='product', lazy=True)
    wishlist_items = db.relationship('WishlistItem', backref='product', lazy=True)

class Address(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    is_default = db.Column(db.Boolean, default=False)

class Order(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(20), default='pending')
    payment_status = db.Column(db.String(20), default='pending')
    payment_method = db.Column(db.String(50))
    subtotal = db.Column(db.Float, nullable=False)
    shipping = db.Column(db.Float, default=0.0)
    tax = db.Column(db.Float, default=0.0)
    discount = db.Column(db.Float, default=0.0)
    total = db.Column(db.Float, nullable=False)
    shipping_address = db.Column(db.Text)  # JSON string
    billing_address = db.Column(db.Text)  # JSON string
    tracking_number = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

class OrderItem(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    selected_size = db.Column(db.String(50))
    selected_color = db.Column(db.String(50))
    customization = db.Column(db.Text)

class Review(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    images = db.Column(db.Text)  # JSON string
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WishlistItem(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('product.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Coupon(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255))
    type = db.Column(db.String(20), nullable=False)  # 'percentage' or 'fixed'
    value = db.Column(db.Float, nullable=False)
    min_order_value = db.Column(db.Float)
    max_discount = db.Column(db.Float)
    usage_limit = db.Column(db.Integer)
    used_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Offer(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    discount_percentage = db.Column(db.Float)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Utility Functions
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file, folder='products'):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], folder, unique_filename)
        
        # Resize and optimize image
        image = Image.open(file)
        image.thumbnail((800, 800), Image.Resampling.LANCZOS)
        image.save(filepath, optimize=True, quality=85)
        
        return f"/uploads/{folder}/{unique_filename}"
    return None

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['firstName'],
            last_name=data['lastName'],
            phone=data.get('phone', ''),
            role=data.get('role', 'customer')
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': user.role
                }
            }), 200
        
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Product Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        sort_by = request.args.get('sort_by', 'created_at')
        order = request.args.get('order', 'desc')
        
        query = Product.query.filter_by(is_active=True)
        
        # Apply filters
        if category:
            cat = Category.query.filter_by(name=category).first()
            if cat:
                query = query.filter_by(category_id=cat.id)
        
        if search:
            query = query.filter(
                db.or_(
                    Product.name.contains(search),
                    Product.description.contains(search),
                    Product.tags.contains(search)
                )
            )
        
        # Apply sorting
        if hasattr(Product, sort_by):
            if order == 'desc':
                query = query.order_by(getattr(Product, sort_by).desc())
            else:
                query = query.order_by(getattr(Product, sort_by))
        
        products = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'products': [{
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'price': p.price,
                'originalPrice': p.original_price,
                'category': p.category.name,
                'images': json.loads(p.images) if p.images else [],
                'inStock': p.in_stock,
                'stockQuantity': p.stock_quantity,
                'preOrder': p.pre_order,
                'estimatedDispatch': p.estimated_dispatch.isoformat() if p.estimated_dispatch else None,
                'materials': json.loads(p.materials) if p.materials else [],
                'sizes': json.loads(p.sizes) if p.sizes else [],
                'colors': json.loads(p.colors) if p.colors else [],
                'rating': p.rating,
                'reviewCount': p.review_count,
                'tags': json.loads(p.tags) if p.tags else [],
                'isFeatured': p.is_featured,
                'createdAt': p.created_at.isoformat(),
                'updatedAt': p.updated_at.isoformat()
            } for p in products.items],
            'pagination': {
                'page': products.page,
                'pages': products.pages,
                'per_page': products.per_page,
                'total': products.total,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        return jsonify({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'originalPrice': product.original_price,
            'category': product.category.name,
            'images': json.loads(product.images) if product.images else [],
            'inStock': product.in_stock,
            'stockQuantity': product.stock_quantity,
            'preOrder': product.pre_order,
            'estimatedDispatch': product.estimated_dispatch.isoformat() if product.estimated_dispatch else None,
            'materials': json.loads(product.materials) if product.materials else [],
            'sizes': json.loads(product.sizes) if product.sizes else [],
            'colors': json.loads(product.colors) if product.colors else [],
            'rating': product.rating,
            'reviewCount': product.review_count,
            'tags': json.loads(product.tags) if product.tags else [],
            'isFeatured': product.is_featured,
            'createdAt': product.created_at.isoformat(),
            'updatedAt': product.updated_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.form.to_dict()
        
        # Handle file uploads
        images = []
        for key in request.files:
            if key.startswith('image'):
                file = request.files[key]
                image_url = save_image(file)
                if image_url:
                    images.append(image_url)
        
        # Get or create category
        category = Category.query.filter_by(name=data['category']).first()
        if not category:
            category = Category(name=data['category'])
            db.session.add(category)
            db.session.flush()
        
        product = Product(
            name=data['name'],
            description=data['description'],
            price=float(data['price']),
            original_price=float(data.get('originalPrice', 0)) or None,
            category_id=category.id,
            images=json.dumps(images),
            in_stock=data.get('inStock', 'true').lower() == 'true',
            stock_quantity=int(data.get('stockQuantity', 0)),
            pre_order=data.get('preOrder', 'false').lower() == 'true',
            estimated_dispatch=datetime.strptime(data['estimatedDispatch'], '%Y-%m-%d').date() if data.get('estimatedDispatch') else None,
            materials=json.dumps(data.get('materials', '').split(',') if data.get('materials') else []),
            sizes=json.dumps(data.get('sizes', '').split(',') if data.get('sizes') else []),
            colors=json.dumps(data.get('colors', '').split(',') if data.get('colors') else []),
            tags=json.dumps(data.get('tags', '').split(',') if data.get('tags') else []),
            is_featured=data.get('isFeatured', 'false').lower() == 'true'
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({'message': 'Product created successfully', 'id': product.id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        product = Product.query.get_or_404(product_id)
        data = request.form.to_dict()
        
        # Handle file uploads
        existing_images = json.loads(product.images) if product.images else []
        new_images = []
        
        for key in request.files:
            if key.startswith('image'):
                file = request.files[key]
                image_url = save_image(file)
                if image_url:
                    new_images.append(image_url)
        
        # Combine existing and new images
        all_images = existing_images + new_images
        
        # Update product fields
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = float(data.get('price', product.price))
        product.original_price = float(data.get('originalPrice', 0)) or product.original_price
        product.images = json.dumps(all_images)
        product.in_stock = data.get('inStock', str(product.in_stock)).lower() == 'true'
        product.stock_quantity = int(data.get('stockQuantity', product.stock_quantity))
        product.pre_order = data.get('preOrder', str(product.pre_order)).lower() == 'true'
        
        if data.get('estimatedDispatch'):
            product.estimated_dispatch = datetime.strptime(data['estimatedDispatch'], '%Y-%m-%d').date()
        
        if data.get('materials'):
            product.materials = json.dumps(data['materials'].split(','))
        if data.get('sizes'):
            product.sizes = json.dumps(data['sizes'].split(','))
        if data.get('colors'):
            product.colors = json.dumps(data['colors'].split(','))
        if data.get('tags'):
            product.tags = json.dumps(data['tags'].split(','))
        
        product.is_featured = data.get('isFeatured', str(product.is_featured)).lower() == 'true'
        product.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Product updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        product = Product.query.get_or_404(product_id)
        product.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Category Routes
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.filter_by(is_active=True).all()
        return jsonify([{
            'id': cat.id,
            'name': cat.name,
            'description': cat.description,
            'imageUrl': cat.image_url,
            'productCount': len(cat.products)
        } for cat in categories]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Order Routes
@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Generate order number
        order_number = f"ORD{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"
        
        order = Order(
            user_id=user_id,
            order_number=order_number,
            subtotal=data['subtotal'],
            shipping=data.get('shipping', 0),
            tax=data.get('tax', 0),
            discount=data.get('discount', 0),
            total=data['total'],
            shipping_address=json.dumps(data['shippingAddress']),
            billing_address=json.dumps(data.get('billingAddress', data['shippingAddress'])),
            payment_method=data.get('paymentMethod', 'card')
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Add order items
        for item_data in data['items']:
            product = Product.query.get(item_data['productId'])
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['productId'],
                quantity=item_data['quantity'],
                price=product.price,
                selected_size=item_data.get('selectedSize'),
                selected_color=item_data.get('selectedColor'),
                customization=item_data.get('customization')
            )
            db.session.add(order_item)
            
            # Update stock
            if not product.pre_order:
                product.stock_quantity -= item_data['quantity']
                if product.stock_quantity <= 0:
                    product.in_stock = False
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'orderId': order.id,
            'orderNumber': order.order_number
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role == 'admin':
            orders = Order.query.order_by(Order.created_at.desc()).all()
        else:
            orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        
        return jsonify([{
            'id': order.id,
            'orderNumber': order.order_number,
            'status': order.status,
            'paymentStatus': order.payment_status,
            'total': order.total,
            'itemCount': len(order.items),
            'customerName': f"{order.user.first_name} {order.user.last_name}",
            'customerEmail': order.user.email,
            'createdAt': order.created_at.isoformat(),
            'items': [{
                'productName': item.product.name,
                'quantity': item.quantity,
                'price': item.price,
                'selectedSize': item.selected_size,
                'selectedColor': item.selected_color
            } for item in order.items]
        } for order in orders]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/orders/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        order = Order.query.get_or_404(order_id)
        
        order.status = data['status']
        if 'paymentStatus' in data:
            order.payment_status = data['paymentStatus']
        if 'trackingNumber' in data:
            order.tracking_number = data['trackingNumber']
        if 'notes' in data:
            order.notes = data['notes']
        
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Order status updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Wishlist Routes
@app.route('/api/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    try:
        user_id = get_jwt_identity()
        wishlist_items = WishlistItem.query.filter_by(user_id=user_id).all()
        
        products = []
        for item in wishlist_items:
            product = item.product
            products.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'originalPrice': product.original_price,
                'images': json.loads(product.images) if product.images else [],
                'inStock': product.in_stock,
                'rating': product.rating,
                'reviewCount': product.review_count,
                'addedAt': item.created_at.isoformat()
            })
        
        return jsonify(products), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/wishlist/<product_id>', methods=['POST'])
@jwt_required()
def add_to_wishlist(product_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if already in wishlist
        existing = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing:
            return jsonify({'message': 'Product already in wishlist'}), 200
        
        wishlist_item = WishlistItem(user_id=user_id, product_id=product_id)
        db.session.add(wishlist_item)
        db.session.commit()
        
        return jsonify({'message': 'Product added to wishlist'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/wishlist/<product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    try:
        user_id = get_jwt_identity()
        wishlist_item = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
        
        if wishlist_item:
            db.session.delete(wishlist_item)
            db.session.commit()
        
        return jsonify({'message': 'Product removed from wishlist'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Admin Dashboard Routes
@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        # Calculate stats
        total_products = Product.query.filter_by(is_active=True).count()
        total_orders = Order.query.count()
        total_customers = User.query.filter_by(role='customer').count()
        total_revenue = db.session.query(db.func.sum(Order.total)).filter_by(payment_status='paid').scalar() or 0
        
        # Recent orders
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
        
        # Top products
        top_products = Product.query.filter_by(is_active=True).order_by(Product.review_count.desc()).limit(5).all()
        
        return jsonify({
            'stats': {
                'totalProducts': total_products,
                'totalOrders': total_orders,
                'totalCustomers': total_customers,
                'totalRevenue': total_revenue
            },
            'recentOrders': [{
                'id': order.id,
                'orderNumber': order.order_number,
                'customerName': f"{order.user.first_name} {order.user.last_name}",
                'total': order.total,
                'status': order.status,
                'createdAt': order.created_at.isoformat()
            } for order in recent_orders],
            'topProducts': [{
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'reviewCount': product.review_count,
                'images': json.loads(product.images) if product.images else []
            } for product in top_products]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Offers Routes
@app.route('/api/offers', methods=['GET'])
def get_offers():
    try:
        current_time = datetime.utcnow()
        offers = Offer.query.filter(
            Offer.is_active == True,
            Offer.start_date <= current_time,
            Offer.end_date >= current_time
        ).all()
        
        return jsonify([{
            'id': offer.id,
            'title': offer.title,
            'description': offer.description,
            'imageUrl': offer.image_url,
            'discountPercentage': offer.discount_percentage,
            'startDate': offer.start_date.isoformat(),
            'endDate': offer.end_date.isoformat()
        } for offer in offers]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/offers', methods=['POST'])
@jwt_required()
def create_offer():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        offer = Offer(
            title=data['title'],
            description=data.get('description'),
            image_url=data.get('imageUrl'),
            discount_percentage=data.get('discountPercentage'),
            start_date=datetime.fromisoformat(data['startDate']),
            end_date=datetime.fromisoformat(data['endDate'])
        )
        
        db.session.add(offer)
        db.session.commit()
        
        return jsonify({'message': 'Offer created successfully', 'id': offer.id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Search Route
@app.route('/api/search', methods=['GET'])
def search():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'products': [], 'categories': []}), 200
        
        # Search products
        products = Product.query.filter(
            Product.is_active == True,
            db.or_(
                Product.name.contains(query),
                Product.description.contains(query),
                Product.tags.contains(query)
            )
        ).limit(10).all()
        
        # Search categories
        categories = Category.query.filter(
            Category.is_active == True,
            Category.name.contains(query)
        ).limit(5).all()
        
        return jsonify({
            'products': [{
                'id': p.id,
                'name': p.name,
                'price': p.price,
                'images': json.loads(p.images) if p.images else [],
                'category': p.category.name
            } for p in products],
            'categories': [{
                'id': c.id,
                'name': c.name
            } for c in categories]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Static file serving
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Initialize database
with app.app_context():
    db.create_all()
    
    # Create admin user if not exists
    admin = User.query.filter_by(email='admin@jewelry.com').first()
    if not admin:
        admin = User(
            email='admin@jewelry.com',
            password_hash=generate_password_hash('admin123'),
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        db.session.add(admin)
    
    # Create sample categories
    categories = ['Necklaces', 'Bracelets', 'Earrings', 'Rings', 'Watches', 'Sets']
    for cat_name in categories:
        if not Category.query.filter_by(name=cat_name).first():
            category = Category(name=cat_name, description=f"Beautiful {cat_name.lower()} collection")
            db.session.add(category)
    
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create admin user if not exists
        admin = User.query.filter_by(email='admin@jewelry.com').first()
        if not admin:
            admin = User(
                email='admin@jewelry.com',
                password_hash=generate_password_hash('admin123'),
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            db.session.add(admin)
        
        # Create sample categories
        categories = ['Necklaces', 'Bracelets', 'Earrings', 'Rings', 'Watches', 'Sets']
        for cat_name in categories:
            if not Category.query.filter_by(name=cat_name).first():
                category = Category(name=cat_name, description=f"Beautiful {cat_name.lower()} collection")
                db.session.add(category)
        
        db.session.commit()
    
    app.run(debug=True, port=5000)