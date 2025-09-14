# Hospital Appointment Booking System

A comprehensive hospital management system built with React (TypeScript) frontend and Flask (Python) backend, featuring patient registration, doctor management, appointment booking, and admin dashboard.

## Features

### Patient Features
- **User Registration & Authentication**: Secure patient registration and login
- **Doctor Discovery**: Browse doctors by department with search and filtering
- **Appointment Booking**: Select available time slots and book appointments
- **Appointment Management**: View upcoming, past, and cancelled appointments

### Admin Features
- **Dashboard Overview**: System statistics and health monitoring
- **Doctor Management**: Full CRUD operations for healthcare professionals
- **Appointment Management**: View all appointments and update statuses
- **User Management**: Monitor registered patients and user activity

### Technical Features
- **Responsive Design**: Mobile-first approach with professional healthcare UI
- **Real-time Updates**: Dynamic data fetching and state management
- **Secure Authentication**: Session-based auth with role-based access control
- **Database Integration**: MySQL with proper normalization and foreign keys

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS v4** for styling
- **Shadcn/UI** components
- **Lucide React** icons

### Backend
- **Python Flask** REST API
- **MySQL** database
- **Flask-CORS** for cross-origin requests
- **mysql-connector-python** for database operations

## Project Structure

\`\`\`
hospital-booking-system/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Homepage
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── doctors/page.tsx         # Doctors listing
│   ├── book/[doctorId]/page.tsx # Appointment booking
│   ├── appointments/page.tsx    # User appointments
│   ├── admin/page.tsx           # Admin dashboard
│   ├── departments/page.tsx     # Departments (static)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # Shadcn/UI components
│   ├── auth/                    # Authentication components
│   ├── admin/                   # Admin dashboard components
│   ├── booking/                 # Appointment booking components
│   └── ...                      # Other components
├── contexts/                     # React contexts
│   └── auth-context.tsx         # Authentication context
├── lib/                         # Utility functions
│   ├── utils.ts                 # General utilities
│   └── api.ts                   # API helper functions
├── backend/                     # Flask backend
│   ├── app.py                   # Main Flask application
│   ├── .env                     # Environment variables
│   └── requirements.txt         # Python dependencies
└── scripts/                     # Database scripts
    ├── 01-create-schema.sql     # Database schema
    └── 02-seed-data.sql         # Sample data
\`\`\`

## Database Schema

### Users Table
- Patient information and authentication
- Fields: id, fname, lname, age, email, phone, password

### Doctors Table
- Healthcare professional profiles
- Fields: id, fname, lname, department, description, timeranges, yoe

### Appointments Table
- Appointment bookings and status
- Fields: id, patientid, doctorid, time, completed, cancelled
- Foreign keys to Users and Doctors tables

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MySQL 8.0+

### Database Setup
1. Create a MySQL database named `hospital_booking`
2. Run the SQL scripts in the `scripts/` directory:
   \`\`\`sql
   -- Run 01-create-schema.sql first
   -- Then run 02-seed-data.sql for sample data
   \`\`\`

### Backend Setup
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. Configure environment variables in `.env`:
   \`\`\`env
   DB_HOST=localhost
   DB_NAME=hospital_booking
   DB_USER=root
   DB_PASSWORD=your_password
   DB_PORT=3306
   SECRET_KEY=your-secret-key
   ADMIN_EMAIL=admin@hospital.com
   ADMIN_PASSWORD=admin123
   \`\`\`

5. Start the Flask server:
   \`\`\`bash
   python app.py
   \`\`\`
   The API will be available at `http://localhost:5000`

### Frontend Setup
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   The application will be available at `http://localhost:3000`

## Usage

### For Patients
1. **Register**: Create a new account with personal information
2. **Browse Doctors**: View available doctors by department
3. **Book Appointment**: Select a doctor and available time slot
4. **Manage Appointments**: View and track appointment status

### For Administrators
1. **Login**: Use admin credentials (admin@hospital.com / admin123)
2. **Dashboard**: Monitor system statistics and health
3. **Manage Doctors**: Add, edit, or remove healthcare professionals
4. **Manage Appointments**: Update appointment statuses
5. **View Users**: Monitor registered patients

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user
- `POST /api/admin/login` - Admin login
- `GET /api/admin/check` - Check admin status

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add doctor (admin only)
- `PUT /api/doctors/:id` - Update doctor (admin only)
- `DELETE /api/doctors/:id` - Delete doctor (admin only)

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment status (admin only)

### Users
- `GET /api/users` - Get all users (admin only)

## Security Features

- **Session-based Authentication**: Secure user sessions with Flask
- **Role-based Access Control**: Separate permissions for patients and admins
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin request handling

## Design Features

- **Healthcare Theme**: Professional medical color palette (cyan/blue)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages and validation

## Development Notes

- **No Password Hashing**: For educational purposes, passwords are stored in plain text
- **Simple Admin Auth**: Basic email/password check against environment variables
- **Local Development**: Configured for localhost development environment
- **Database Normalization**: Proper 1NF, 2NF, 3NF compliance with foreign keys

## Contributing

This is an educational project demonstrating full-stack web development with React and Flask. Feel free to extend the functionality or improve the codebase.

## License

This project is for educational purposes only.
\`\`\`

```json file="" isHidden
