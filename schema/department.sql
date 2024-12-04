USE project_management_system;

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    department_head VARCHAR(255) NOT NULL,
    department_email VARCHAR(255) NOT NULL,
    number_of_projects INT DEFAULT 0,
    status TINYINT(1) DEFAULT 1
);