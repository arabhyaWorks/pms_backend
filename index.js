const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pdfkit = require("pdfkit");
const fs = require("fs");

const axios = require("axios");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/api/uploadWholeData", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Main project insert
    const [projectResult] = await connection.execute(
      `
      INSERT INTO projects (
        project_name, project_status, project_goal, project_department, 
        department_id, executing_agency, executing_agency_id, scheme, 
        description, fund_sanctioned_by, concerned_official_name, 
        concerned_project_manager, project_sanction_date, 
        project_financial_approval_go_number, project_financial_approval_date, 
        actual_project_start_date, project_completion_date, 
        revised_project_sanction_date, revised_project_completion_date, 
        estimated_completion_date, actual_completion_date, 
        work_order_formation_date, land_handover_date, contact_information, 
        last_updated_date, last_updated_date_on_cmis, project_handover_date, 
        project_handover_to, parallel_requirements, total_approved_budget, 
        revised_project_cost, approved_project_cost, contract_date, contract_cost,
        total_released_funds, total_expenditure, delay_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.projectName || null,
        req.body.projectStatus || null,
        req.body.projectGoal || null,
        req.body.projectDepartment || null,
        req.body.departmentId || null,
        req.body.executingAgency || null,
        req.body.executingAgencyId || null,
        req.body.scheme || null,
        req.body.description || null,
        req.body.fundSanctionedBy || null,
        req.body.concernedOfficialName || null,
        req.body.concernedProjectManager || null,
        req.body.projectSanctionDate || null,
        req.body.projectFinancialApprovalGoNumber || null,
        req.body.projectFinancialApprovalDate || null,
        req.body.actualProjectStartDate || null,
        req.body.projectCompletionDate || null,
        req.body.revisedProjectSanctionDate || null,
        req.body.revisedProjectCompletionDate || null,
        req.body.estimatedCompletionDate || null,
        req.body.actualCompletionDate || null,
        req.body.workOrderFormationDate || null,
        req.body.landHandoverDate || null,
        req.body.contactInformation || null,
        req.body.lastUpdatedDate || null,
        req.body.lastUpdatedDateOnCMIS || null,
        req.body.projectHandoverDate || null,
        req.body.projectHandoverTo || null,
        req.body.parallelRequirements || null,
        req.body.approvedProjectCost || null,
        req.body.revisedProjectCost || null,
        req.body.approvedProjectCost || null,
        req.body.contractDate || null,
        req.body.contractCost || null,
        req.body.totalReleasedFunds || null,
        req.body.totalExpenditure || null,
        req.body.delayReason || null,
      ]
    );

    const projectId = projectResult.insertId;

    // Meeting instructions
    if (req.body.meetingInstructions?.length > 0) {
      for (const instruction of req.body.meetingInstructions) {
        await connection.execute(
          `INSERT INTO meeting_instructions 
           (description, date, compliance, project_id, feedback)
           VALUES (?, ?, ?, ?, ?)`,
          [
            instruction.desc || null,
            instruction.date || null,
            instruction.compliance || null,
            projectId,
            instruction.feedback || null,
          ]
        );
      }
    }

    // Project inspections
    if (req.body.projectInspection?.length > 0) {
      for (const inspection of req.body.projectInspection) {
        await connection.execute(
          `INSERT INTO project_inspections 
           (inspection_date, official_name, official_email, official_phone, 
            official_designation, official_department, inspection_type, 
            inspection_instruction, inspection_status, inspection_report, project_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            inspection.inspectionDate || null,
            inspection.officialName || null,
            inspection.officialEmail || null,
            inspection.officialPhone || null,
            inspection.officialDesignation || null,
            inspection.officialDepartment || null,
            inspection.InspectionType || null,
            inspection.inspectionInstruction || null,
            inspection.inspectionStatus || null,
            inspection.inspectionReport || null,
            projectId,
          ]
        );
      }
    }

    // Project essential tests
    if (req.body.projectEssentialTest?.length > 0) {
      for (const test of req.body.projectEssentialTest) {
        await connection.execute(
          `INSERT INTO project_essential_tests 
           (test_name, date_of_sample_collection, sampling_authority, 
            sample_test_lab_name, sample_test_report, sample_collection_site_images, project_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            test.testName || null,
            test.dateOfSampleCollection || null,
            test.samplingAuthority || null,
            test.sampleTestLabName || null,
            test.sampleTestReport || null,
            test.sampleCollectionSiteImage
              ? JSON.stringify(test.sampleCollectionSiteImage)
              : null,
            projectId,
          ]
        );
      }
    }

    // Project gallery
    if (req.body.projectGallery?.length > 0) {
      for (const gallery of req.body.projectGallery) {
        await connection.execute(
          `INSERT INTO project_gallery 
           (image, image_description, latitude, longitude, elevation, accuracy, time, project_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            gallery.image || null,
            gallery.imageDescription || null,
            gallery.lattitude || null,
            gallery.longitude || null,
            gallery.elevation || null,
            gallery.accuracy || null,
            gallery.time || null,
            projectId,
          ]
        );
      }
    }

    // Milestones
    if (req.body.mileStones?.length > 0) {
      for (const milestone of req.body.mileStones) {
        await connection.execute(
          `INSERT INTO milestones 
           (milestone_name, milestone_from_date, milestone_completion_date, 
            milestone_actual_completion_date, milestone_status, milestone_description, 
            milestone_progress, project_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            milestone.milestoneName || null,
            milestone.milestoneFromDate || null,
            milestone.milestoneCompletionDate || null,
            milestone.milestoneActualCompletionDate || null,
            milestone.milestoneStatus || null,
            milestone.milestoneDescription || null,
            milestone.milestoneProgress || null,
            projectId,
          ]
        );
      }
    }

    // Issues
    if (req.body.issues?.length > 0) {
      for (const issue of req.body.issues) {
        await connection.execute(
          `INSERT INTO issues 
           (issue_name, issue_description, issue_raised_by, issue_raised_date, 
            assigned_to, issue_reported_on, issue_status, issue_closed_date, 
            issue_closed_by, project_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            issue.issueName || null,
            issue.issueDescription || null,
            issue.issueRaisedBy || null,
            issue.issueRaisedDate || null,
            issue.assignedTo || null,
            issue.issueReportedOn || null,
            issue.issueStatus || null,
            issue.issueClosedDate || null,
            issue.issueClosedBy || null,
            projectId,
          ]
        );
      }
    }

    // Budget installments
    if (req.body.budgetInstallment?.length > 0) {
      for (const budget of req.body.budgetInstallment) {
        await connection.execute(
          `INSERT INTO budget_installments 
           (installment_amount, installment_expenditure, amount_received_date, 
            utilization_certificate, project_id)
           VALUES (?, ?, ?, ?, ?)`,
          [
            budget.installmentAmount || null,
            budget.installmentExpenditure || null,
            budget.amountReceivedDate || null,
            budget.utilizationCertificate || null,
            projectId,
          ]
        );
      }
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      message: "Project data uploaded successfully",
      projectId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading project data",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/updateWholeData/:projectId", async (req, res) => {
  const connection = await pool.getConnection();
  const projectId = req.params.projectId;

  try {
    await connection.beginTransaction();

    // Update main project data
    await connection.execute(
      `
      UPDATE projects SET
        project_name = ?, project_status = ?, project_goal = ?, 
        project_department = ?, department_id = ?, executing_agency = ?, 
        executing_agency_id = ?, scheme = ?, description = ?, fund_sanctioned_by = ?, 
        concerned_official_name = ?, concerned_project_manager = ?, project_sanction_date = ?, 
        project_financial_approval_go_number = ?, project_financial_approval_date = ?, 
        actual_project_start_date = ?, project_completion_date = ?, revised_project_sanction_date = ?, 
        revised_project_completion_date = ?, estimated_completion_date = ?, actual_completion_date = ?, 
        work_order_formation_date = ?, land_handover_date = ?, contact_information = ?, 
        total_approved_budget = ?, revised_project_cost = ?, approved_project_cost = ?, 
        contract_date = ?, contract_cost = ?, total_released_funds = ?, 
        total_expenditure = ?, delay_reason = ?
      WHERE id = ?
      `,
      [
        req.body.projectName || null,
        req.body.projectStatus || null,
        req.body.projectGoal || null,
        req.body.projectDepartment || null,
        req.body.departmentId || null,
        req.body.executingAgency || null,
        req.body.executingAgencyId || null,
        req.body.scheme || null,
        req.body.description || null,
        req.body.fundSanctionedBy || null,
        req.body.concernedOfficialName || null,
        req.body.concernedProjectManager || null,
        req.body.projectSanctionDate || null,
        req.body.projectFinancialApprovalGoNumber || null,
        req.body.projectFinancialApprovalDate || null,
        req.body.actualProjectStartDate || null,
        req.body.projectCompletionDate || null,
        req.body.revisedProjectSanctionDate || null,
        req.body.revisedProjectCompletionDate || null,
        req.body.estimatedCompletionDate || null,
        req.body.actualCompletionDate || null,
        req.body.workOrderFormationDate || null,
        req.body.landHandoverDate || null,
        req.body.contactInformation || null,
        req.body.totalApprovedBudget || null,
        req.body.revisedProjectCost || null,
        req.body.approvedProjectCost || null,
        req.body.contractDate || null,
        req.body.contractCost || null,
        req.body.totalReleasedFunds || null,
        req.body.totalExpenditure || null,
        req.body.delayReason || null,
        projectId,
      ]
    );

    // Update related entities: delete old and insert new data
    const relatedTables = [
      "meeting_instructions",
      "project_inspections",
      "project_essential_tests",
      "project_gallery",
      "milestones",
      "issues",
      "budget_installments",
    ];

    for (const table of relatedTables) {
      await connection.execute(`DELETE FROM ${table} WHERE project_id = ?`, [
        projectId,
      ]);
    }

    // Insert new meeting instructions
    if (req.body.meetingInstructions?.length > 0) {
      for (const instruction of req.body.meetingInstructions) {
        await connection.execute(
          `
          INSERT INTO meeting_instructions (description, date, compliance, project_id, feedback)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            instruction.description || null,
            instruction.date || null,
            instruction.compliance || null,
            projectId,
            instruction.feedback || null,
          ]
        );
      }
    }

    // Insert new project inspections
    if (req.body.projectInspection?.length > 0) {
      for (const inspection of req.body.projectInspection) {
        await connection.execute(
          `
          INSERT INTO project_inspections (
            inspection_date, official_name, official_email, official_phone, 
            official_designation, official_department, inspection_type, 
            inspection_instruction, inspection_status, inspection_report, project_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            inspection.inspectionDate || null,
            inspection.officialName || null,
            inspection.officialEmail || null,
            inspection.officialPhone || null,
            inspection.officialDesignation || null,
            inspection.officialDepartment || null,
            inspection.inspectionType || null,
            inspection.inspectionInstruction || null,
            inspection.inspectionStatus || null,
            inspection.inspectionReport || null,
            projectId,
          ]
        );
      }
    }

    // Insert new project essential tests
    if (req.body.projectEssentialTest?.length > 0) {
      for (const test of req.body.projectEssentialTest) {
        await connection.execute(
          `
          INSERT INTO project_essential_tests (
            test_name, date_of_sample_collection, sampling_authority, 
            sample_test_lab_name, sample_test_report, sample_collection_site_images, project_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            test.testName || null,
            test.dateOfSampleCollection || null,
            test.samplingAuthority || null,
            test.sampleTestLabName || null,
            test.sampleTestReport || null,
            test.sampleCollectionSiteImages
              ? JSON.stringify(test.sampleCollectionSiteImages)
              : null,
            projectId,
          ]
        );
      }
    }

    // Insert new project gallery
    if (req.body.projectGallery?.length > 0) {
      for (const gallery of req.body.projectGallery) {
        await connection.execute(
          `
          INSERT INTO project_gallery (
            image, image_description, latitude, longitude, elevation, accuracy, time, project_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            gallery.image || null,
            gallery.imageDescription || null,
            gallery.latitude || null,
            gallery.longitude || null,
            gallery.elevation || null,
            gallery.accuracy || null,
            gallery.time || null,
            projectId,
          ]
        );
      }
    }

    // Insert new milestones
    if (req.body.mileStones?.length > 0) {
      for (const milestone of req.body.mileStones) {
        await connection.execute(
          `
          INSERT INTO milestones (
            milestone_name, milestone_from_date, milestone_completion_date, 
            milestone_actual_completion_date, milestone_status, milestone_description, 
            milestone_progress, project_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            milestone.milestoneName || null,
            milestone.milestoneFromDate || null,
            milestone.milestoneCompletionDate || null,
            milestone.milestoneActualCompletionDate || null,
            milestone.milestoneStatus || null,
            milestone.milestoneDescription || null,
            milestone.milestoneProgress || null,
            projectId,
          ]
        );
      }
    }

    // Insert new issues
    if (req.body.issues?.length > 0) {
      for (const issue of req.body.issues) {
        await connection.execute(
          `
          INSERT INTO issues (
            issue_name, issue_description, issue_raised_by, issue_raised_date, 
            assigned_to, issue_reported_on, issue_status, issue_closed_date, 
            issue_closed_by, project_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            issue.issueName || null,
            issue.issueDescription || null,
            issue.issueRaisedBy || null,
            issue.issueRaisedDate || null,
            issue.assignedTo || null,
            issue.issueReportedOn || null,
            issue.issueStatus || null,
            issue.issueClosedDate || null,
            issue.issueClosedBy || null,
            projectId,
          ]
        );
      }
    }

    // Insert new budget installments
    if (req.body.budgetInstallment?.length > 0) {
      for (const budget of req.body.budgetInstallment) {
        await connection.execute(
          `
          INSERT INTO budget_installments (
            installment_amount, installment_expenditure, amount_received_date, 
            utilization_certificate, project_id
          ) VALUES (?, ?, ?, ?, ?)
          `,
          [
            budget.installmentAmount || null,
            budget.installmentExpenditure || null,
            budget.amountReceivedDate || null,
            budget.utilizationCertificate || null,
            projectId,
          ]
        );
      }
    }

    await connection.commit();
    res.status(200).json({
      success: true,
      message: "Project data updated successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating project data:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project data",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/projects/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const projectId = req.params.id;

    const [projectRows] = await connection.execute(
      `SELECT 
          id, project_name as projectName, project_status as projectStatus,
          project_goal as projectGoal, project_department as projectDepartment,
          department_id as departmentId, executing_agency as executingAgency,
          executing_agency_id as executingAgencyId, scheme,
          description, fund_sanctioned_by as fundSanctionedBy,
          concerned_official_name as concernedOfficialName,
          concerned_project_manager as concernedProjectManager,
          project_sanction_date as projectSanctionDate,
          project_financial_approval_go_number as projectFinancialApprovalGoNumber,
          project_financial_approval_date as projectFinancialApprovalDate,
          actual_project_start_date as actualProjectStartDate,
          project_completion_date as projectCompletionDate,
          revised_project_sanction_date as revisedProjectSanctionDate,
          revised_project_completion_date as revisedProjectCompletionDate,
          estimated_completion_date as estimatedCompletionDate,
          actual_completion_date as actualCompletionDate,
          work_order_formation_date as workOrderFormationDate,
          land_handover_date as landHandoverDate,
          contact_information as contactInformation,
          last_updated_date as lastUpdatedDate,
          last_updated_date_on_cmis as lastUpdatedDateOnCmis,
          project_handover_date as projectHandoverDate,
          project_handover_to as projectHandoverTo,
          parallel_requirements as parallelRequirements,
          total_approved_budget as totalApprovedBudget,
          revised_project_cost as revisedProjectCost, 
          approved_project_cost as approvedProjectCost,
          contract_date as contractDate,
          contract_cost as contractCost,
          total_released_funds as totalReleasedFunds, 
          total_expenditure as totalExpenditure,
          delay_reason as delayReason
        FROM projects WHERE id = ?`,
      [projectId]
    );

    if (projectRows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const [milestones] = await connection.execute(
      `SELECT milestone_progress as milestoneProgress, milestone_from_date as milestoneFromDate 
         FROM milestones 
         WHERE project_id = ? 
         ORDER BY milestone_from_date DESC`,
      [projectId]
    );

    // Get current and last month's progress
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthProgress =
      milestones.find((m) => {
        const milestoneDate = new Date(m.milestoneFromDate);
        return (
          milestoneDate.getMonth() === currentMonth &&
          milestoneDate.getFullYear() === currentYear
        );
      })?.milestoneProgress || null;

    const lastMonthProgress =
      milestones.find((m) => {
        const milestoneDate = new Date(m.milestoneFromDate);
        return currentMonth === 0
          ? milestoneDate.getMonth() === 11 &&
              milestoneDate.getFullYear() === currentYear - 1
          : milestoneDate.getMonth() === currentMonth - 1 &&
              milestoneDate.getFullYear() === currentYear;
      })?.milestoneProgress || null;

    const [budgetSummary] = await connection.execute(
      `SELECT 
          SUM(installment_amount) as totalReleasedFunds,
          SUM(installment_expenditure) as totalExpenditure
         FROM budget_installments 
         WHERE project_id = ?`,
      [projectId]
    );

    const [latestBudget] = await connection.execute(
      `SELECT 
          amount_received_date as lastFundReceivedDate,
          utilization_certificate as utilizationCertificateSubmissionDate
         FROM budget_installments 
         WHERE project_id = ? 
         ORDER BY amount_received_date DESC 
         LIMIT 1`,
      [projectId]
    );

    // Get current and last month's photos
    const [photos] = await connection.execute(
      `SELECT image, time 
         FROM project_gallery 
         WHERE project_id = ? 
         ORDER BY time DESC`,
      [projectId]
    );

    const currentMonthPhoto =
      photos.find((p) => {
        const photoDate = new Date(p.time);
        return (
          photoDate.getMonth() === currentMonth &&
          photoDate.getFullYear() === currentYear
        );
      })?.image || null;

    const lastMonthPhoto =
      photos.find((p) => {
        const photoDate = new Date(p.time);
        return currentMonth === 0
          ? photoDate.getMonth() === 11 &&
              photoDate.getFullYear() === currentYear - 1
          : photoDate.getMonth() === currentMonth - 1 &&
              photoDate.getFullYear() === currentYear;
      })?.image || null;

    const [meetingInstructions] = await connection.execute(
      `SELECT 
          id, description, date, compliance, project_id as projectId, feedback
         FROM meeting_instructions 
         WHERE project_id = ?
         ORDER BY date DESC`,
      [projectId]
    );

    const [projectInspection] = await connection.execute(
      `SELECT 
          id, inspection_date as inspectionDate, 
          official_name as officialName,
          official_email as officialEmail,
          official_phone as officialPhone,
          official_designation as officialDesignation,
          official_department as officialDepartment,
          inspection_type as inspectionType,
          inspection_instruction as inspectionInstruction,
          inspection_status as inspectionStatus,
          inspection_report as inspectionReport,
          project_id as projectId
         FROM project_inspections 
         WHERE project_id = ?
         ORDER BY inspection_date DESC`,
      [projectId]
    );

    const [projectEssentialTest] = await connection.execute(
      `SELECT 
          id, test_name as testName,
          date_of_sample_collection as dateOfSampleCollection,
          sampling_authority as samplingAuthority,
          sample_test_lab_name as sampleTestLabName,
          sample_test_report as sampleTestReport,
          sample_collection_site_images as sampleCollectionSiteImages,
          project_id as projectId
         FROM project_essential_tests 
         WHERE project_id = ?
         ORDER BY date_of_sample_collection DESC`,
      [projectId]
    );

    const [projectGallery] = await connection.execute(
      `SELECT 
          id, image, image_description as imageDescription,
          latitude, longitude, elevation, accuracy, time,
          project_id as projectId
         FROM project_gallery 
         WHERE project_id = ?
         ORDER BY time DESC`,
      [projectId]
    );

    const [mileStones] = await connection.execute(
      `SELECT 
          id, milestone_name as milestoneName,
          milestone_from_date as milestoneFromDate,
          milestone_completion_date as milestoneCompletionDate,
          milestone_actual_completion_date as milestoneActualCompletionDate,
          milestone_status as milestoneStatus,
          milestone_description as milestoneDescription,
          milestone_progress as milestoneProgress,
          project_id as projectId
         FROM milestones 
         WHERE project_id = ?
         ORDER BY milestone_from_date DESC`,
      [projectId]
    );

    const [issues] = await connection.execute(
      `SELECT 
          id, issue_name as issueName,
          issue_description as issueDescription,
          issue_raised_by as issueRaisedBy,
          issue_raised_date as issueRaisedDate,
          assigned_to as assignedTo,
          issue_reported_on as issueReportedOn,
          issue_status as issueStatus,
          issue_closed_date as issueClosedDate,
          issue_closed_by as issueClosedBy,
          project_id as projectId
         FROM issues 
         WHERE project_id = ?
         ORDER BY issue_raised_date DESC`,
      [projectId]
    );

    const [budgetInstallment] = await connection.execute(
      `SELECT 
          id, installment_amount as installmentAmount,
          installment_expenditure as installmentExpenditure,
          amount_received_date as amountReceivedDate,
          utilization_certificate as utilizationCertificate,
          project_id as projectId
         FROM budget_installments 
         WHERE project_id = ?
         ORDER BY amount_received_date DESC`,
      [projectId]
    );

    // Safely parse JSON string for sample collection site images
    projectEssentialTest.forEach((test) => {
      try {
        if (
          test.sampleCollectionSiteImages &&
          typeof test.sampleCollectionSiteImages === "string"
        ) {
          test.sampleCollectionSiteImages = JSON.parse(
            test.sampleCollectionSiteImages
          );
        } else {
          test.sampleCollectionSiteImages = [];
        }
      } catch (err) {
        test.sampleCollectionSiteImages = [];
        console.error("Error parsing sampleCollectionSiteImages:", err);
      }
    });

    const response = {
      ...projectRows[0],
      lastMonthPhysicalProgress: lastMonthProgress,
      currentMonthPhysicalProgress: currentMonthProgress,
      totalReleasedFunds: budgetSummary[0].totalReleasedFunds,
      totalExpenditure: budgetSummary[0].totalExpenditure,
      lastFundReceivedDate: latestBudget[0]?.lastFundReceivedDate || null,
      utilizationCertificateSubmissionDate:
        latestBudget[0]?.utilizationCertificateSubmissionDate || null,
      geoTaggedPhotosLastMonth: lastMonthPhoto,
      geoTaggedPhotosCurrentMonth: currentMonthPhoto,
      meetingInstructions,
      projectInspection,
      projectEssentialTest,
      projectGallery,
      mileStones,
      issues,
      budgetInstallment,
    };

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project data",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const projectId = req.params.id;

    // Delete related records first
    await connection.execute(
      "DELETE FROM meeting_instructions WHERE project_id = ?",
      [projectId]
    );
    await connection.execute(
      "DELETE FROM project_inspections WHERE project_id = ?",
      [projectId]
    );
    await connection.execute(
      "DELETE FROM project_essential_tests WHERE project_id = ?",
      [projectId]
    );
    await connection.execute(
      "DELETE FROM project_gallery WHERE project_id = ?",
      [projectId]
    );
    await connection.execute("DELETE FROM milestones WHERE project_id = ?", [
      projectId,
    ]);
    await connection.execute("DELETE FROM issues WHERE project_id = ?", [
      projectId,
    ]);
    await connection.execute(
      "DELETE FROM budget_installments WHERE project_id = ?",
      [projectId]
    );

    // Delete the project
    const [result] = await connection.execute(
      "DELETE FROM projects WHERE id = ?",
      [projectId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    await connection.commit();
    res.json({
      success: true,
      message: "Project and related data deleted successfully",
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/projects", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [projects] = await connection.execute(`
        SELECT 
          p.id, p.project_name as projectName, p.project_status as projectStatus,
          p.project_department as projectDepartment, p.executing_agency as executingAgency,
          p.scheme, p.project_sanction_date as projectSanctionDate,
          p.project_financial_approval_go_number as projectFinancialApprovalGoNumber,
          p.project_financial_approval_date as projectFinancialApprovalDate,

          p.approved_project_cost as approvedProjectCost,
          p.contract_date as contractDate,
          p.contract_cost as contractCost,
          p.total_released_funds as totalReleasedFunds,
          p.total_expenditure as totalExpenditure,


          p.actual_project_start_date as actualProjectStartDate,
          p.project_completion_date as projectCompletionDate,
          p.delay_reason as delayReason,
          p.land_handover_date as landHandoverDate,
          p.last_updated_date_on_cmis as lastUpdatedDateOnCmis,
          p.last_updated_date as lastUpdatedDate,

          p.revised_project_completion_date as revisedProjectCompletionDate,
          p.revised_project_sanction_date as revisedProjectSanctionDate,
          p.estimated_completion_date as estimatedCompletionDate,
          p.actual_completion_date as actualCompletionDate,
          p.work_order_formation_date as workOrderFormationDate,
          p.total_approved_budget as totalApprovedBudget,
          p.revised_project_cost as revisedProjectCost
        FROM projects p
      `);

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const [milestones] = await connection.execute(
          `SELECT milestone_progress as milestoneProgress, milestone_from_date as milestoneFromDate 
           FROM milestones 
           WHERE project_id = ? 
           ORDER BY milestone_from_date DESC`,
          [project.id]
        );

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const currentMonthProgress =
          milestones.find((m) => {
            const milestoneDate = new Date(m.milestoneFromDate);
            return (
              milestoneDate.getMonth() === currentMonth &&
              milestoneDate.getFullYear() === currentYear
            );
          })?.milestoneProgress || null;

        const lastMonthProgress =
          milestones.find((m) => {
            const milestoneDate = new Date(m.milestoneFromDate);
            return currentMonth === 0
              ? milestoneDate.getMonth() === 11 &&
                  milestoneDate.getFullYear() === currentYear - 1
              : milestoneDate.getMonth() === currentMonth - 1 &&
                  milestoneDate.getFullYear() === currentYear;
          })?.milestoneProgress || null;

        const [budgetSummary] = await connection.execute(
          `SELECT 
            MAX(amount_received_date) as lastFundReceivedDate,
            MAX(amount_received_date) as utilizationCertificateSubmissionDate
           FROM budget_installments 
           WHERE project_id = ?`,
          [project.id]
        );

        const [photos] = await connection.execute(
          `SELECT image, time 
           FROM project_gallery 
           WHERE project_id = ? 
           ORDER BY time DESC 
           LIMIT 2`,
          [project.id]
        );

        const currentMonthPhoto =
          photos.find((p) => {
            const photoDate = new Date(p.time);
            return (
              photoDate.getMonth() === currentMonth &&
              photoDate.getFullYear() === currentYear
            );
          })?.image || null;

        const lastMonthPhoto =
          photos.find((p) => {
            const photoDate = new Date(p.time);
            return currentMonth === 0
              ? photoDate.getMonth() === 11 &&
                  photoDate.getFullYear() === currentYear - 1
              : photoDate.getMonth() === currentMonth - 1 &&
                  photoDate.getFullYear() === currentYear;
          })?.image || null;

        const [latestMeeting] = await connection.execute(
          `SELECT description, compliance, feedback
           FROM meeting_instructions 
           WHERE project_id = ? 
           ORDER BY date DESC 
           LIMIT 1`,
          [project.id]
        );

        return {
          ...project,
          lastMonthPhysicalProgress: lastMonthProgress,
          currentMonthPhysicalProgress: currentMonthProgress,
          totalReleasedFundsBudgetInstallment:
            budgetSummary[0].totalReleasedFunds,
          totalExpenditureBudgetInstallment: budgetSummary[0].totalExpenditure,
          lastFundReceivedDate: budgetSummary[0].lastFundReceivedDate,
          utilizationCertificateSubmissionDate:
            budgetSummary[0].utilizationCertificateSubmissionDate,
          geoTaggedPhotosLastMonth: lastMonthPhoto,
          geoTaggedPhotosCurrentMonth: currentMonthPhoto,
          meetingDescription: latestMeeting[0]?.description || null,
          meetingCompliance: latestMeeting[0]?.compliance || null,
          meetingfeedback: latestMeeting[0]?.feedback || null,
        };
      })
    );

    res.json(projectsWithDetails);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects data",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.post("/api/projects", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Validate mandatory fields
    const mandatoryFields = [
      "projectName",
      "projectDepartment",
      // "departmentId",
      "executingAgency",
      // "executingAgencyId",
      "fundSanctionedBy",
    ];

    const missingFields = mandatoryFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing mandatory fields",
        missingFields,
      });
    }

    // Insert project data with explicit column names
    const [result] = await connection.execute(
      `INSERT INTO projects (
        project_name,
        project_status,
        project_goal,
        project_department,
        department_id,
        executing_agency,
        executing_agency_id,
        scheme,
        description,
        fund_sanctioned_by,
        concerned_official_name,
        concerned_project_manager,
        project_sanction_date,
        project_financial_approval_go_number,
        project_financial_approval_date,
        actual_project_start_date,
        project_completion_date,
        revised_project_sanction_date,
        revised_project_completion_date,
        estimated_completion_date,
        actual_completion_date,
        work_order_formation_date,
        land_handover_date,
        contact_information,
        approved_project_cost,
        revised_project_cost,
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, )`,
      [
        req.body.projectName,
        req.body.projectStatus || null,
        req.body.projectGoal || null,
        req.body.projectDepartment,
        req.body.departmentId,
        req.body.executingAgency,
        req.body.executingAgencyId,
        req.body.scheme || null,
        req.body.description || null,
        req.body.fundSanctionedBy,
        req.body.concernedOfficialName || null,
        req.body.concernedProjectManager || null,
        req.body.projectSanctionDate || null,
        req.body.projectFinancialApprovalGoNumber || null,
        req.body.projectFinancialApprovalDate || null,
        req.body.actualProjectStartDate || null,
        req.body.projectCompletionDate || null,
        req.body.revisedProjectSanctionDate || null,
        req.body.revisedProjectCompletionDate || null,
        req.body.estimatedCompletionDate || null,
        req.body.actualCompletionDate || null,
        req.body.workOrderFormationDate || null,
        req.body.landHandoverDate || null,
        req.body.contactInformation || null,
        req.body.approvedProjectCost || null,
        req.body.revisedProjectCost || null,
        new Date(),
        new Date(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      projectId: result.insertId,
      data: {
        ...req.body,
        id: result.insertId,
        lastUpdatedDate: new Date(),
        lastUpdatedDateOnCmis: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Project with this name already exists",
        error: error.message,
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID or executing agency ID",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// Project Status Statistics
app.get("/api/stats/project-status", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [stats] = await connection.execute(`
      SELECT 
        project_status, 
        COUNT(*) as count,
        SUM(total_approved_budget) as totalBudget,
        COUNT(CASE WHEN actual_completion_date IS NOT NULL THEN 1 END) as completedCount
      FROM projects 
      GROUP BY project_status
    `);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Project Status By ID Statistics
app.get("/api/stats/project-status/:statusId", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const statusMap = {
      1: "In Planning",
      2: "In Progress",
      3: "On Hold",
      4: "Delayed",
      5: "Completed",
    };

    const status = statusMap[req.params.statusId];

    const [stats] = await connection.execute(
      `
      SELECT 
        COUNT(*) as totalProjects,
        SUM(total_approved_budget) as totalBudget,
        AVG(total_approved_budget) as avgBudget,
        MIN(project_sanction_date) as oldestProject,
        MAX(project_sanction_date) as newestProject,
        COUNT(CASE WHEN revised_project_cost IS NOT NULL THEN 1 END) as projectsWithRevisions
      FROM projects 
      WHERE project_status = ?
    `,
      [status]
    );

    res.json({
      success: true,
      status,
      data: stats[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Department Statistics
app.get("/api/stats/department/:departmentId", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [stats] = await connection.execute(
      `
      SELECT 
        project_department,
        COUNT(*) as totalProjects,
        SUM(total_approved_budget) as totalBudget,
        COUNT(CASE WHEN project_status = 'In Progress' THEN 1 END) as inProgressCount,
        COUNT(CASE WHEN project_status = 'Completed' THEN 1 END) as completedCount,
        COUNT(CASE WHEN project_status = 'On Hold' THEN 1 END) as onHoldCount,
        COUNT(CASE WHEN project_status = 'In Planning' THEN 1 END) as inPlanningCount
      FROM projects 
      WHERE department_id = ?
      GROUP BY project_department
    `,
      [req.params.departmentId]
    );

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Executing Agency Statistics
app.get("/api/stats/executing-agency/:agencyId", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [stats] = await connection.execute(
      `
      SELECT 
        executing_agency,
        COUNT(*) as totalProjects,
        SUM(total_approved_budget) as totalBudget,
        COUNT(CASE WHEN project_status = 'In Progress' THEN 1 END) as inProgressCount,
        COUNT(CASE WHEN project_status = 'Completed' THEN 1 END) as completedCount,
        COUNT(CASE WHEN project_status = 'On Hold' THEN 1 END) as onHoldCount,
        COUNT(CASE WHEN project_status = 'In Planning' THEN 1 END) as inPlanningCount,
        COUNT(DISTINCT project_department) as departmentsCount
      FROM projects 
      WHERE executing_agency_id = ?
      GROUP BY executing_agency
    `,
      [req.params.agencyId]
    );

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Budget Overview Stats
app.get("/api/stats/budget", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [totalBudget] = await connection.execute(`
      SELECT 
        SUM(total_approved_budget) as sanctioned,
        (SELECT SUM(installment_amount) FROM budget_installments) as released,
        SUM(total_approved_budget) - (SELECT SUM(installment_amount) FROM budget_installments) as pending
      FROM projects
    `);

    res.json({
      success: true,
      data: totalBudget[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Department-wise Project Count
app.get("/api/stats/department-count", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [stats] = await connection.execute(`
      SELECT 
        project_department as name,
        COUNT(*) as value
      FROM projects 
      GROUP BY project_department
      ORDER BY value DESC
    `);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Project Status Distribution
app.get("/api/stats/status-distribution", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [stats] = await connection.execute(`
      SELECT 
        project_status as name,
        COUNT(*) as value
      FROM projects 
      GROUP BY project_status
    `);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

app.get("/api/stats/budget-overview", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [totalStats] = await connection.execute(`
      SELECT COUNT(*) as totalProjects FROM projects
    `);

    const [budgetStats] = await connection.execute(`
      SELECT 
        SUM(total_approved_budget) as totalApprovedBudget,
        (SELECT SUM(installment_amount) FROM budget_installments) as totalReceivedBudget,
        (SELECT SUM(installment_expenditure) FROM budget_installments) as totalExpenditure
      FROM projects
    `);

    const [activeProjectStats] = await connection.execute(`
      SELECT 
        COUNT(*) as activeProjectCount,
        SUM(total_approved_budget) as activeProjectBudget,
        (
          SELECT SUM(bi.installment_amount) 
          FROM budget_installments bi
          JOIN projects p ON bi.project_id = p.id
          WHERE p.project_status = 2
        ) as activeProjectReceived,
        (
          SELECT SUM(bi.installment_expenditure)
          FROM budget_installments bi
          JOIN projects p ON bi.project_id = p.id
          WHERE p.project_status = 2
        ) as activeProjectExpenditure
      FROM projects 
      WHERE project_status = 2
    `);

    res.json({
      success: true,
      totalProjects: totalStats[0].totalProjects,
      totalBudget: {
        approved: budgetStats[0].totalApprovedBudget || 0,
        received: budgetStats[0].totalReceivedBudget || 0,
        expenditure: budgetStats[0].totalExpenditure || 0,
        remaining:
          (budgetStats[0].totalApprovedBudget || 0) -
          (budgetStats[0].totalReceivedBudget || 0),
        unspent:
          (budgetStats[0].totalReceivedBudget || 0) -
          (budgetStats[0].totalExpenditure || 0),
      },
      activeProjects: {
        count: activeProjectStats[0].activeProjectCount || 0,
        budget: activeProjectStats[0].activeProjectBudget || 0,
        received: activeProjectStats[0].activeProjectReceived || 0,
        expenditure: activeProjectStats[0].activeProjectExpenditure || 0,
        remaining:
          (activeProjectStats[0].activeProjectBudget || 0) -
          (activeProjectStats[0].activeProjectReceived || 0),
        unspent:
          (activeProjectStats[0].activeProjectReceived || 0) -
          (activeProjectStats[0].activeProjectExpenditure || 0),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Entity API
// Departments and Executive agencies are considered as entities

app.post("/api/entities", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { entityName, entityType, status } = req.body;

    if (!entityName || !entityType || !status) {
      return res.status(400).json({
        success: false,
        message: "Please fill the required fields",
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO entity (entity_name, entity_type, status) VALUES (?, ?, ?)`,
      [entityName, entityType || 0, status || 1]
    );

    res.status(201).json({
      success: true,
      message: "Entity created successfully",
      entityId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating entity:", error);
    res.status(500).json({
      success: false,
      message: "Error creating entity",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/entities/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const entityId = req.params.id;

    const [rows] = await connection.execute(
      `SELECT id, entity_name, entity_type, status 
       FROM entity 
       WHERE id = ?`,
      [entityId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Entity not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching entity by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching entity",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/entities/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const entityId = req.params.id;
    const { entityName, entityType, status } = req.body;

    const updates = [];
    const values = [];

    if (entityName) {
      updates.push("entity_name = ?");
      values.push(entityName);
    }
    if (entityType !== undefined) {
      updates.push("entity_type = ?");
      values.push(entityType);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(entityId);

    const query = `
      UPDATE entity 
      SET ${updates.join(", ")} 
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Entity not found",
      });
    }

    res.json({
      success: true,
      message: "Entity updated successfully",
    });
  } catch (error) {
    console.error("Error updating entity:", error);
    res.status(500).json({
      success: false,
      message: "Error updating entity",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/entities", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { entityType, status } = req.body;

    let query = `SELECT id, entity_name, entity_type, status FROM entity WHERE 1=1`;
    const queryParams = [];

    if (entityType) {
      query += ` AND entity_type = ?`;
      queryParams.push(entityType);
    }

    if (status) {
      query += ` AND status = ?`;
      queryParams.push(status);
    }

    const [rows] = await connection.execute(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No entities found",
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching entities with filters:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching entities",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.delete("/api/entities/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const entityId = req.params.id;

    const [result] = await connection.execute(
      `DELETE FROM entity WHERE id = ?`,
      [entityId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Entity not found",
      });
    }

    res.json({
      success: true,
      message: "Entity deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting entity:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting entity",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

//User API
app.post("/api/users", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      userName,
      userEmail,
      userPhone,
      userDesignation,
      userPassword,
      userRole,
      entityId,
      entityName,
    } = req.body;

    // Validate required fields
    if (!userName || !userEmail || !userPassword || !entityId || !entityName) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, entityId and entityName are required",
      });
    }

    // Validate password (minimum 8 characters, at least one letter and one number)
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(userPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, containing at least one letter and one number",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Insert user into the database
    const [result] = await connection.execute(
      `INSERT INTO users (
        user_name, user_email, user_phone, user_designation, 
        user_password, user_role, entity_id, entity_name, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userName,
        userEmail,
        userPhone || null,
        userDesignation || null,
        hashedPassword,
        userRole || 3, // Default to 3 (User)
        entityId || null,
        entityName || null,
        1, // Default status to active
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/users/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.params.id;
    const {
      userName,
      userEmail,
      userPhone,
      userDesignation,
      userPassword,
      userRole,
      entityId,
      entityName,
      status,
    } = req.body;

    const updates = [];
    const values = [];

    if (userName) {
      updates.push("user_name = ?");
      values.push(userName);
    }
    if (userEmail) {
      updates.push("user_email = ?");
      values.push(userEmail);
    }
    if (userPhone) {
      updates.push("user_phone = ?");
      values.push(userPhone);
    }
    if (userDesignation) {
      updates.push("user_designation = ?");
      values.push(userDesignation);
    }
    if (userPassword) {
      // Validate password
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(userPassword)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 8 characters long, containing at least one letter, one number, and one special character",
        });
      }

      const hashedPassword = await bcrypt.hash(userPassword, 10);
      updates.push("user_password = ?");
      values.push(hashedPassword);
    }
    if (userRole !== undefined) {
      updates.push("user_role = ?");
      values.push(userRole);
    }
    if (entityId !== undefined) {
      updates.push("entity_id = ?");
      values.push(entityId);
    }
    if (entityName !== undefined) {
      updates.push("entity_name = ?");
      values.push(entityName);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(", ")} 
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.params.id;

    const [result] = await connection.execute(
      `DELETE FROM users WHERE id = ?`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/users", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Extract query parameters for filtering
    const { entityId, status, userRole } = req.body;

    // Initialize conditions and values
    const conditions = [];
    const values = [];

    // Add conditions dynamically based on the presence of query parameters
    if (entityId) {
      conditions.push("entity_id = ?");
      values.push(entityId);
    }
    if (status) {
      conditions.push("status = ?");
      values.push(status);
    }
    if (userRole) {
      conditions.push("user_role = ?");
      values.push(userRole);
    }

    // Build the WHERE clause dynamically
    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // Query to fetch users
    const query = `
      SELECT 
        id, user_name AS userName, user_email AS userEmail, user_phone AS userPhone,
        user_designation AS userDesignation, user_role AS userRole,
        entity_id AS entityId, entity_name AS entityName, status,
        created_at AS createdAt, updated_at AS updatedAt
      FROM users
      ${whereClause}
      ORDER BY created_at DESC`;

    const [rows] = await connection.execute(query, values);

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.post("/api/login", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { userEmail, userPassword } = req.body;

    // Validate input fields
    if (!userEmail || !userPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Fetch user by email
    const [rows] = await connection.execute(
      `SELECT 
        id, user_name AS userName, user_email AS userEmail, user_password AS hashedPassword,
        user_role AS userRole, entity_id AS entityId, entity_name AS entityName, status 
      FROM users 
      WHERE user_email = ?`,
      [userEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    // Check if the account is active
    if (user.status !== 1) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact the administrator.",
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        userName: user.userName,
        userEmail: user.userEmail,
        userRole: user.userRole,
        entityId: user.entityId,
        entityName: user.entityName,
      },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1d" } // Token expires in 1 day
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userName: user.userName,
        userEmail: user.userEmail,
        userRole: user.userRole,
        entityId: user.entityId,
        entityName: user.entityName,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// Milestones
app.post("/api/projects/:projectId/milestones", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { projectId } = req.params; // Extract project ID from route parameters
    const {
      milestoneName,
      milestoneFromDate,
      milestoneCompletionDate,
      milestoneActualCompletionDate,
      milestoneStatus,
      milestoneDescription,
      milestoneProgress,
      delayReason,
    } = req.body;

    // Validate required fields
    if (!milestoneName || !milestoneFromDate || !milestoneCompletionDate) {
      return res.status(400).json({
        success: false,
        message: "Milestone name, from date, and completion date are required",
      });
    }

    // Insert milestone into the database
    const [result] = await connection.execute(
      `INSERT INTO milestones (
        milestone_name, milestone_from_date, milestone_completion_date,
        milestone_actual_completion_date, milestone_status, milestone_description,
        milestone_progress, delay_reason, project_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        milestoneName,
        milestoneFromDate,
        milestoneCompletionDate,
        milestoneActualCompletionDate || null,
        milestoneStatus || null,
        milestoneDescription || null,
        milestoneProgress || null,
        delayReason || null,
        projectId,
        1, // Default status to active
      ]
    );

    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      milestoneId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({
      success: false,
      message: "Error creating milestone",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/milestones/:milestoneId", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { milestoneId } = req.params; // Extract milestone ID from route parameters
    const {
      milestoneName,
      milestoneFromDate,
      milestoneCompletionDate,
      milestoneActualCompletionDate,
      milestoneStatus,
      milestoneDescription,
      milestoneProgress,
      delayReason,
      status,
    } = req.body;

    const updates = [];
    const values = [];

    // Build update query dynamically
    if (milestoneName) {
      updates.push("milestone_name = ?");
      values.push(milestoneName);
    }
    if (milestoneFromDate) {
      updates.push("milestone_from_date = ?");
      values.push(milestoneFromDate);
    }
    if (milestoneCompletionDate) {
      updates.push("milestone_completion_date = ?");
      values.push(milestoneCompletionDate);
    }
    if (milestoneActualCompletionDate) {
      updates.push("milestone_actual_completion_date = ?");
      values.push(milestoneActualCompletionDate);
    }
    if (milestoneStatus) {
      updates.push("milestone_status = ?");
      values.push(milestoneStatus);
    }
    if (milestoneDescription) {
      updates.push("milestone_description = ?");
      values.push(milestoneDescription);
    }
    if (milestoneProgress !== undefined) {
      updates.push("milestone_progress = ?");
      values.push(milestoneProgress);
    }
    if (delayReason) {
      updates.push("delay_reason = ?");
      values.push(delayReason);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(milestoneId);

    const query = `
      UPDATE milestones
      SET ${updates.join(", ")}
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.json({
      success: true,
      message: "Milestone updated successfully",
    });
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({
      success: false,
      message: "Error updating milestone",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// Budget and UC API

app.post("/api/projects/:projectId/budget-installments", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { projectId } = req.params; // Extract project ID from the route parameters
    const {
      installmentAmount,
      installmentExpenditure,
      amountReceivedDate,
      utilizationCertificate,
    } = req.body;

    // Validate required fields
    if (!installmentAmount || !amountReceivedDate) {
      return res.status(400).json({
        success: false,
        message: "Installment amount and received date are required",
      });
    }

    // Insert budget installment into the database
    const [result] = await connection.execute(
      `INSERT INTO budget_installments (
        installment_amount, installment_expenditure, amount_received_date,
        utilization_certificate, project_id
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        installmentAmount,
        installmentExpenditure || 0.0, // Default expenditure to 0 if not provided
        amountReceivedDate,
        utilizationCertificate || null,
        projectId,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Budget installment created successfully",
      budgetInstallmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating budget installment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating budget installment",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/budget-installments/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params; // Extract budget installment ID from route parameters
    const {
      installmentAmount,
      installmentExpenditure,
      amountReceivedDate,
      utilizationCertificate,
    } = req.body;

    const updates = [];
    const values = [];

    // Build update query dynamically
    if (installmentAmount !== undefined) {
      updates.push("installment_amount = ?");
      values.push(installmentAmount);
    }
    if (installmentExpenditure !== undefined) {
      updates.push("installment_expenditure = ?");
      values.push(installmentExpenditure);
    }
    if (amountReceivedDate) {
      updates.push("amount_received_date = ?");
      values.push(amountReceivedDate);
    }
    if (utilizationCertificate) {
      updates.push("utilization_certificate = ?");
      values.push(utilizationCertificate);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    const query = `
      UPDATE budget_installments
      SET ${updates.join(", ")}
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget installment not found",
      });
    }

    res.json({
      success: true,
      message: "Budget installment updated successfully",
    });
  } catch (error) {
    console.error("Error updating budget installment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating budget installment",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// Project Inspection

app.post("/api/projects/:projectId/inspections", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { projectId } = req.params;
    const {
      inspectionDate,
      officialName,
      officialEmail,
      officialPhone,
      officialDesignation,
      officialDepartment,
      inspectionType,
      inspectionInstruction,
      inspectionStatus,
      inspectionReport,
    } = req.body;

    if (!inspectionDate || !officialName || !inspectionType) {
      return res.status(400).json({
        success: false,
        message: "Inspection date, official name, and type are required",
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO project_inspections (
        inspection_date, official_name, official_email, official_phone, 
        official_designation, official_department, inspection_type, 
        inspection_instruction, inspection_status, inspection_report, project_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        inspectionDate,
        officialName,
        officialEmail || null,
        officialPhone || null,
        officialDesignation || null,
        officialDepartment || null,
        inspectionType,
        inspectionInstruction || null,
        inspectionStatus || null,
        inspectionReport || null,
        projectId,
        1,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Inspection created successfully",
      inspectionId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating inspection",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/inspections/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const {
      inspectionDate,
      officialName,
      officialEmail,
      officialPhone,
      officialDesignation,
      officialDepartment,
      inspectionType,
      inspectionInstruction,
      inspectionStatus,
      inspectionReport,
      status,
    } = req.body;

    const updates = [];
    const values = [];

    if (inspectionDate) {
      updates.push("inspection_date = ?");
      values.push(inspectionDate);
    }
    if (officialName) {
      updates.push("official_name = ?");
      values.push(officialName);
    }
    if (officialEmail) {
      updates.push("official_email = ?");
      values.push(officialEmail);
    }
    if (officialPhone) {
      updates.push("official_phone = ?");
      values.push(officialPhone);
    }
    if (officialDesignation) {
      updates.push("official_designation = ?");
      values.push(officialDesignation);
    }
    if (officialDepartment) {
      updates.push("official_department = ?");
      values.push(officialDepartment);
    }
    if (inspectionType) {
      updates.push("inspection_type = ?");
      values.push(inspectionType);
    }
    if (inspectionInstruction) {
      updates.push("inspection_instruction = ?");
      values.push(inspectionInstruction);
    }
    if (inspectionStatus) {
      updates.push("inspection_status = ?");
      values.push(inspectionStatus);
    }
    if (inspectionReport) {
      updates.push("inspection_report = ?");
      values.push(inspectionReport);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    const query = `
      UPDATE project_inspections 
      SET ${updates.join(", ")}
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found",
      });
    }

    res.json({
      success: true,
      message: "Inspection updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating inspection",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// Project Essential Test

app.post("/api/projects/:projectId/tests", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { projectId } = req.params;
    const {
      testName,
      dateOfSampleCollection,
      samplingAuthority,
      sampleTestLabName,
      sampleTestReport,
      sampleCollectionSiteImages,
    } = req.body;

    if (!testName || !dateOfSampleCollection) {
      return res.status(400).json({
        success: false,
        message: "Test name and date of sample collection are required",
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO project_essential_tests (
        test_name, date_of_sample_collection, sampling_authority, 
        sample_test_lab_name, sample_test_report, sample_collection_site_images, 
        project_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testName,
        dateOfSampleCollection,
        samplingAuthority || null,
        sampleTestLabName || null,
        sampleTestReport || null,
        sampleCollectionSiteImages
          ? JSON.stringify(sampleCollectionSiteImages)
          : null,
        projectId,
        1,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      testId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating test",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/tests/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const {
      testName,
      dateOfSampleCollection,
      samplingAuthority,
      sampleTestLabName,
      sampleTestReport,
      sampleCollectionSiteImages,
      status,
    } = req.body;

    const updates = [];
    const values = [];

    if (testName) {
      updates.push("test_name = ?");
      values.push(testName);
    }
    if (dateOfSampleCollection) {
      updates.push("date_of_sample_collection = ?");
      values.push(dateOfSampleCollection);
    }
    if (samplingAuthority) {
      updates.push("sampling_authority = ?");
      values.push(samplingAuthority);
    }
    if (sampleTestLabName) {
      updates.push("sample_test_lab_name = ?");
      values.push(sampleTestLabName);
    }
    if (sampleTestReport) {
      updates.push("sample_test_report = ?");
      values.push(sampleTestReport);
    }
    if (sampleCollectionSiteImages) {
      updates.push("sample_collection_site_images = ?");
      values.push(JSON.stringify(sampleCollectionSiteImages));
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    const query = `
      UPDATE project_essential_tests
      SET ${updates.join(", ")}
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.json({
      success: true,
      message: "Test updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating test",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.post("/api/projects/:projectId/gallery", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { projectId } = req.params;
    const {
      image,
      imageDescription,
      latitude,
      longitude,
      elevation,
      accuracy,
      time,
    } = req.body;

    if (!image || !time) {
      return res.status(400).json({
        success: false,
        message: "Image and time are required",
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO project_gallery (
        image, image_description, latitude, longitude, elevation, 
        accuracy, time, project_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        image,
        imageDescription || null,
        latitude || null,
        longitude || null,
        elevation || null,
        accuracy || null,
        time,
        projectId,
        1,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Gallery entry created successfully",
      galleryId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating gallery entry",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/gallery/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const {
      image,
      imageDescription,
      latitude,
      longitude,
      elevation,
      accuracy,
      time,
      status,
    } = req.body;

    const updates = [];
    const values = [];

    if (image) {
      updates.push("image = ?");
      values.push(image);
    }
    if (imageDescription) {
      updates.push("image_description = ?");
      values.push(imageDescription);
    }
    if (latitude !== undefined) {
      updates.push("latitude = ?");
      values.push(latitude);
    }
    if (longitude !== undefined) {
      updates.push("longitude = ?");
      values.push(longitude);
    }
    if (elevation !== undefined) {
      updates.push("elevation = ?");
      values.push(elevation);
    }
    if (accuracy !== undefined) {
      updates.push("accuracy = ?");
      values.push(accuracy);
    }
    if (time) {
      updates.push("time = ?");
      values.push(time);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    const query = `
      UPDATE project_gallery
      SET ${updates.join(", ")}
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery entry not found",
      });
    }

    res.json({
      success: true,
      message: "Gallery entry updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating gallery entry",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.post("/api/projects/:projectId/issues", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { projectId } = req.params; // Extract project ID from route parameters
    const {
      issueName,
      issueDescription,
      issueRaisedBy,
      issueRaisedDate,
      assignedTo,
      issueReportedOn,
      issueStatus,
      issueClosedDate,
      issueClosedBy,
    } = req.body;

    // Validate required fields
    if (!issueName || !issueRaisedBy || !issueRaisedDate) {
      return res.status(400).json({
        success: false,
        message: "Issue name, raised by, and raised date are required",
      });
    }

    // Insert the issue into the database
    const [result] = await connection.execute(
      `INSERT INTO issues (
        issue_name, issue_description, issue_raised_by, issue_raised_date, 
        assigned_to, issue_reported_on, issue_status, issue_closed_date, 
        issue_closed_by, project_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        issueName,
        issueDescription || null,
        issueRaisedBy,
        issueRaisedDate,
        assignedTo || null,
        issueReportedOn || null,
        issueStatus || null,
        issueClosedDate || null,
        issueClosedBy || null,
        projectId,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issueId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating issue",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.put("/api/issues/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params; // Extract issue ID from route parameters
    const {
      issueName,
      issueDescription,
      issueRaisedBy,
      issueRaisedDate,
      assignedTo,
      issueReportedOn,
      issueStatus,
      issueClosedDate,
      issueClosedBy,
    } = req.body;

    const updates = [];
    const values = [];

    // Build dynamic update query
    if (issueName) {
      updates.push("issue_name = ?");
      values.push(issueName);
    }
    if (issueDescription) {
      updates.push("issue_description = ?");
      values.push(issueDescription);
    }
    if (issueRaisedBy !== undefined) {
      updates.push("issue_raised_by = ?");
      values.push(issueRaisedBy);
    }
    if (issueRaisedDate) {
      updates.push("issue_raised_date = ?");
      values.push(issueRaisedDate);
    }
    if (assignedTo !== undefined) {
      updates.push("assigned_to = ?");
      values.push(assignedTo);
    }
    if (issueReportedOn) {
      updates.push("issue_reported_on = ?");
      values.push(issueReportedOn);
    }
    if (issueStatus) {
      updates.push("issue_status = ?");
      values.push(issueStatus);
    }
    if (issueClosedDate) {
      updates.push("issue_closed_date = ?");
      values.push(issueClosedDate);
    }
    if (issueClosedBy !== undefined) {
      updates.push("issue_closed_by = ?");
      values.push(issueClosedBy);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    const query = `
      UPDATE issues
      SET ${updates.join(", ")}
      WHERE id = ?`;

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.json({
      success: true,
      message: "Issue updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating issue",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/issues/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params; // Issue ID

    const [rows] = await connection.execute(
      `SELECT 
        i.id, i.issue_name AS issueName, i.issue_description AS issueDescription,
        i.issue_raised_by AS issueRaisedBy, i.issue_raised_date AS issueRaisedDate,
        i.assigned_to AS assignedTo, i.issue_reported_on AS issueReportedOn,
        i.issue_status AS issueStatus, i.issue_closed_date AS issueClosedDate,
        i.issue_closed_by AS issueClosedBy, i.project_id AS projectId, 
        p.project_name AS projectName
      FROM issues i
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching issue",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/projects/:projectId/issues", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { projectId } = req.params; // Project ID

    const [rows] = await connection.execute(
      `SELECT 
        i.id, i.issue_name AS issueName, i.issue_description AS issueDescription,
        i.issue_raised_by AS issueRaisedBy, i.issue_raised_date AS issueRaisedDate,
        i.assigned_to AS assignedTo, i.issue_reported_on AS issueReportedOn,
        i.issue_status AS issueStatus, i.issue_closed_date AS issueClosedDate,
        i.issue_closed_by AS issueClosedBy
      FROM issues i
      WHERE i.project_id = ?`,
      [projectId]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching issues for the project",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.get("/api/issues", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT 
        i.id, i.issue_name AS issueName, i.issue_description AS issueDescription,
        i.issue_raised_by AS issueRaisedBy, i.issue_raised_date AS issueRaisedDate,
        i.assigned_to AS assignedTo, i.issue_reported_on AS issueReportedOn,
        i.issue_status AS issueStatus, i.issue_closed_date AS issueClosedDate,
        i.issue_closed_by AS issueClosedBy, i.project_id AS projectId, 
        p.project_name AS projectName
      FROM issues i
      LEFT JOIN projects p ON i.project_id = p.id
      ORDER BY i.issue_raised_date DESC`
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all issues",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

app.post("/generate-pdf", async (req, res) => {
  const data = req.body;

  try {
    const doc = new pdfkit();
    const pdfPath = `/tmp/project_report_${Date.now()}.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Add Header Image

    doc.image("header.png", 0, 0, {
      width: doc.page.width,
      height: 150,
    });
    // Add a line break after the header image
    doc.moveDown(6);

    // Add Title
    // doc.fontSize(20).text("Project Report", { align: "center" });
    // doc.moveDown();

    // Project Details
    doc.fontSize(14).text(`Project Name: ${data.projectName}`);
    doc.text(`Project Department: ${data.projectDepartment}`);
    doc.text(`Project Manager: ${data.concernedProjectManager}`);
    doc.text(`Goals & Objectives: ${data.projectGoal || "N/A"}`);
    doc.moveDown();

    // Milestones
    doc.fontSize(16).text("Milestones", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    data.mileStones.forEach((milestone, index) => {
      doc.text(
        `${index + 1}. ${milestone.milestoneName || "N/A"} - ${
          milestone.milestoneStatus || "N/A"
        }`
      );
      doc.text(`Start Date: ${milestone.milestoneFromDate || "N/A"}`);
      doc.text(
        `Planned Completion Date: ${milestone.milestoneCompletionDate || "N/A"}`
      );
      doc.text(
        `Actual Completion Date: ${
          milestone.milestoneActualCompletionDate || "N/A"
        }`
      );
      doc.text(`Progress: ${milestone.milestoneProgress || "N/A"}%`);
      doc.moveDown();
    });

    // Budget Installments
    doc
      .fontSize(16)
      .text("Budget Received in Installments", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    data.budgetInstallment.forEach((installment, index) => {
      doc.text(
        `${index + 1}. Amount: ₹${
          installment.installmentAmount || "N/A"
        }, Expenditure: ₹${
          installment.installmentExpenditure || "N/A"
        }, Received Date: ${
          installment.amountReceivedDate || "N/A"
        }, Certificate: ${installment.utilizationCertificate || "N/A"}`
      );
      doc.moveDown();
    });

    // Project Inspections
    doc.fontSize(16).text("Project Inspections", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    data.projectInspection.forEach((inspection, index) => {
      doc.text(
        `${index + 1}. Date: ${
          inspection.inspectionDate || "N/A"
        }, Official Name: ${inspection.officialName || "N/A"}, Instruction: ${
          inspection.inspectionInstruction || "N/A"
        }, Report: ${inspection.inspectionReport || "N/A"}`
      );
      doc.moveDown();
    });

    // Essential Tests
    doc.fontSize(16).text("Essential Tests", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    data.projectEssentialTest.forEach((test, index) => {
      doc.text(
        `${index + 1}. Test Name: ${test.testName || "N/A"}, Date Collected: ${
          test.dateOfSampleCollection || "N/A"
        }, Authority: ${test.samplingAuthority || "N/A"}, Lab: ${
          test.sampleTestLabName || "N/A"
        }, Report: ${test.sampleTestReport || "N/A"}`
      );
      doc.moveDown();
    });

    // Project Component Gallery
    doc.fontSize(16).text("Project Component Gallery", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    for (const [index, gallery] of data.projectGallery.entries()) {
      doc.text(
        `${index + 1}. Description: ${
          gallery.imageDescription || "N/A"
        }, Latitude: ${gallery.latitude || "N/A"}, Longitude: ${
          gallery.longitude || "N/A"
        }, Uploaded: ${gallery.time || "N/A"}`
      );

      // Download the image and embed it in the PDF
      if (gallery.image) {
        const imageResponse = await axios.get(gallery.image, {
          responseType: "arraybuffer",
        });
        const imageBuffer = Buffer.from(imageResponse.data, "binary");

        // Embed the image into the PDF
        doc.image(imageBuffer, {
          fit: [400, 300], // Adjust the size of the image
          align: "center",
        });
        doc.moveDown();
      }
    }

    // Finalize PDF
    doc.end();

    writeStream.on("finish", () => {
      res.download(pdfPath, "Project_Report.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }
        fs.unlinkSync(pdfPath); // Delete the file after sending
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
