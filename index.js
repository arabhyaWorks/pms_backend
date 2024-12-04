const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, param, validationResult } = require("express-validator");

const db = require("./database");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const validateRequest = (req, res, next) => {
  const { body } = req;

  for (const key in body) {
    if (body[key] === undefined || body[key] === null || body[key] === "") {
      return res.status(400).json({
        error: `The field "${key}" cannot be empty.`,
      });
    }
  }

  if (body.officialPhone && !/^\d{10}$/.test(body.officialPhone)) {
    return res.status(400).json({
      error: "Phone number must be exactly 10 digits.",
    });
  }

  next();
};

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

    res.json(
      projects.map((project) => ({
        ...project,
        lastMonthPhysicalProgress: `${project.lastMonthPhysicalProgress || 0}%`,
        currentMonthPhysicalProgress: `${
          project.currentMonthPhysicalProgress || 0
        }%`,
        approvedProjectCost: `₹${project.approvedProjectCost.toLocaleString()}`,
        contractCost: `₹${project.contractCost.toLocaleString()}`,
        totalReleasedFunds: `₹${project.totalReleasedFunds.toLocaleString()}`,
        totalExpenditure: `₹${project.totalExpenditure.toLocaleString()}`,
      }))
    );
  } catch (error) {
    console.error("Error fetching project data:", error.message);
    res.status(500).json({ error: "Failed to fetch project data" });
  }
});

app.post("/api/projects", async (req, res) => {
  const {
    projectName,
    projectDescription,
    projectObjectives,
    projectDepartment,
    projectStatus,
    projectApprovalDate,
    approvedProjectCost,
    contractDate,
    contractCost,
    totalReleasedFunds,
    totalExpenditure,
    projectStartDate,
    originalCompletionDate,
    revisedCompletionDate,
    governmentApprovalDateAndOrder,
    delayReason,
    schemeName,
    landAvailabilityDate,
    projectManager,
    concernedOfficial,
  } = req.body;

  if (
    !projectName ||
    !projectDepartment ||
    !projectStatus ||
    !projectApprovalDate ||
    !approvedProjectCost ||
    !contractDate ||
    !contractCost ||
    !totalReleasedFunds ||
    !totalExpenditure ||
    !projectStartDate ||
    !originalCompletionDate ||
    !revisedCompletionDate ||
    !projectManager
  ) {
    return res.status(400).json({
      error: "Missing required fields for project creation.",
    });
  }

  try {
    const connection = await db.promise();

    await connection.beginTransaction();

    // Insert Project
    const [projectResult] = await connection.query(
      `INSERT INTO projects (
        project_name, project_description, project_objectives, 
        project_department, project_status, project_approval_date, 
        approved_project_cost, contract_date, contract_cost, 
        total_released_funds, total_expenditure, project_start_date, 
        original_completion_date, revised_completion_date, 
        government_approval_date_and_order, delay_reason, 
        scheme_name, land_availability_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectName,
        projectDescription,
        projectObjectives,
        projectDepartment,
        projectStatus,
        projectApprovalDate,
        approvedProjectCost,
        contractDate,
        contractCost,
        totalReleasedFunds,
        totalExpenditure,
        projectStartDate,
        originalCompletionDate,
        revisedCompletionDate,
        governmentApprovalDateAndOrder,
        delayReason,
        schemeName,
        landAvailabilityDate,
      ]
    );

    const projectId = projectResult.insertId;

    // Insert Project Manager
    await connection.query(
      `INSERT INTO project_managers (
        project_id, official_name, official_email, 
        official_phone, official_designation, official_department
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        projectManager.officialName,
        projectManager.officialEmail,
        projectManager.officialPhone,
        projectManager.officialDesignation,
        projectManager.officialDepartment,
      ]
    );

    // Insert Concerned Officials
    if (concernedOfficial && concernedOfficial.length > 0) {
      for (const official of concernedOfficial) {
        await connection.query(
          `INSERT INTO concerned_officials (
            project_id, official_name, official_email, 
            official_phone, official_designation, official_department
          ) VALUES (?, ?, ?, ?, ?, ?)`,
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
    }

    await connection.commit();

    res.status(201).json({
      message: "Project created successfully!",
      projectId,
    });
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).json({ error: "Failed to create project." });
  }
});

app.post("/api/createMilestone", async (req, res) => {
  const {
    projectId,
    milestoneName,
    milestoneFromDate,
    milestoneCompletionDate,
    milestoneActualCompletionDate,
    milestoneStatus,
    milestoneDescription,
    milestoneProgress,
  } = req.body;

  if (
    !projectId ||
    !milestoneName ||
    !milestoneFromDate ||
    !milestoneCompletionDate ||
    !milestoneStatus ||
    milestoneProgress === undefined
  ) {
    return res.status(400).json({
      error: "Missing required fields for milestone creation.",
    });
  }

  try {
    const connection = await db.promise();

    await connection.query(
      `INSERT INTO milestones (
        project_id, milestone_name, milestone_from_date, milestone_completion_date, 
        milestone_actual_completion_date, milestone_status, milestone_description, milestone_progress
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        milestoneName,
        milestoneFromDate,
        milestoneCompletionDate,
        milestoneActualCompletionDate || null,
        milestoneStatus,
        milestoneDescription || null,
        milestoneProgress,
      ]
    );

    res.status(201).json({
      message: "Milestone created successfully!",
    });
  } catch (error) {
    console.error("Error creating milestone:", error.message);
    res.status(500).json({ error: "Failed to create milestone." });
  }
});

app.put("/api/updateMilestone/:id", async (req, res) => {
  const milestoneId = req.params.id;
  const {
    milestoneName,
    milestoneFromDate,
    milestoneCompletionDate,
    milestoneActualCompletionDate,
    milestoneStatus,
    milestoneDescription,
    milestoneProgress,
  } = req.body;

  if (!milestoneId) {
    return res.status(400).json({
      error: "Milestone ID is required.",
    });
  }

  try {
    const connection = await db.promise();

    const [result] = await connection.query(
      `UPDATE milestones SET 
        milestone_name = COALESCE(?, milestone_name),
        milestone_from_date = COALESCE(?, milestone_from_date),
        milestone_completion_date = COALESCE(?, milestone_completion_date),
        milestone_actual_completion_date = COALESCE(?, milestone_actual_completion_date),
        milestone_status = COALESCE(?, milestone_status),
        milestone_description = COALESCE(?, milestone_description),
        milestone_progress = COALESCE(?, milestone_progress)
      WHERE id = ?`,
      [
        milestoneName || null,
        milestoneFromDate || null,
        milestoneCompletionDate || null,
        milestoneActualCompletionDate || null,
        milestoneStatus || null,
        milestoneDescription || null,
        milestoneProgress || null,
        milestoneId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Milestone not found.",
      });
    }

    res.json({
      message: "Milestone updated successfully!",
    });
  } catch (error) {
    console.error("Error updating milestone:", error.message);
    res.status(500).json({ error: "Failed to update milestone." });
  }
});

app.post("/api/createInspection", async (req, res) => {
  const {
    projectId,
    inspectionDate,
    officialName,
    officialEmail,
    officialPhone,
    officialDesignation,
    officialDepartment,
    InspectionType,
    inspectionInstruction,
    inspectionStatus,
    inspectionReport,
  } = req.body;

  if (!projectId || !inspectionDate || !InspectionType || !inspectionStatus) {
    return res.status(400).json({
      error: "Missing required fields for inspection creation.",
    });
  }

  try {
    const connection = await db.promise();

    await connection.query(
      `INSERT INTO project_inspections (
        project_id, inspection_date, inspection_type, inspection_instruction, 
        inspection_status, inspection_report, official_name, official_email, 
        official_phone, official_designation, official_department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        inspectionDate,
        InspectionType,
        inspectionInstruction || null,
        inspectionStatus,
        inspectionReport || null,
        officialName || null,
        officialEmail || null,
        officialPhone || null,
        officialDesignation || null,
        officialDepartment || null,
      ]
    );

    res.status(201).json({
      message: "Inspection created successfully!",
    });
  } catch (error) {
    console.error("Error creating inspection:", error.message);
    res.status(500).json({ error: "Failed to create inspection." });
  }
});

app.put("/api/updateInspection/:id", async (req, res) => {
  const inspectionId = req.params.id;
  const {
    inspectionDate,
    officialName,
    officialEmail,
    officialPhone,
    officialDesignation,
    officialDepartment,
    InspectionType,
    inspectionInstruction,
    inspectionStatus,
    inspectionReport,
  } = req.body;

  if (!inspectionId) {
    return res.status(400).json({
      error: "Inspection ID is required.",
    });
  }

  try {
    const connection = await db.promise();

    const [result] = await connection.query(
      `UPDATE project_inspections SET 
        inspection_date = COALESCE(?, inspection_date),
        inspection_type = COALESCE(?, inspection_type),
        inspection_instruction = COALESCE(?, inspection_instruction),
        inspection_status = COALESCE(?, inspection_status),
        inspection_report = COALESCE(?, inspection_report),
        official_name = COALESCE(?, official_name),
        official_email = COALESCE(?, official_email),
        official_phone = COALESCE(?, official_phone),
        official_designation = COALESCE(?, official_designation),
        official_department = COALESCE(?, official_department)
      WHERE id = ?`,
      [
        inspectionDate || null,
        InspectionType || null,
        inspectionInstruction || null,
        inspectionStatus || null,
        inspectionReport || null,
        officialName || null,
        officialEmail || null,
        officialPhone || null,
        officialDesignation || null,
        officialDepartment || null,
        inspectionId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Inspection not found.",
      });
    }

    res.json({
      message: "Inspection updated successfully!",
    });
  } catch (error) {
    console.error("Error updating inspection:", error.message);
    res.status(500).json({ error: "Failed to update inspection." });
  }
});

app.post("/api/createEssentialTest", async (req, res) => {
  const {
    projectId,
    testName,
    dateOfSampleCollection,
    samplingAuthority,
    sampleTestLabName,
    sampleTestReport,
    sampleCollectionSiteImage,
  } = req.body;

  if (!projectId || !testName || !dateOfSampleCollection) {
    return res.status(400).json({
      error: "Missing required fields for essential test creation.",
    });
  }

  try {
    const connection = await db.promise();

    const [result] = await connection.query(
      `INSERT INTO project_essential_tests (
        project_id, test_name, date_of_sample_collection, sampling_authority, 
        sample_test_lab_name, sample_test_report
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        testName,
        dateOfSampleCollection,
        samplingAuthority || null,
        sampleTestLabName || null,
        sampleTestReport || null,
      ]
    );

    const essentialTestId = result.insertId;

    if (sampleCollectionSiteImage && sampleCollectionSiteImage.length > 0) {
      for (const image of sampleCollectionSiteImage) {
        await connection.query(
          `INSERT INTO sample_collection_site_images (essential_test_id, image) VALUES (?, ?)`,
          [essentialTestId, image]
        );
      }
    }

    res.status(201).json({
      message: "Essential test created successfully!",
      essentialTestId,
    });
  } catch (error) {
    console.error("Error creating essential test:", error.message);
    res.status(500).json({ error: "Failed to create essential test." });
  }
});

app.put("/api/updateEssentialTest/:id", async (req, res) => {
  const essentialTestId = req.params.id;
  const {
    testName,
    dateOfSampleCollection,
    samplingAuthority,
    sampleTestLabName,
    sampleTestReport,
    sampleCollectionSiteImage,
  } = req.body;

  if (!essentialTestId) {
    return res.status(400).json({
      error: "Essential Test ID is required.",
    });
  }

  try {
    const connection = await db.promise();

    // Update essential test details
    const [result] = await connection.query(
      `UPDATE project_essential_tests SET 
        test_name = COALESCE(?, test_name),
        date_of_sample_collection = COALESCE(?, date_of_sample_collection),
        sampling_authority = COALESCE(?, sampling_authority),
        sample_test_lab_name = COALESCE(?, sample_test_lab_name),
        sample_test_report = COALESCE(?, sample_test_report)
      WHERE id = ?`,
      [
        testName || null,
        dateOfSampleCollection || null,
        samplingAuthority || null,
        sampleTestLabName || null,
        sampleTestReport || null,
        essentialTestId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Essential test not found.",
      });
    }

    // Update sample collection site images if provided
    if (sampleCollectionSiteImage && sampleCollectionSiteImage.length > 0) {
      // Delete existing images
      await connection.query(
        `DELETE FROM sample_collection_site_images WHERE essential_test_id = ?`,
        [essentialTestId]
      );

      // Insert new images
      for (const image of sampleCollectionSiteImage) {
        await connection.query(
          `INSERT INTO sample_collection_site_images (essential_test_id, image) VALUES (?, ?)`,
          [essentialTestId, image]
        );
      }
    }

    res.json({
      message: "Essential test updated successfully!",
    });
  } catch (error) {
    console.error("Error updating essential test:", error.message);
    res.status(500).json({ error: "Failed to update essential test." });
  }
});

app.post("/api/projectGallery", async (req, res) => {
  const {
    projectId,
    image,
    imageDescription,
    lattitude,
    longitude,
    elevation,
    accuracy,
    time,
  } = req.body;

  if (!projectId || !image || !imageDescription || !time) {
    return res.status(400).json({
      error: "Project ID and Image are required fields.",
    });
  }

  try {
    const connection = await db.promise();

    const [result] = await connection.query(
      `INSERT INTO project_gallery (project_id, image, image_description, latitude, longitude, elevation, accuracy, time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        image,
        imageDescription || null,
        lattitude || null,
        longitude || null,
        elevation || null,
        accuracy || null,
        time || null,
      ]
    );

    res.status(201).json({
      message: "Gallery entry created successfully!",
      galleryId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating gallery entry:", error.message);
    res.status(500).json({ error: "Failed to create gallery entry." });
  }
});

app.put("/api/projectGallery/:id", async (req, res) => {
  const galleryId = req.params.id;
  const {
    image,
    imageDescription,
    lattitude,
    longitude,
    elevation,
    accuracy,
    time,
  } = req.body;

  if (!galleryId) {
    return res.status(400).json({
      error: "Gallery ID is required.",
    });
  }

  try {
    const connection = await db.promise();

    const [result] = await connection.query(
      `UPDATE project_gallery SET 
        image = COALESCE(?, image),
        image_description = COALESCE(?, image_description),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        elevation = COALESCE(?, elevation),
        accuracy = COALESCE(?, accuracy),
        time = COALESCE(?, time)
      WHERE id = ?`,
      [
        image || null,
        imageDescription || null,
        lattitude || null,
        longitude || null,
        elevation || null,
        accuracy || null,
        time || null,
        galleryId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Gallery entry not found." });
    }

    res.json({ message: "Gallery entry updated successfully!" });
  } catch (error) {
    console.error("Error updating gallery entry:", error.message);
    res.status(500).json({ error: "Failed to update gallery entry." });
  }
});

app.post("/api/budgetInstallment", async (req, res) => {
  const {
    projectId,
    installmentAmount,
    amountRecievedDate,
    utilizationCertificate,
  } = req.body;

  if (
    !projectId ||
    !installmentAmount ||
    !amountRecievedDate ||
    !utilizationCertificate
  ) {
    return res.status(400).json({
      error:
        "Project ID, Installment Amount, and Amount Received Date are required.",
    });
  }

  try {
    const connection = await db.promise();

    const [result] = await connection.query(
      `INSERT INTO budget_installments (project_id, installment_amount, amount_received_date, utilization_certificate) 
       VALUES (?, ?, ?, ?)`,
      [
        projectId,
        installmentAmount,
        amountRecievedDate,
        utilizationCertificate || null,
      ]
    );

    res.status(201).json({
      message: "Budget installment created successfully!",
      installmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating budget installment:", error.message);
    res.status(500).json({ error: "Failed to create budget installment." });
  }
});

app.put("/api/budgetInstallment/:id", async (req, res) => {
  const installmentId = req.params.id;
  const { installmentAmount, amountRecievedDate, utilizationCertificate } =
    req.body;

  if (!installmentId) {
    return res.status(400).json({
      error: "Installment ID is required.",
    });
  }

  try {
    const connection = await db.promise();

    const [result] = await connection.query(
      `UPDATE budget_installments SET 
        installment_amount = COALESCE(?, installment_amount),
        amount_received_date = COALESCE(?, amount_received_date),
        utilization_certificate = COALESCE(?, utilization_certificate)
      WHERE id = ?`,
      [
        installmentAmount || null,
        amountRecievedDate || null,
        utilizationCertificate || null,
        installmentId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Budget installment not found." });
    }

    res.json({ message: "Budget installment updated successfully!" });
  } catch (error) {
    console.error("Error updating budget installment:", error.message);
    res.status(500).json({ error: "Failed to update budget installment." });
  }
});

// Create User
app.post("/api/users", validateRequest, async (req, res) => {
  const {
    officialName,
    officialEmail,
    officialPhone,
    officialDesignation,
    officialDepartment,
    username,
    password,
    role,
    departmentId,
    status,
  } = req.body;

  try {
    const query = `INSERT INTO users 
      (official_name, official_email, official_phone, official_designation, official_department, username, password, role, department_id, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      officialName,
      officialEmail,
      officialPhone,
      officialDesignation,
      officialDepartment,
      username,
      password,
      role,
      departmentId,
      status,
    ];
    const [result] = await db.promise().query(query, values);
    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId, // Return the user ID of the newly created user
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update User
app.put("/api/users/:id", validateRequest, async (req, res) => {
  const userId = req.params.id;
  const {
    officialName,
    officialEmail,
    officialPhone,
    officialDesignation,
    officialDepartment,
    username,
    password,
    role,
    departmentId,
    status,
  } = req.body;

  try {
    const query = `UPDATE users 
      SET official_name = ?, official_email = ?, official_phone = ?, official_designation = ?, official_department = ?, username = ?, password = ?, role = ?, department_id = ?, status = ? 
      WHERE id = ?`;
    const values = [
      officialName,
      officialEmail,
      officialPhone,
      officialDesignation,
      officialDepartment,
      username,
      password,
      role,
      departmentId,
      status,
      userId,
    ];
    await db.promise().query(query, values);
    res.status(200).json({
      message: "User updated successfully",
      userId: userId, // Return the user ID that was updated
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Get User by ID
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT id, official_name AS officialName, official_email AS officialEmail, official_phone AS officialPhone, 
        official_designation AS officialDesignation, official_department AS officialDepartment, username, 
        role, department_id AS departmentId, status 
        FROM users 
        WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Soft Delete User (Set status to -1)
app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db
      .promise()
      .query(`UPDATE users SET status = -1 WHERE id = ?`, [userId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "User not found or already deleted" });
    }

    res.status(200).json({
      message: "User status updated to -1 (soft deleted)",
      userId: userId,
    });
  } catch (error) {
    console.error("Error soft deleting user:", error.message);
    res.status(500).json({ error: "Failed to soft delete user" });
  }
});

app.get("/api/users", async (req, res) => {
  const { department, role, departmentId, status } = req.body;

  try {
    // Base query
    let query = `SELECT 
      id, 
      official_name AS officialName, 
      official_email AS officialEmail, 
      official_phone AS officialPhone, 
      official_designation AS officialDesignation, 
      official_department AS officialDepartment, 
      username, 
      role, 
      department_id AS departmentId, 
      status 
      FROM users WHERE 1=1`;

    // Add filters dynamically based on request body
    const queryParams = [];
    if (department) {
      query += ` AND official_department = ?`;
      queryParams.push(department);
    }
    if (role) {
      query += ` AND role = ?`;
      queryParams.push(role);
    }
    if (departmentId) {
      query += ` AND department_id = ?`;
      queryParams.push(departmentId);
    }
    if (status) {
      query += ` AND status = ?`;
      queryParams.push(status);
    }

    // Execute the query
    const [users] = await db.promise().query(query, queryParams);
    // const formattedUsers = users.users;

    res.status(200).json(users );
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


// fetch all departments
app.get("/api/departments", async (req, res) => {
  try {
    const query = `SELECT 
      department_id AS departmentId,
      department_name AS departmentName,
      department_head AS departmentHead,
      department_email AS departmentEmail,
      number_of_projects AS numberOfProjects,
      status 
      FROM departments`;
    const [departments] = await db.promise().query(query);

    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// Create Department
app.post("/api/departments", async (req, res) => {
  const { departmentName, departmentHead, departmentEmail, numberOfProjects, status } = req.body;

  // Basic validation
  if (!departmentName || !departmentHead || !departmentEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = `INSERT INTO departments 
      (department_name, department_head, department_email, number_of_projects, status) 
      VALUES (?, ?, ?, ?, ?)`;
    const values = [departmentName, departmentHead, departmentEmail, numberOfProjects || 0, status || 1];

    const [result] = await db.promise().query(query, values);
    res.status(201).json({ message: "Department created successfully", departmentId: result.insertId });
  } catch (error) {
    console.error("Error creating department:", error.message);
    res.status(500).json({ error: "Failed to create department" });
  }
});

// Update Department
app.put("/api/departments/:id", async (req, res) => {
  const departmentId = req.params.id;
  const { departmentName, departmentHead, departmentEmail, numberOfProjects, status } = req.body;

  // Validation
  if (!departmentName || !departmentHead || !departmentEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = `UPDATE departments 
      SET department_name = ?, department_head = ?, department_email = ?, number_of_projects = ?, status = ? 
      WHERE department_id = ?`;
    const values = [departmentName, departmentHead, departmentEmail, numberOfProjects || 0, status || 1, departmentId];

    await db.promise().query(query, values);
    res.status(200).json({ message: "Department updated successfully" });
  } catch (error) {
    console.error("Error updating department:", error.message);
    res.status(500).json({ error: "Failed to update department" });
  }
});

// Fetch Department by ID
app.get("/api/departments/:id", async (req, res) => {
  const departmentId = req.params.id;

  try {
    const query = `SELECT 
      department_id AS departmentId,
      department_name AS departmentName,
      department_head AS departmentHead,
      department_email AS departmentEmail,
      number_of_projects AS numberOfProjects,
      status 
      FROM departments 
      WHERE department_id = ?`;
    const [department] = await db.promise().query(query, [departmentId]);

    if (department.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json(department[0]);
  } catch (error) {
    console.error("Error fetching department:", error.message);
    res.status(500).json({ error: "Failed to fetch department" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
