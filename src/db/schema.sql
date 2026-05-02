-- Drop tables if they exist (for clean migrations)
DROP TABLE IF EXISTS participation CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

-- Create staff table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    profile_picture VARCHAR(500),
    bio TEXT,
    skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    technologies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create participation table (join table for staff and projects)
CREATE TABLE participation (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL,
    staff_name VARCHAR(255),
    project_id INTEGER NOT NULL,
    project_name VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    responsibilities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT,
    UNIQUE (staff_id, project_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_participation_staff_id ON participation(staff_id);
CREATE INDEX idx_participation_project_id ON participation(project_id);
CREATE INDEX idx_projects_start_date ON projects(start_date);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participation_updated_at BEFORE UPDATE ON participation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
INSERT INTO staff (name, email, phone, bio, skills) VALUES
    ('John Doe', 'john.doe@example.com', '+1234567890', 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code and modern web technologies.', 'JavaScript, TypeScript, Node.js, React'),
    ('Jane Smith', 'jane.smith@example.com', '+1234567891', 'Backend engineer specializing in cloud infrastructure and database optimization. Strong focus on system reliability and performance.', 'Python, Django, PostgreSQL, Docker');

INSERT INTO projects (name, client, location, start_date, end_date, technologies) VALUES
    ('E-Commerce Platform', 'ABC Corp', 'New York', '2024-01-15', '2024-06-30', 'React, Node.js, PostgreSQL'),
    ('Mobile App Development', 'XYZ Inc', 'San Francisco', '2024-03-01', '2024-09-30', 'React Native, Firebase');

INSERT INTO participation (staff_id, staff_name, project_id, project_name, role, responsibilities) VALUES
    (1, 'John Doe', 1, 'E-Commerce Platform', 'Full Stack Developer', 'Develop frontend and backend features, API integration'),
    (2, 'Jane Smith', 2, 'Mobile App Development', 'Backend Developer', 'Design database schema, develop REST APIs');
