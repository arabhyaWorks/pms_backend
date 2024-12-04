const express = require("express");
const db = require("./database"); // Import the database connection
const app = express();

app.use(express.json());

// Fetch all data for a project by ID
app.get("/api/old-system/project/:id", async (req, res) => {
  const projectId = req.params.id;

  try {
    // SQL query to fetch all relevant data for the project
    const query = `
      SELECT 
        p.project_id, p.project_name, p.project_description, p.project_status,
        m.task_name AS milestone_name, m.task_start_date, m.task_end_date, m.task_percent_complete AS milestone_progress,
        i.inspection_title, i.inspection_date, i.inspection_instruction, i.auth_name AS inspection_official_name,
        b.installment_amount, b.ammount_recieved_date, b.utilization_certificate,
        c.dept_name AS department_name, c.dept_id AS department_id
      FROM 
        projects AS p
      LEFT JOIN 
        milestones AS m ON p.project_id = m.project_id
      LEFT JOIN 
        inspections AS i ON p.project_id = i.project_id
      LEFT JOIN 
        budgets AS b ON p.project_id = b.project_id
      LEFT JOIN 
        departments AS c ON p.project_department = c.dept_id
      WHERE 
        p.project_id = ?;
    `;

    const [rows] = await db.promise().query(query, [projectId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No project found with the given ID" });
    }

    // Transform the data into the desired JSON format
    const projectData = {
      projectId: rows[0].project_id,
      projectName: rows[0].project_name,
      projectDescription: rows[0].project_description,
      projectStatus: rows[0].project_status,
      department: {
        departmentId: rows[0].department_id,
        departmentName: rows[0].department_name,
      },
      mileStones: rows.map((row) => ({
        milestoneName: row.milestone_name,
        milestoneFromDate: row.task_start_date,
        milestoneCompletionDate: row.task_end_date,
        milestoneProgress: row.milestone_progress,
      })),
      projectInspection: rows.map((row) => ({
        inspectionTitle: row.inspection_title,
        inspectionDate: row.inspection_date,
        inspectionInstruction: row.inspection_instruction,
        inspectionOfficialName: row.inspection_official_name,
      })),
      budgetInstallments: rows.map((row) => ({
        installmentAmount: row.installment_amount,
        amountReceivedDate: row.ammount_recieved_date,
        utilizationCertificate: row.utilization_certificate,
      })),
    };

    res.status(200).json(projectData);
  } catch (error) {
    console.error("Error fetching project data:", error.message);
    res.status(500).json({ error: "An error occurred while fetching project data" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});