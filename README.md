# Admin Backend API

Admin Dashboard Backend API built with Express.js and MongoDB for managing vendors, customers, bookings, subscriptions, and plans.

## 🚀 Features

- **Admin Management**: Super admin and admin role-based access control
- **Vendor Management**: CRUD operations for vendors
- **Customer Management**: View and manage customers with block/unblock functionality
- **Booking Management**: Handle bookings and reservations
- **Plan Management**: Create and manage subscription plans
- **Subscription Management**: Track user subscriptions
- **Dashboard Analytics**: Real-time statistics and insights
- **JWT Authentication**: Secure token-based authentication

## 📁 Project Structure

```
admin-backend/
├── server.js              # Application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not in repo)
├── .env.sample            # Environment variables template
├── .gitignore             # Git ignore rules
├── config/
│   └── db.js             # MongoDB connection setup
├── models/               # Mongoose schemas and models
├── controllers/          # Request handlers and business logic
├── routes/               # API route definitions
├── middleware/           # Authentication and authorization
└── utils/                # Helper functions and validators
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.sample` to `.env`
   ```bash
   cp .env.sample .env
   ```
   - Update the values in `.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3001
   JWT_SECRET=your_secret_key
   FRONTEND_URL=your_frontend_url
   ```

4. **Start the server**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/Convenz` |
| `PORT` | Server port number | `3001` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `FRONTEND_URL` | Frontend application URL (for CORS) | `http://localhost:5173` |

## 📡 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Admin Management
- `GET /api/admin` - Get all admins
- `POST /api/admin/register` - Register new admin (super admin only)
- `PUT /api/admin/:id` - Update admin
- `DELETE /api/admin/:id` - Delete admin

### Vendors
- `GET /api/vendors/getall` - Get all vendors
- `GET /api/vendors/get/:id` - Get vendor by ID
- `PATCH /api/vendors/:id/block` - Block/unblock vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Customers
- `GET /api/customers/getCustomers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `PATCH /api/customers/:id/block` - Block customer
- `PATCH /api/customers/:id/unblock` - Unblock customer

### Plans
- `GET /api/plans/all` - Get all plans
- `GET /api/plans/:id` - Get plan by ID
- `POST /api/plans/add` - Create new plan
- `PUT /api/plans/update/:id` - Update plan
- `DELETE /api/plans/delete/:id` - Delete plan

### Bookings
- `GET /api/bookings/all` - Get all bookings
- `POST /api/bookings/add` - Create new booking

### Subscriptions
- `GET /api/subscriptions/all` - Get all subscriptions
- `GET /api/subscriptions/user/:userId` - Get subscription by user ID
- `GET /api/subscriptions/:id` - Get subscription by ID
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

## 🔒 Default Admin Credentials

On first run, a default super admin is created:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials after first login!

## 🚀 Deployment on Render

1. Push your code to GitHub (ensure `.env` is in `.gitignore`)
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all variables from `.env.sample`
5. Deploy!

The server is configured to listen on `0.0.0.0` for Render compatibility.

## 🧪 Development

- The project uses ES6 modules (`"type": "module"` in package.json)
- Nodemon is configured for auto-restart during development
- CORS is configured for multiple frontend origins

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

## 📝 License

ISC

## 👤 Author

Admin Backend Team
# admin-backend
