# E-Commerce Platform

A full-stack e-commerce web application built with modern technologies. This platform enables users to browse products, manage shopping carts, process payments, and track orders. It also provides merchant and admin dashboards for business operations and analytics.

## 🎯 Features

### User Features
- **Authentication & Authorization**
  - User registration and login with JWT-based authentication
  - Role-based access control (Customer, Merchant, Admin)

- **Product Management**
  - Browse products with pagination and lazy loading
  - Search and filter products by category
  - View detailed product information
  - Product reviews and ratings

- **Shopping Cart**
  - Add/remove products from cart
  - Update product quantities
  - View cart summary
  - Persistent cart management

- **Checkout & Payment**
  - Secure checkout process
  - Payment processing integration
  - Order confirmation and tracking
  - Payment status tracking

- **User Profile**
  - View and edit user profile
  - Order history
  - Review management
  - Merchant requests (if applicable)

### Merchant Features
- **Merchant Profile**
  - Create and manage merchant profile
  - Upload merchant logo/image (S3 integration)
  - Edit merchant information

- **Product Management**
  - Create new products
  - Edit and delete products
  - Upload product images to AWS S3
  - View product inventory

- **Order Management**
  - View merchant orders
  - Update order status
  - Track order fulfillment

- **Analytics Dashboard**
  - Top performing products
  - Sales by category
  - Revenue metrics
  - Order analytics

### Admin Features
- **Dashboard**
  - Overview of platform metrics
  - Revenue analytics
  - User and merchant management

- **Merchant Management**
  - View all merchants
  - Review merchant requests
  - Approve/reject merchant applications
  - Manage merchant profiles

- **User Management**
  - View all users
  - Access user profiles
  - Manage user roles

- **Analytics & Reporting**
  - Revenue statistics
  - Top merchants and products
  - Category-wise sales analysis
  - Transaction tracking

- **Payment Management**
  - View all transactions
  - Track payment statuses
  - Transaction analytics

## 🛠️ Technologies

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and development server
- **React Router v7** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Data visualization charts
- **FontAwesome** - Icon library
- **React Compiler** - Performance optimization

### Backend
- **Spring Boot 4.0.6** - Java web framework
- **Java 21** - Programming language
- **Spring Data JPA** - ORM and database access
- **Spring Security** - Authentication and authorization
- **JWT (JSON Web Token)** - Token-based authentication
- **Lombok** - Java code generation library
- **AWS S3** - Cloud file storage for product/merchant images

### Database
- **PostgreSQL** - Relational database

### Architecture
- **REST API** - RESTful backend service
- **CORS** - Cross-origin resource sharing for frontend-backend communication
- **Responsive Design** - Mobile-friendly UI

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Merchant)
- `PUT /api/products/{id}` - Edit product (Merchant)
- `DELETE /api/products/{id}` - Delete product (Merchant)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update` - Update cart quantity
- `DELETE /api/cart/{productId}` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders/checkout` - Create order
- `PUT /api/orders/{orderId}/status` - Update order status

### Merchants
- `GET /api/merchants/{id}` - Get merchant profile
- `PUT /api/merchants/{id}` - Edit merchant profile
- `GET /api/merchants/requests` - Get merchant requests (Admin)

### Analytics
- `GET /api/analytics/admin` - Admin dashboard data
- `GET /api/analytics/merchant` - Merchant analytics

### Reviews
- `GET /api/reviews/product/{productId}` - Get product reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/{reviewId}` - Delete review

## 🚀 Getting Started

### Prerequisites
- Java 21
- PostgreSQL 12+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend/SpringWebAPI
   ```

2. Configure database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Configure AWS S3 credentials for image uploads

4. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
├── backend/
│   └── SpringWebAPI/
│       ├── src/main/java/com/example/SpringWebAPI/
│       │   ├── controller/      # API endpoints
│       │   ├── service/         # Business logic
│       │   ├── repository/      # Database access
│       │   ├── model/           # Entity models
│       │   ├── dto/             # Data transfer objects
│       │   ├── exception/       # Custom exceptions
│       │   └── config/          # Configuration classes
│       └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── context/             # React context providers
│   │   ├── pages/               # Page components
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 Security Features
- JWT-based authentication
- Password encryption
- Role-based access control (RBAC)
- CORS configuration
- Input validation
- Exception handling with custom error responses

## 📊 Database Schema
The application uses PostgreSQL with the following main tables:
- `users` - User accounts with roles
- `merchants` - Merchant profiles
- `products` - Product catalog
- `reviews` - Product reviews and ratings
- `cart_products` - Shopping cart items
- `orders` - Customer orders
- `order_products` - Order line items
- `transactions` - Payment transactions
- `merchant_requests` - Merchant application requests

## 🤝 Contributing
This is a deployed production e-commerce platform. For contributions, please follow the standard git workflow.

## 📝 License
This project is proprietary.

## 👨‍💻 Author
SreeNihaar
