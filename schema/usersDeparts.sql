USE project_management_system;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    official_name VARCHAR(255) NOT NULL,
    official_email VARCHAR(255) NOT NULL UNIQUE,
    official_phone VARCHAR(15),
    official_designation VARCHAR(255),
    official_department VARCHAR(255),
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL, -- e.g., 1 for Admin, 2 for Manager, 3 for User
    department_id INT,
    status TINYINT DEFAULT 1, -- 1 for Active, 0 for Inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);