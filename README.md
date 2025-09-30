# Employee Data Management System

A comprehensive full-stack CRUD application for managing employee records, built with React frontend and Express.js backend using SQLite database.

## 📋 Project Description

This application provides a complete employee management solution with the ability to Create, Read, Update, and Delete employee records. It features a clean, modern interface with real-time search functionality, form validation, and a professional user experience.

## ✨ Features

### Core Features
- **Full CRUD Operations**: Create, read, update, and delete employee records
- **SQLite Database**: Persistent data storage with proper database schema
- **RESTful API**: Clean API endpoints following REST conventions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Search**: Filter employees by name, email, or position
- **Form Validation**: Both frontend and backend validation for data integrity
- **Modal Interface**: Intuitive modal-based editing experience
- **Toast Notifications**: User feedback for all operations

### Technical Features
- **Modern React**: Functional components with hooks
- **Express.js Backend**: Robust server with proper error handling
- **SQLite Database**: Lightweight, file-based database
- **Tailwind CSS**: Beautiful, responsive styling
- **Professional UI**: Clean design with hover effects and animations
- **Comprehensive Testing**: Backend API tests with Jest and Supertest

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   This command starts both the backend server (port 3002) and frontend development server (port 5173) concurrently.

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start both frontend and backend development servers
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm test` - Run the test suite

## 🧪 Running Tests

The application includes comprehensive backend tests for all CRUD operations and business logic.

### Run all tests
```bash
npm test
```

### Test Coverage
The tests cover:
- ✅ Creating new employees with validation
- ✅ Retrieving all employees
- ✅ Searching employees by name, email, or position
- ✅ Getting individual employee by ID
- ✅ Updating existing employees
- ✅ Deleting employees
- ✅ Error handling for invalid operations
- ✅ Validation of required fields
- ✅ Email format validation
- ✅ Duplicate email prevention

## 🏗️ Project Structure

```
employee-data-management/
├── server/                     # Backend application
│   ├── database/
│   │   ├── init.js            # Database initialization and connection
│   │   └── employees.db       # SQLite database file (created automatically)
│   ├── models/
│   │   └── Employee.js        # Employee model with validation and CRUD methods
│   ├── routes/
│   │   └── employees.js       # API route handlers
│   ├── tests/
│   │   └── employees.test.js  # Comprehensive API tests
│   └── index.js               # Express server setup
├── src/                       # Frontend application
│   ├── components/
│   │   ├── EmployeeTable.jsx  # Employee list table component
│   │   ├── EmployeeModal.jsx  # Add/edit employee modal
│   │   └── Toast.jsx          # Notification component
│   ├── services/
│   │   └── employeeService.js # API service layer
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # React application entry point
│   └── index.css              # Tailwind CSS imports
├── package.json               # Project dependencies and scripts
├── vite.config.js             # Vite configuration with API proxy
├── tailwind.config.js         # Tailwind CSS configuration
├── jest.config.js             # Jest testing configuration
└── README.md                  # This file
```

## 🔧 API Endpoints

### Employee Endpoints

- `GET /api/employees` - Get all employees or search employees
  - Query parameter: `search` (optional) - Search term for filtering
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update existing employee
- `DELETE /api/employees/:id` - Delete employee

### Employee Data Model
```javascript
{
  id: string,           // UUID
  name: string,         // Employee full name (required)
  email: string,        // Email address (required, unique)
  position: string,     // Job position (required)
  created_at: string,   // ISO timestamp
  updated_at: string    // ISO timestamp
}
```

## 🎨 Design Choices & Assumptions

### Database Design
- **SQLite**: Chose SQLite for simplicity and portability. No external database setup required.
- **UUID Primary Keys**: Using UUIDs instead of auto-incrementing integers for better distributed system compatibility.
- **Timestamps**: Automatic tracking of creation and update times for audit purposes.
- **Email Uniqueness**: Enforced unique constraint on email addresses to prevent duplicates.

### Architecture Decisions
- **Separation of Concerns**: Clear separation between models, routes, and database logic.
- **Service Layer**: Frontend uses a dedicated service layer for API communication.
- **Error Handling**: Comprehensive error handling on both frontend and backend.
- **Validation**: Dual validation (frontend for UX, backend for security).

### Frontend Design
- **Modal-based Editing**: Chose modals over separate pages for better user flow.
- **Real-time Search**: Immediate feedback as users type in the search box.
- **Responsive Design**: Mobile-first approach with responsive breakpoints.
- **Professional Aesthetics**: Clean, modern design suitable for business applications.

### Security & Validation
- **Input Sanitization**: All inputs are validated and sanitized.
- **Email Validation**: Proper email format validation using regex.
- **SQL Injection Prevention**: Using parameterized queries throughout.
- **Error Messages**: User-friendly error messages without exposing system details.

### Testing Strategy
- **Backend Testing**: Focus on API endpoints and business logic.
- **Test Database**: Using in-memory SQLite for tests to avoid affecting development data.
- **Comprehensive Coverage**: All CRUD operations and edge cases covered.

## 🚀 Production Considerations

For production deployment, consider:

1. **Database**: Migrate to PostgreSQL or MySQL for production workloads
2. **Environment Variables**: Use proper environment configuration
3. **Authentication**: Add user authentication and authorization
4. **Rate Limiting**: Implement API rate limiting
5. **Logging**: Add comprehensive logging with tools like Winston
6. **Caching**: Implement Redis or similar for caching
7. **SSL/HTTPS**: Ensure secure connections
8. **Database Migrations**: Implement proper database migration system
9. **Backup Strategy**: Regular database backups
10. **Monitoring**: Application and database monitoring

## 🤝 Contributing

This is an assignment project, but the code is structured to allow easy extension and modification. The modular architecture makes it simple to add new features or modify existing functionality.

## 📝 License

This project is created for educational/assignment purposes.