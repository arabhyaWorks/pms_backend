-- CREATE DATABASE IF NOT EXISTS projectManagementSystem;
-- USE projectManagementSystem;

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_status VARCHAR(50),
    project_goal TEXT,
    project_department VARCHAR(255),
    department_id INT,
    executing_agency VARCHAR(255),
    executing_agency_id INT,
    scheme VARCHAR(255),
    description TEXT,
    fund_sanctioned_by VARCHAR(255),
    concerned_official_name TEXT,
    concerned_project_manager TEXT,
    project_sanction_date DATE,
    project_financial_approval_go_number VARCHAR(255),
    project_financial_approval_date DATE,
    actual_project_start_date DATE,
    project_completion_date DATE,
    revised_project_sanction_date DATE,
    revised_project_completion_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    work_order_formation_date DATE,
    land_handover_date DATE,
    contact_information INT,
    last_updated_date DATETIME,
    last_updated_date_on_cmis DATETIME,
    project_handover_date DATE,
    project_handover_to VARCHAR(255),
    parallel_requirements TEXT,
    total_approved_budget DECIMAL(15, 2),
    revised_project_cost DECIMAL(15, 2),
    approved_project_cost DECIMAL(15, 2),
    contract_date DATE,
    contract_cost DECIMAL(15, 2),
    total_released_funds TEXT,
    total_expenditure TEXT,
    delay_reason TEXT
);

CREATE TABLE entity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    entity_type TINYINT(1),
    status TINYINT(1) DEFAULT 1
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_phone VARCHAR(15),
    user_designation VARCHAR(255),
    user_password VARCHAR(255) NOT NULL,
    user_role TINYINT(1),
    entity_id INT,
    entity_name VARCHAR(255),
    status TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE meeting_instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    date DATE,
    compliance TEXT,
    project_id INT,
    feedback TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE project_inspections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inspection_date DATE,
    official_name VARCHAR(255),
    official_email VARCHAR(255),
    official_phone VARCHAR(15),
    official_designation VARCHAR(255),
    official_department VARCHAR(255),
    inspection_type VARCHAR(255),
    inspection_instruction TEXT,
    inspection_status VARCHAR(255),
    inspection_report VARCHAR(255),
    project_id INT,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE project_essential_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(255),
    date_of_sample_collection DATE,
    sampling_authority VARCHAR(255),
    sample_test_lab_name VARCHAR(255),
    sample_test_report VARCHAR(255),
    sample_collection_site_images TEXT, -- Changed from JSON to TEXT for MySQL 5.5 compatibility
    project_id INT,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE project_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255),
    image_description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    elevation DECIMAL(8, 2),
    accuracy DECIMAL(8, 2),
    time DATETIME,
    project_id INT,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    milestone_name VARCHAR(255),
    milestone_from_date DATE,
    milestone_completion_date DATE,
    milestone_actual_completion_date DATE,
    milestone_status VARCHAR(255),
    milestone_description TEXT,
    milestone_progress DECIMAL(5, 2),
    delay_reason VARCHAR(255),
    project_id INT,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_name VARCHAR(255),
    issue_description TEXT,
    issue_raised_by INT,
    issue_raised_date DATE,
    assigned_to INT,
    issue_reported_on DATE,
    issue_status VARCHAR(255),
    issue_closed_date DATE,
    issue_closed_by INT,
    project_id INT,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE budget_installments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    installment_amount DECIMAL(15, 2),
    installment_expenditure DECIMAL(15, 2),
    amount_received_date DATE,
    utilization_certificate VARCHAR(255),
    project_id INT,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);