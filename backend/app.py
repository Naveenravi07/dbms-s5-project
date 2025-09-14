from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Enable CORS for React frontend
CORS(app, supports_credentials=True)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'hospital_booking'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Admin credentials
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@hospital.com')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def execute_query(query, params=None, fetch=False):
    """Execute a database query"""
    connection = get_db_connection()
    if not connection:
        return None
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.rowcount
            
        return result
    except Error as e:
        print(f"Database error: {e}")
        return None
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['fname', 'lname', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if user already exists
    existing_user = execute_query(
        "SELECT id FROM Users WHERE email = %s", 
        (data['email'],), 
        fetch=True
    )
    
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400
    
    # Insert new user
    query = """
        INSERT INTO Users (fname, lname, age, email, phone, password) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    params = (
        data['fname'], 
        data['lname'], 
        data.get('age'), 
        data['email'], 
        data.get('phone'), 
        data['password']
    )
    
    result = execute_query(query, params)
    
    if result:
        return jsonify({'message': 'User registered successfully'}), 201
    else:
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Check credentials
    user = execute_query(
        "SELECT * FROM Users WHERE email = %s AND password = %s", 
        (email, password), 
        fetch=True
    )
    
    if user:
        session['user_id'] = user[0]['id']
        session['user_email'] = user[0]['email']
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user[0]['id'],
                'fname': user[0]['fname'],
                'lname': user[0]['lname'],
                'email': user[0]['email']
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        session['admin'] = True
        return jsonify({'message': 'Admin login successful'}), 200
    else:
        return jsonify({'error': 'Invalid admin credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout user or admin"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

# Get current user info for auth context
@app.route('/api/user', methods=['GET'])
def get_current_user():
    """Get current user information"""
    if not session.get('user_id'):
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = execute_query(
        "SELECT id, fname, lname, email FROM Users WHERE id = %s", 
        (session['user_id'],), 
        fetch=True
    )
    
    if user:
        return jsonify(user[0]), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Doctor Routes
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    """Get all doctors"""
    doctors = execute_query("SELECT * FROM Doctors ORDER BY fname, lname", fetch=True)
    return jsonify(doctors or []), 200

@app.route('/api/doctors', methods=['POST'])
def add_doctor():
    """Add a new doctor (admin only)"""
    if not session.get('admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    required_fields = ['fname', 'lname', 'department']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    query = """
        INSERT INTO Doctors (fname, lname, department, description, timeranges, yoe) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    params = (
        data['fname'],
        data['lname'],
        data['department'],
        data.get('description', ''),
        data.get('timeranges', ''),
        data.get('yoe', 0)
    )
    
    result = execute_query(query, params)
    
    if result:
        return jsonify({'message': 'Doctor added successfully'}), 201
    else:
        return jsonify({'error': 'Failed to add doctor'}), 500

@app.route('/api/doctors/<int:doctor_id>', methods=['PUT'])
def update_doctor(doctor_id):
    """Update doctor information (admin only)"""
    if not session.get('admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    query = """
        UPDATE Doctors 
        SET fname = %s, lname = %s, department = %s, description = %s, timeranges = %s, yoe = %s
        WHERE id = %s
    """
    params = (
        data.get('fname'),
        data.get('lname'),
        data.get('department'),
        data.get('description', ''),
        data.get('timeranges', ''),
        data.get('yoe', 0),
        doctor_id
    )
    
    result = execute_query(query, params)
    
    if result:
        return jsonify({'message': 'Doctor updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update doctor'}), 500

@app.route('/api/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    """Delete a doctor (admin only)"""
    if not session.get('admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    result = execute_query("DELETE FROM Doctors WHERE id = %s", (doctor_id,))
    
    if result:
        return jsonify({'message': 'Doctor deleted successfully'}), 200
    else:
        return jsonify({'error': 'Failed to delete doctor'}), 500

# Appointment Routes
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    """Get appointments (all for admin, user's own for regular users)"""
    if session.get('admin'):
        # Admin sees all appointments
        query = """
            SELECT a.*, u.fname as patient_fname, u.lname as patient_lname, u.email as patient_email,
                   d.fname as doctor_fname, d.lname as doctor_lname, d.department
            FROM Appointments a
            JOIN Users u ON a.patientid = u.id
            JOIN Doctors d ON a.doctorid = d.id
            ORDER BY a.time DESC
        """
        appointments = execute_query(query, fetch=True)
    elif session.get('user_id'):
        # Regular user sees only their appointments
        query = """
            SELECT a.*, d.fname as doctor_fname, d.lname as doctor_lname, d.department
            FROM Appointments a
            JOIN Doctors d ON a.doctorid = d.id
            WHERE a.patientid = %s
            ORDER BY a.time DESC
        """
        appointments = execute_query(query, (session['user_id'],), fetch=True)
    else:
        return jsonify({'error': 'Authentication required'}), 401
    
    return jsonify(appointments or []), 200

@app.route('/api/appointments', methods=['POST'])
def book_appointment():
    """Book a new appointment"""
    if not session.get('user_id'):
        return jsonify({'error': 'User login required'}), 401
    
    data = request.get_json()
    
    if not data.get('doctorid') or not data.get('time'):
        return jsonify({'error': 'Doctor ID and time are required'}), 400
    
    # Check if the time slot is available
    existing = execute_query(
        "SELECT id FROM Appointments WHERE doctorid = %s AND time = %s AND cancelled = FALSE",
        (data['doctorid'], data['time']),
        fetch=True
    )
    
    if existing:
        return jsonify({'error': 'Time slot is already booked'}), 400
    
    query = """
        INSERT INTO Appointments (patientid, doctorid, time) 
        VALUES (%s, %s, %s)
    """
    params = (session['user_id'], data['doctorid'], data['time'])
    
    result = execute_query(query, params)
    
    if result:
        return jsonify({'message': 'Appointment booked successfully'}), 201
    else:
        return jsonify({'error': 'Failed to book appointment'}), 500

@app.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    """Update appointment status (admin only)"""
    if not session.get('admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    query = "UPDATE Appointments SET completed = %s, cancelled = %s WHERE id = %s"
    params = (
        data.get('completed', False),
        data.get('cancelled', False),
        appointment_id
    )
    
    result = execute_query(query, params)
    
    if result:
        return jsonify({'message': 'Appointment updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update appointment'}), 500

# User management (admin only)
@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users (admin only)"""
    if not session.get('admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    users = execute_query("SELECT id, fname, lname, age, email, phone, createdAt FROM Users ORDER BY fname, lname", fetch=True)
    return jsonify(users or []), 200

# Admin check endpoint for persistent admin authentication
@app.route('/api/admin/check', methods=['GET'])
def check_admin():
    """Check if current session has admin privileges"""
    if session.get('admin'):
        return jsonify({'message': 'Admin authenticated'}), 200
    else:
        return jsonify({'error': 'Not authenticated as admin'}), 401

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'OK', 'message': 'Hospital Booking API is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
