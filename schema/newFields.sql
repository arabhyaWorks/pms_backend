-- ALTER TABLE projects 
-- -- ADD COLUMN approved_project_cost DECIMAL(15,2),
-- -- ADD COLUMN contract_date DATE,
-- -- ADD COLUMN contract_cost DECIMAL(15,2);

-- ADD COLUMN total_released_funds TEXT, 
-- ADD COLUMN total_expenditure TEXT, 
-- ADD COLUMN delay_reason TEXT,


-- ALTER TABLE projects 
-- ADD COLUMN total_released_funds TEXT, 
-- ADD COLUMN total_expenditure TEXT, 
-- ADD COLUMN delay_reason TEXT;



-- ALTER TABLE milestones
-- ADD COLUMN delay_reason VARCHAR(255);

ALTER TABLE milestones
ADD COLUMN status TINYINT(1) DEFAULT 1 ;
