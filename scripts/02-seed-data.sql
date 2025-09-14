-- Seed data for Hospital Appointment Booking System

-- Insert sample doctors
INSERT INTO Doctors (fname, lname, department, description, timeranges, yoe) VALUES
('Dr. Sarah', 'Johnson', 'Cardiology', 'Experienced cardiologist specializing in heart disease prevention and treatment.', '09:00,10:00,11:00,14:00,15:00,16:00', 12),
('Dr. Michael', 'Chen', 'Neurology', 'Neurologist with expertise in brain and nervous system disorders.', '08:00,09:00,10:00,13:00,14:00,15:00', 8),
('Dr. Emily', 'Rodriguez', 'Pediatrics', 'Pediatrician dedicated to providing comprehensive care for children and adolescents.', '09:00,10:00,11:00,13:00,14:00,15:00,16:00', 15),
('Dr. James', 'Wilson', 'Orthopedics', 'Orthopedic surgeon specializing in bone, joint, and muscle treatments.', '08:00,09:00,10:00,14:00,15:00', 10),
('Dr. Lisa', 'Thompson', 'Dermatology', 'Dermatologist focusing on skin health and cosmetic procedures.', '10:00,11:00,13:00,14:00,15:00,16:00', 7),
('Dr. Robert', 'Davis', 'Internal Medicine', 'Internal medicine physician providing comprehensive adult healthcare.', '08:00,09:00,10:00,11:00,13:00,14:00,15:00', 20),
('Dr. Maria', 'Garcia', 'Gynecology', 'Gynecologist specializing in women\'s reproductive health.', '09:00,10:00,11:00,14:00,15:00', 9),
('Dr. David', 'Brown', 'Psychiatry', 'Psychiatrist providing mental health care and therapy services.', '09:00,10:00,13:00,14:00,15:00,16:00', 11);

-- Insert sample users (patients)
INSERT INTO Users (fname, lname, age, email, phone, password) VALUES
('John', 'Doe', 35, 'john.doe@email.com', '555-0101', 'password123'),
('Jane', 'Smith', 28, 'jane.smith@email.com', '555-0102', 'password123'),
('Mike', 'Johnson', 42, 'mike.johnson@email.com', '555-0103', 'password123'),
('Sarah', 'Williams', 31, 'sarah.williams@email.com', '555-0104', 'password123'),
('Tom', 'Brown', 55, 'tom.brown@email.com', '555-0105', 'password123');

-- Insert sample appointments
INSERT INTO Appointments (patientid, doctorid, time, completed) VALUES
(1, 1, '2024-01-15 09:00:00', TRUE),
(2, 3, '2024-01-16 10:00:00', TRUE),
(3, 2, '2024-01-17 14:00:00', FALSE),
(4, 4, '2024-01-18 15:00:00', FALSE),
(5, 1, '2024-01-19 11:00:00', FALSE);
