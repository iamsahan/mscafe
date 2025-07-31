# Tax Education & Financial Services Platform - Backend API

A comprehensive Node.js backend API for a unified platform combining tax education courses and financial services. Built with Express.js, MySQL, and Sequelize ORM.

## 🚀 Features

- **RESTful API Design** with versioned endpoints (`/api/v1/`)
- **User Authentication & Authorization** with JWT and bcrypt
- **Role-based Access Control** (Users, Admins, Super Admins)
- **Course Management System** with categories and enrollments
- **Service Booking System** for financial consultations
- **Event Management** for webinars and workshops
- **Content Management** (FAQs, testimonials, resources)
- **File Upload & Download** for resources
- **Admin Dashboard** with comprehensive analytics
- **Security Features** (CORS, Helmet, Rate Limiting)
- **Logging & Monitoring** with Winston
- **Input Validation** with Joi
- **Error Handling** with global middleware

## 📋 Prerequisites

- Node.js (v16+ recommended)
- MySQL (v8.0+ recommended)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=tax_education_platform
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   
   # Admin
   ADMIN_EMAIL=admin@taxschool.com
   ADMIN_PASSWORD=Admin123!@#
   ```

4. **Database Setup**
   
   Create MySQL database:
   ```sql
   CREATE DATABASE tax_education_platform;
   ```
   
   Run migrations:
   ```bash
   npm run migrate
   ```
   
   Seed database with sample data:
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/profile` | Update user profile | Private |
| PUT | `/auth/password` | Change password | Private |

#### 👥 Admin Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/admin/auth/login` | Admin login | Public |
| GET | `/admin/auth/me` | Get current admin | Admin |

#### 📚 Courses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/courses` | Get all courses | Public |
| GET | `/courses/:id` | Get single course | Public |
| GET | `/courses/categories` | Get course categories | Public |
| GET | `/courses/enrollments` | Get user enrollments | Private |
| POST | `/courses` | Create course | Admin |
| PUT | `/courses/:id` | Update course | Admin |
| DELETE | `/courses/:id` | Delete course | Admin |
| POST | `/courses/:id/enroll` | Enroll in course | Private |

#### 🔧 Services

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/services` | Get all services | Public |
| GET | `/services/:id` | Get single service | Public |
| POST | `/services` | Create service | Admin |
| PUT | `/services/:id` | Update service | Admin |
| DELETE | `/services/:id` | Delete service | Admin |

#### 📅 Bookings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/bookings` | Get user bookings | Private |
| GET | `/bookings/:id` | Get single booking | Private |
| POST | `/bookings` | Create booking | Private |
| PUT | `/bookings/:id` | Update booking | Private |
| DELETE | `/bookings/:id` | Cancel booking | Private |

#### 🎯 Events

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/events` | Get all events | Public |
| GET | `/events/:id` | Get single event | Public |
| GET | `/events/registrations` | Get user registrations | Private |
| POST | `/events` | Create event | Admin |
| PUT | `/events/:id` | Update event | Admin |
| DELETE | `/events/:id` | Delete event | Admin |
| POST | `/events/:id/register` | Register for event | Private |

#### ⭐ Testimonials

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/testimonials` | Get approved testimonials | Public |
| POST | `/testimonials` | Create testimonial | Private |
| PUT | `/testimonials/:id` | Update testimonial | Admin |
| DELETE | `/testimonials/:id` | Delete testimonial | Admin |

#### ❓ FAQs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/faqs` | Get all FAQs | Public |
| POST | `/faqs` | Create FAQ | Admin |
| PUT | `/faqs/:id` | Update FAQ | Admin |
| DELETE | `/faqs/:id` | Delete FAQ | Admin |

#### 📁 Resources

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/resources` | Get all resources | Public |
| GET | `/resources/:id/download` | Download resource | Public/Private* |
| POST | `/resources` | Upload resource | Admin |
| PUT | `/resources/:id` | Update resource | Admin |
| DELETE | `/resources/:id` | Delete resource | Admin |

*Access depends on resource access level

#### 🔧 Admin Panel

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/admin/dashboard` | Get dashboard stats | Admin |
| GET | `/admin/users` | Get all admins | Super Admin |
| POST | `/admin/users` | Create admin | Super Admin |
| PUT | `/admin/users/:id` | Update admin | Super Admin |
| DELETE | `/admin/users/:id` | Delete admin | Super Admin |
| GET | `/admin/bookings` | Get all bookings | Admin |
| PUT | `/admin/bookings/:id` | Update booking | Admin |
| GET | `/admin/enrollments` | Get all enrollments | Admin |
| GET | `/admin/event-registrations` | Get event registrations | Admin |

### Request/Response Examples

#### User Registration
```javascript
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-123-4567"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Create Booking
```javascript
POST /api/v1/bookings
Authorization: Bearer <token>
{
  "serviceId": 1,
  "appointmentDate": "2025-08-15T10:00:00Z",
  "notes": "Need help with business tax planning"
}

Response:
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "serviceId": 1,
    "appointmentDate": "2025-08-15T10:00:00Z",
    "status": "pending",
    "service": {
      "id": 1,
      "name": "Business Tax Consultation",
      "price": 150.00
    }
  }
}
```

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent abuse
- **Input Validation** with Joi schemas
- **SQL Injection Protection** via Sequelize ORM
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **File Upload Security** with type and size validation

## 📊 Database Schema

### Core Tables
- **users** - Platform users (students, clients)
- **admins** - Administrative users with role-based permissions
- **courses** / **course_categories** - Education content
- **services** / **bookings** - Financial services and appointments
- **events** / **event_registrations** - Webinars and workshops
- **enrollments** - Course enrollment tracking

### Content Tables
- **testimonials** - Customer testimonials
- **faqs** - Frequently asked questions
- **resources** / **resource_downloads** - Downloadable content
- **newsletter_subscriptions** - Email subscriptions

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_NAME=your-production-db-name
JWT_SECRET=your-super-secure-jwt-secret
# ... other production configs
```

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start server.js --name "tax-education-api"
pm2 startup
pm2 save
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm test` - Run test suite

## 🔧 Configuration

### Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

### File Uploads
- Max file size: 5MB
- Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- Storage: Local filesystem (configurable)

### Logging
- Development: Console output with colors
- Production: File-based logging with rotation
- Error logs: Separate error.log file
- Log levels: error, warn, info, debug

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email admin@taxschool.com or create an issue in the repository.

---

**Built with ❤️ for Tax Education & Financial Services**
