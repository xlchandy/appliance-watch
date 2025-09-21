# Appliance Watch Backend

A robust Express.js backend API for the Appliance Watch application, built with TypeScript, PostgreSQL, and Drizzle ORM.

## 🚀 Features

- **Full CRUD Operations** for appliances, service contacts, and maintenance tasks
- **Warranty Status Calculation** with automatic expiry detection
- **Advanced Filtering & Search** capabilities
- **Data Validation** with Zod schemas
- **Type Safety** throughout the application
- **Security Middleware** with Helmet and CORS
- **Error Handling** with detailed error responses
- **Database Migrations** with Drizzle Kit
- **Seed Data** for development and testing

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Development**: tsx, nodemon

## 📦 Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/appliance_watch"
   NODE_ENV="development"
   PORT=3001
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Set up database**:
   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:push
   
   # Optional: Seed with sample data
   npm run db:seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Database Management
```bash
# Generate new migration
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database browser)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

## 📡 API Endpoints

### Health Check
- `GET /health` - API health status

### Appliances
- `GET /api/appliances` - Get all appliances (with filtering)
- `GET /api/appliances/stats` - Get appliance statistics
- `GET /api/appliances/:id` - Get single appliance
- `POST /api/appliances` - Create new appliance
- `PUT /api/appliances/:id` - Update appliance
- `DELETE /api/appliances/:id` - Delete appliance

### Query Parameters for GET /api/appliances
- `search` - Search in name, brand, model
- `status` - Filter by warranty status (active, expiring, expired, all)
- `category` - Filter by appliance category
- `limit` - Number of results per page (default: 50, max: 100)
- `offset` - Number of results to skip (default: 0)
- `sortBy` - Sort field (name, purchaseDate, warrantyExpiryDate, createdAt)
- `sortOrder` - Sort direction (asc, desc)

### Service Contacts (Placeholder)
- `GET /api/service-contacts` - Get all service contacts
- `GET /api/service-contacts/:id` - Get single service contact
- `POST /api/service-contacts` - Create service contact
- `PUT /api/service-contacts/:id` - Update service contact
- `DELETE /api/service-contacts/:id` - Delete service contact

### Maintenance Tasks (Placeholder)
- `GET /api/maintenance-tasks` - Get all maintenance tasks
- `GET /api/maintenance-tasks/:id` - Get single maintenance task
- `POST /api/maintenance-tasks` - Create maintenance task
- `PUT /api/maintenance-tasks/:id` - Update maintenance task
- `DELETE /api/maintenance-tasks/:id` - Delete maintenance task

## 📊 Data Models

### Appliance
```typescript
interface Appliance {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate: string;
  purchaseLocation?: string;
  warrantyMonths: number;
  warrantyExpiryDate: string;
  supportContactId?: string;
  notes?: string;
  category?: ApplianceCategory;
  createdAt: string;
  updatedAt: string;
}
```

### Appliance Categories
- `kitchen`
- `laundry`
- `heating-cooling`
- `entertainment`
- `cleaning`
- `other`

### Warranty Status
- `active` - Warranty is still valid (>30 days remaining)
- `expiring` - Warranty expires within 30 days
- `expired` - Warranty has expired

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Drizzle ORM parameterized queries
- **Error Handling**: Secure error responses without leaking sensitive data

## 🗄 Database Schema

The application uses PostgreSQL with the following main tables:

- **appliances** - Main appliance records
- **service_contacts** - Service provider information
- **maintenance_tasks** - Scheduled maintenance activities

Database schema is managed with Drizzle ORM and migrations are version-controlled.

## 🧪 Example API Usage

### Create a new appliance
```bash
curl -X POST http://localhost:3001/api/appliances \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Refrigerator",
    "brand": "Samsung",
    "model": "RF28R7351SR",
    "purchaseDate": "2023-01-15T00:00:00.000Z",
    "warrantyMonths": 24,
    "category": "kitchen"
  }'
```

### Get appliances with filtering
```bash
curl "http://localhost:3001/api/appliances?search=samsung&status=active&limit=10"
```

### Get appliance statistics
```bash
curl http://localhost:3001/api/appliances/stats
```

## 🔧 Development

### Project Structure
```
src/
├── controllers/         # Request handlers
├── db/                 # Database configuration and schema
├── middleware/         # Express middleware
├── routes/            # API route definitions
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── app.ts             # Express application setup
```

### Adding New Features
1. Define types in `src/types/`
2. Create database schema in `src/db/schema.ts`
3. Generate migration with `npm run db:generate`
4. Create controller in `src/controllers/`
5. Add validation schemas in `src/middleware/validation.ts`
6. Create routes in `src/routes/`
7. Register routes in `src/app.ts`

## 🚀 Deployment

### Environment Variables for Production
```env
DATABASE_URL="postgresql://..."
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://your-frontend-domain.com"
CORS_ORIGINS="https://your-frontend-domain.com,https://admin.your-domain.com"
```

### Build and Deploy
```bash
npm run build
npm start
```

## 📝 License

This project is part of the Appliance Watch application suite.

## 🤝 Contributing

1. Follow TypeScript and ESLint guidelines
2. Add proper error handling
3. Include input validation
4. Write meaningful commit messages
5. Test all endpoints before submitting

## 📞 Support

For questions about the backend implementation, please refer to the main project documentation or create an issue in the repository.