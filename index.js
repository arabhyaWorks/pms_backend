const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./database");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hey there this is api");
});

app.post("/api/wholeDataUpload", async (req, res) => {
  const data = req.body;

  try {
    const connection = await db.promise();

    await connection.beginTransaction();

    const [projectResult] = await connection.query(
      `INSERT INTO projects (
        project_name, project_description, project_department, project_status, 
        project_approval_date, approved_project_cost, contract_date, 
        contract_cost, total_released_funds, total_expenditure, 
        project_start_date, original_completion_date, revised_completion_date, 
        government_approval_date_and_order, delay_reason, scheme_name, 
        land_availability_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.projectName,
        data.projectDescription,
        data.projectDepartment,
        data.projectStatus,
        data.projectApprovalDate,
        data.approvedProjectCost,
        data.contractDate,
        data.contractCost,
        data.totalReleasedFunds,
        data.totalExpenditure,
        data.projectStartDate,
        data.originalCompletionDate,
        data.revisedCompletionDate,
        data.governmentApprovalDateAndOrder,
        data.delayReason,
        data.schemeName,
        data.landAvailabilityDate,
      ]
    );

    const projectId = projectResult.insertId;

    for (const instruction of data.meetingInstructions) {
      await connection.query(
        `INSERT INTO meeting_instructions (project_id, description, date, compliance, feedback) VALUES (?, ?, ?, ?, ?)`,
        [
          projectId,
          instruction.desc,
          instruction.date,
          instruction.compliance,
          instruction.feedback,
        ]
      );
    }

    await connection.query(
      `INSERT INTO project_managers (project_id, official_name, official_email, official_phone, official_designation, official_department) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        data.projectManager.officialName,
        data.projectManager.officialEmail,
        data.projectManager.officialPhone,
        data.projectManager.officialDesignation,
        data.projectManager.officialDepartment,
      ]
    );

    for (const official of data.concernedOfficial) {
      await connection.query(
        `INSERT INTO concerned_officials (project_id, official_name, official_email, official_phone, official_designation, official_department) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          official.officialName,
          official.officialEmail,
          official.officialPhone,
          official.officialDesignation,
          official.officialDepartment,
        ]
      );
    }

    for (const inspection of data.projectInspection) {
      await connection.query(
        `INSERT INTO project_inspections (project_id, inspection_date, inspection_type, inspection_instruction, inspection_status, inspection_report) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          inspection.inspectionDate,
          inspection.InspectionType,
          inspection.inspectionInstruction,
          inspection.inspectionStatus,
          inspection.inspectionReport,
        ]
      );
    }

    for (const test of data.projectEssentialTest) {
      const [testResult] = await connection.query(
        `INSERT INTO project_essential_tests (project_id, test_name, date_of_sample_collection, sampling_authority, sample_test_lab_name, sample_test_report) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          test.testName,
          test.dateOfSampleCollection,
          test.samplingAuthority,
          test.sampleTestLabName,
          test.sampleTestReport,
        ]
      );

      const testId = testResult.insertId;

      for (const image of test.sampleCollectionSiteImage) {
        await connection.query(
          `INSERT INTO sample_collection_site_images (essential_test_id, image) VALUES (?, ?)`,
          [testId, image]
        );
      }
    }

    for (const gallery of data.projectGallery) {
      await connection.query(
        `INSERT INTO project_gallery (project_id, image, image_description, latitude, longitude, elevation, accuracy, time) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          gallery.image,
          gallery.imageDescription,
          gallery.lattitude,
          gallery.longitude,
          gallery.elevation,
          gallery.accuracy,
          gallery.time,
        ]
      );
    }

    for (const milestone of data.mileStones) {
      await connection.query(
        `INSERT INTO milestones (project_id, milestone_name, milestone_from_date, milestone_completion_date, milestone_actual_completion_date, milestone_status, milestone_description, milestone_progress) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          milestone.milestoneName,
          milestone.milestoneFromDate,
          milestone.milestoneCompletionDate,
          milestone.milestoneActualCompletionDate,
          milestone.milestoneStatus,
          milestone.milestoneDescription,
          milestone.milestoneProgress,
        ]
      );
    }

    for (const issue of data.issues) {
      await connection.query(
        `INSERT INTO issues (project_id, issue_name, issue_description, issue_raised_by, issue_raised_date, assigned_to, issue_reported_on, issue_status, issue_closed_date, issue_closed_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          issue.issueName,
          issue.issueDescription,
          issue.issueRaisedBy,
          issue.issueRaisedDate,
          issue.assignedTo,
          issue.issueReportedOn,
          issue.issueStatus,
          issue.issueClosedDate,
          issue.issueClosedBy,
        ]
      );
    }

    for (const installment of data.budegetInstallment) {
      await connection.query(
        `INSERT INTO budget_installments (project_id, installment_amount, amount_received_date, utilization_certificate) 
         VALUES (?, ?, ?, ?)`,
        [
          projectId,
          installment.installmentAmount,
          installment.amountRecievedDate,
          installment.utilizationCertificate,
        ]
      );
    }

    await connection.commit();
    res.json({ message: "Project data uploaded successfully!", projectId });
  } catch (error) {
    console.error("Error uploading project data:", error.message);
    res.status(500).json({ error: "Failed to upload project data" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  const projectId = req.params.id;

  try {
    const connection = await db.promise();

    // Fetch project details
    const [projectRows] = await connection.query(
      `SELECT 
        id, 
        project_name AS projectName,
        project_description AS projectDescription,
        project_department AS projectDepartment,
        project_status AS projectStatus,
        project_approval_date AS projectApprovalDate,
        approved_project_cost AS approvedProjectCost,
        contract_date AS contractDate,
        contract_cost AS contractCost,
        total_released_funds AS totalReleasedFunds,
        total_expenditure AS totalExpenditure,
        project_start_date AS projectStartDate,
        original_completion_date AS originalCompletionDate,
        revised_completion_date AS revisedCompletionDate,
        government_approval_date_and_order AS governmentApprovalDateAndOrder,
        delay_reason AS delayReason,
        scheme_name AS schemeName,
        land_availability_date AS landAvailabilityDate
      FROM projects WHERE id = ?`,
      [projectId]
    );

    if (projectRows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = projectRows[0];

    // Fetch milestones
    const [milestones] = await connection.query(
      `SELECT 
        milestone_name AS milestoneName,
        milestone_from_date AS milestoneFromDate,
        milestone_completion_date AS milestoneCompletionDate,
        milestone_actual_completion_date AS milestoneActualCompletionDate,
        milestone_status AS milestoneStatus,
        milestone_description AS milestoneDescription,
        milestone_progress AS milestoneProgress
      FROM milestones WHERE project_id = ?`,
      [projectId]
    );

    // Calculate physical progress
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastMonthProgress = milestones.find(
      (milestone) =>
        new Date(milestone.milestoneFromDate) <= lastMonth &&
        new Date(milestone.milestoneCompletionDate) >= lastMonth
    )?.milestoneProgress;

    const currentMonthProgress = milestones.find(
      (milestone) =>
        new Date(milestone.milestoneFromDate) <= new Date() &&
        new Date(milestone.milestoneCompletionDate) >= new Date()
    )?.milestoneProgress;

    // Fetch meeting instructions
    const [meetingInstructions] = await connection.query(
      `SELECT 
        description AS \`desc\`,
        date,
        compliance,
        feedback
      FROM meeting_instructions WHERE project_id = ?`,
      [projectId]
    );

    // Fetch project inspections
    const [inspections] = await connection.query(
      `SELECT 
        inspection_date AS inspectionDate,
        inspection_type AS InspectionType,
        inspection_instruction AS inspectionInstruction,
        inspection_status AS inspectionStatus,
        inspection_report AS inspectionReport
      FROM project_inspections WHERE project_id = ?`,
      [projectId]
    );

    // Fetch budget installments
    const [budgetInstallments] = await connection.query(
      `SELECT 
        installment_amount AS installmentAmount,
        amount_received_date AS amountRecievedDate,
        utilization_certificate AS utilizationCertificate
      FROM budget_installments WHERE project_id = ?`,
      [projectId]
    );

    const utilizationCertificateSubmissionDate =
      budgetInstallments.length > 0
        ? budgetInstallments[budgetInstallments.length - 1].amountRecievedDate
        : null;

    // Fetch project gallery
    const [gallery] = await connection.query(
      `SELECT 
        image,
        image_description AS imageDescription,
        latitude AS lattitude,
        longitude,
        elevation,
        accuracy,
        time
      FROM project_gallery WHERE project_id = ?`,
      [projectId]
    );

    // Fetch project essential tests
    const [essentialTests] = await connection.query(
      `SELECT 
        id AS testId,
        test_name AS testName,
        date_of_sample_collection AS dateOfSampleCollection,
        sampling_authority AS samplingAuthority,
        sample_test_lab_name AS sampleTestLabName,
        sample_test_report AS sampleTestReport
      FROM project_essential_tests WHERE project_id = ?`,
      [projectId]
    );

    for (let test of essentialTests) {
      const [images] = await connection.query(
        `SELECT image FROM sample_collection_site_images WHERE essential_test_id = ?`,
        [test.testId]
      );
      test.sampleCollectionSiteImage = images.map((img) => img.image);
    }

    // Fetch concerned officials
    const [concernedOfficials] = await connection.query(
      `SELECT 
        official_name AS officialName,
        official_email AS officialEmail,
        official_phone AS officialPhone,
        official_designation AS officialDesignation,
        official_department AS officialDepartment
      FROM concerned_officials WHERE project_id = ?`,
      [projectId]
    );

    // Fetch project manager
    const [managerRows] = await connection.query(
      `SELECT 
        official_name AS officialName,
        official_email AS officialEmail,
        official_phone AS officialPhone,
        official_designation AS officialDesignation,
        official_department AS officialDepartment
      FROM project_managers WHERE project_id = ?`,
      [projectId]
    );
    const projectManager = managerRows[0] || {};

    // Fetch issues
    const [issues] = await connection.query(
      `SELECT 
        issue_name AS issueName,
        issue_description AS issueDescription,
        issue_raised_by AS issueRaisedBy,
        issue_raised_date AS issueRaisedDate,
        assigned_to AS assignedTo,
        issue_reported_on AS issueReportedOn,
        issue_status AS issueStatus,
        issue_closed_date AS issueClosedDate,
        issue_closed_by AS issueClosedBy
      FROM issues WHERE project_id = ?`,
      [projectId]
    );

    const formattedProject = {
      ...project,
      lastMonthPhysicalProgress: lastMonthProgress || "0%",
      currentMonthPhysicalProgress: currentMonthProgress || "0%",
      utilizationCertificateSubmissionDate,
      geoTaggedPhotosLastMonth: gallery[0]?.image || null,
      geoTaggedPhotosCurrentMonth: gallery[1]?.image || null,
      meetingInstructions,
      projectManager,
      concernedOfficial: concernedOfficials,
      projectInspection: inspections,
      projectEssentialTest: essentialTests,
      projectGallery: gallery,
      mileStones: milestones,
      issues,
      budegetInstallment: budgetInstallments,
    };

    res.json(formattedProject);
  } catch (error) {
    console.error("Error fetching project data:", error.message);
    res.status(500).json({ error: "Failed to fetch project data" });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const connection = await db.promise();

    const query = `
      SELECT 
        p.id,
        p.project_name AS projectName,
        p.project_status AS projectStatus,
        p.project_department AS projectDepartment,
        p.project_approval_date AS projectApprovalDate,
        p.approved_project_cost AS approvedProjectCost,
        p.contract_date AS contractDate,
        p.contract_cost AS contractCost,
        p.total_released_funds AS totalReleasedFunds,
        p.total_expenditure AS totalExpenditure,
        p.project_start_date AS projectStartDate,
        p.original_completion_date AS originalCompletionDate,
        p.revised_completion_date AS revisedCompletionDate,
        p.government_approval_date_and_order AS governmentApprovalDateAndOrder,
        p.delay_reason AS delayReason,
        p.scheme_name AS schemeName,
        p.land_availability_date AS landAvailabilityDate,
        -- Fetch derived data from milestone table
        MAX(CASE WHEN m.milestone_from_date <= DATE_SUB(NOW(), INTERVAL 1 MONTH) AND m.milestone_completion_date > DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN m.milestone_progress ELSE NULL END) AS lastMonthPhysicalProgress,
        MAX(CASE WHEN m.milestone_from_date <= NOW() AND m.milestone_completion_date > NOW() THEN m.milestone_progress ELSE NULL END) AS currentMonthPhysicalProgress,
        -- Fetch derived data from budget table
        MAX(b.amount_received_date) AS lastFundReceivedDate,
        MAX(b.utilization_certificate) AS utilizationCertificateSubmissionDate,
        -- Fetch derived data from gallery table
        MAX(g_last.image) AS geoTaggedPhotosLastMonth,
        MAX(g_current.image) AS geoTaggedPhotosCurrentMonth,
        -- Fetch derived data from meeting instructions
        MAX(mi.description) AS meetingInstructions,
        MAX(mi.compliance) AS complianceOfMeetingInstructions,
        MAX(mi.feedback) AS feedback
      FROM projects p
      LEFT JOIN milestones m ON p.id = m.project_id
      LEFT JOIN budget_installments b ON p.id = b.project_id
      LEFT JOIN project_gallery g_last ON p.id = g_last.project_id AND g_last.time <= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      LEFT JOIN project_gallery g_current ON p.id = g_current.project_id AND g_current.time <= NOW()
      LEFT JOIN meeting_instructions mi ON p.id = mi.project_id
      GROUP BY p.id
    `;

    const [projects] = await connection.query(query);

    res.json(projects.map((project) => ({
      ...project,
      lastMonthPhysicalProgress: `${project.lastMonthPhysicalProgress || 0}%`,
      currentMonthPhysicalProgress: `${project.currentMonthPhysicalProgress || 0}%`,
      approvedProjectCost: `₹${project.approvedProjectCost.toLocaleString()}`,
      contractCost: `₹${project.contractCost.toLocaleString()}`,
      totalReleasedFunds: `₹${project.totalReleasedFunds.toLocaleString()}`,
      totalExpenditure: `₹${project.totalExpenditure.toLocaleString()}`,
    })));
  } catch (error) {
    console.error("Error fetching project data:", error.message);
    res.status(500).json({ error: "Failed to fetch project data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
