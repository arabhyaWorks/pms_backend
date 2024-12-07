-- CREATE DATABASE testing;
-- USE testing;



-- CREATE TABLE entity (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     entity_name VARCHAR(255) NOT NULL,
--     entity_type TINYINT(1),
--     status TINYINT(1) DEFAULT 1
-- );


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_phone VARCHAR(15),
    user_designation VARCHAR(255),
    user_department VARCHAR(255),
    user_password VARCHAR(255) NOT NULL,
    user_role TINYINT(1), -- 1 for Admin, 2 for Manager, 3 for User
    entity_id INT,
    status TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);