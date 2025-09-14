-- Hospital Appointment Booking System Database Schema
-- This script creates the normalized database structure with proper foreign keys

-- Users table: store patient/user information
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    age INT,
    pfpUrl VARCHAR(255),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table: store doctor details
CREATE TABLE Doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT,
    timeranges TEXT, -- store as comma-separated time slots for simplicity
    yoe INT, -- years of experience
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table: track patient-doctor appointments
CREATE TABLE Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientid INT NOT NULL,
    doctorid INT NOT NULL,
    time DATETIME NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    cancelled BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientid) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorid) REFERENCES Doctors(id) ON DELETE CASCADE,
    -- Ensure no double booking for same doctor at same time
    UNIQUE KEY unique_doctor_time (doctorid, time)
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_patient ON Appointments(patientid);
CREATE INDEX idx_appointments_doctor ON Appointments(doctorid);
CREATE INDEX idx_appointments_time ON Appointments(time);
CREATE INDEX idx_doctors_department ON Doctors(department);
