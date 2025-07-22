# Grocery-be (Backend API)

Unified REST API backend serving both web admin portal and mobile customer app. Handles user authentication, product management, order processing, payment integration, and real-time notifications.

## 🚀 Features

- **User Authentication**: JWT-based auth for customers and admins with role-based access
- **Product Management**: CRUD operations for products, categories, and inventory
- **Order Processing**: Complete order lifecycle from cart to delivery
- **Payment Integration**: Multiple payment gateways (Stripe, PayPal, PhonePe, etc.)
- **Real-time Notifications**: Push notifications and email alerts
- **File Upload**: Image uploads for products with cloud storage integration (Cloudinary)
- **Search & Filtering**: Advanced product search with filters and sorting
- **Analytics**: Sales reports, customer insights, and business metrics
- **Rate Limiting**: API protection against abuse
- **Logging**: Comprehensive request/error logging

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Neondb/PostgreSQL
- **ORM**: Drizzle-kit
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payment**: PhonePe, Stripe
- **Email**: Nodemailer
- **Push Notifications**: Expo push notifications
- **Validation**: Joi

## 📋 Prerequisites

- Node.js (v18 or higher)
- Database (Neondb/PostgreSQL)
- Redis (for caching and sessions)
- Cloudinary account (for file uploads)
- Payment gateway accounts (Stripe, PhonePe, etc.)

## 🏗️ Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/kruthishkandula/grocery-be.git
    cd grocery-be
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables**
    ```bash
    cp .env.example .env
    ```
    Edit `.env` with your configuration:
    ```env
    # Server
    PORT=3001
    NODE_ENV=development

    # Database
    DATABASE_URL=postgresql://user:password@localhost:5432/grocery_db

    # JWT
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=7d

    # Redis
    REDIS_URL=redis://localhost:6379

    # Cloudinary
    CLOUDINARY_NAME=your_cloudinary_name
    CLOUDINARY_KEY=your_cloudinary_key
    CLOUDINARY_SECRET=your_cloudinary_secret

    # Stripe
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...

    # SendGrid
    SENDGRID_API_KEY=your_sendgrid_api_key
    FROM_EMAIL=noreply@yourdomain.com

    # Firebase
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_PRIVATE_KEY=your_private_key
    FIREBASE_CLIENT_EMAIL=your_client_email
    ```

4. **Set up the database**
    ```bash
    npm run migrate
    npm run seed
    ```

5. **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

## 🚀 Deployment

- **Build for production**
    ```bash
    npm run build
    ```
- **Start production server**
    ```bash
    npm start
    ```
- **Docker deployment**
    ```bash
    docker build -t grocery-backend .
    docker run -p 3001:3001 grocery-backend
    ```

## 📁 Project Structure

```
grocery-be/
├── src/
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middleware
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   ├── config/             # Configuration files
│   └── validators/         # Input validation schemas
├── tests/                  # Test files
├── docs/                   # API documentation
├── package.json
└── README.md
```

## 🛣️ API Routes

### Authentication
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Refresh token
POST   /api/auth/logout            # User logout
POST   /api/auth/forgot-password   # Password reset
```

### Products & Categories
```
GET    /api/products               # Get all products
GET    /api/products/:id           # Get product by ID
POST   /api/products               # Create product (Admin)
PUT    /api/products/:id           # Update product (Admin)
DELETE /api/products/:id           # Delete product (Admin)
GET    /api/categories             # Get all categories
```

### Orders
```
GET    /api/orders                 # Get user orders
POST   /api/orders                 # Create new order
GET    /api/orders/:id             # Get order by ID
PUT    /api/orders/:id/status      # Update order status (Admin)
```

### Cart
```
GET    /api/cart                   # Get user cart
POST   /api/cart/items             # Add item to cart
PUT    /api/cart/items/:id         # Update cart item
DELETE /api/cart/items/:id         # Remove cart item
DELETE /api/cart                   # Clear cart
```

### Admin
```
GET    /api/admin/dashboard        # Dashboard statistics
GET    /api/admin/orders           # All orders
GET    /api/admin/customers        # All customers
GET    /api/admin/analytics        # Sales analytics
```

## 🔒 Authentication & Authorization

### JWT Middleware Example
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
```

### Role-based Access
- **Customer**: Can browse products, manage cart, place orders
- **Admin**: Full access to manage products, orders, and users

## 📧 Notifications

- **Email**: Order confirmation, status updates, password reset, welcome emails
- **Push**: Real-time order updates, promotional offers, low stock alerts (Admin)

## 🧪 Testing

```bash
npm test
npm run test:coverage
npm run test:integration
```

## 📊 API Documentation

- Development: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- Production: `https://your-domain.com/api-docs`
- Generated using Swagger/OpenAPI specification.

## 🔧 Configuration

### Rate Limiting Example
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Write tests for your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an issue in this repository
- Contact: kandulakruthish@gmail.com
- API Documentation: `/api-docs`

## 🔗 Related Projects

- [Grocery-web](https://github.com/kruthishkandula/grocery-web) - Admin portal
- [Grocery-mobile](https://github.com/kruthishkandula/grocery-mobile) - Customer mobile app