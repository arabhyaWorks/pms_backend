CREATE DATABASE IF NOT EXISTS project_management_system;
USE project_management_system;


-- Main Project Table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    project_objectives TEXT,
    project_department VARCHAR(255) NOT NULL,
    project_status VARCHAR(100),
    project_approval_date DATE,
    approved_project_cost DECIMAL(15, 2),
    contract_date DATE,
    contract_cost DECIMAL(15, 2),
    total_released_funds DECIMAL(15, 2),
    total_expenditure DECIMAL(15, 2),
    project_start_date DATE,
    original_completion_date DATE,
    revised_completion_date DATE,
    last_fund_received_date DATE,
    utilization_certificate_submission_date DATE,
    government_approval_date_and_order VARCHAR(255),
    delay_reason TEXT,
    scheme_name VARCHAR(255),
    land_availability_date DATE,
    geo_tagged_photos_last_month TEXT,
    geo_tagged_photos_current_month TEXT,
    last_updated_date DATE,
    last_updated_date_on_cmis DATE,
    project_handover_date DATE,
    project_handover_to VARCHAR(255),
    parallel_requirements TEXT
);

-- Meeting Instructions Table
CREATE TABLE meeting_instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    description TEXT,
    date DATE,
    compliance TEXT,
    feedback TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Project Manager Table
CREATE TABLE project_managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    official_name VARCHAR(255),
    official_email VARCHAR(255),
    official_phone VARCHAR(15),
    official_designation VARCHAR(255),
    official_department VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Concerned Officials Table
CREATE TABLE concerned_officials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    official_name VARCHAR(255),
    official_email VARCHAR(255),
    official_phone VARCHAR(15),
    official_designation VARCHAR(255),
    official_department VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Project Inspections Table
CREATE TABLE project_inspections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    inspection_date DATE,
    inspection_type VARCHAR(255),
    inspection_instruction TEXT,
    inspection_status VARCHAR(100),
    inspection_report VARCHAR(255),
    official_name VARCHAR(255),
    official_email VARCHAR(255),
    official_phone VARCHAR(15),
    official_designation VARCHAR(255),
    official_department VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Project Essential Tests Table
CREATE TABLE project_essential_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    test_name VARCHAR(255),
    date_of_sample_collection DATE,
    sampling_authority VARCHAR(255),
    sample_test_lab_name VARCHAR(255),
    sample_test_report VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Sample Collection Site Images Table
CREATE TABLE sample_collection_site_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    essential_test_id INT,
    image VARCHAR(255),
    FOREIGN KEY (essential_test_id) REFERENCES project_essential_tests(id)
);

-- Project Gallery Table
CREATE TABLE project_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    image VARCHAR(255),
    image_description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    elevation DECIMAL(10, 2),
    accuracy DECIMAL(5, 2),
    time DATETIME,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Milestones Table
CREATE TABLE milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    milestone_name VARCHAR(255),
    milestone_from_date DATE,
    milestone_completion_date DATE,
    milestone_actual_completion_date DATE,
    milestone_status VARCHAR(100),
    milestone_description TEXT,
    milestone_progress DECIMAL(5, 2),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Issues Table
CREATE TABLE issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    issue_name VARCHAR(255),
    issue_description TEXT,
    issue_raised_by VARCHAR(255),
    issue_raised_date DATE,
    assigned_to VARCHAR(255),
    issue_reported_on DATE,
    issue_status VARCHAR(100),
    issue_closed_date DATE,
    issue_closed_by VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Budget Installments Table
CREATE TABLE budget_installments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    installment_amount DECIMAL(15, 2),
    amount_received_date DATE,
    utilization_certificate VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);