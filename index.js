const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "animesh1234",
  database: "projectManagementSystem",
  waitForConnections: true,
  connectionLimit: 10,
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
        revised_project_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        req.body.projectFinalcialApprovalGONumber || null,
        req.body.projectFinalcialApprovalDate || null,
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
    if (req.body.budegetInstallment?.length > 0) {
      for (const budget of req.body.budegetInstallment) {
        await connection.execute(
          `INSERT INTO budget_installments 
           (installment_amount, installment_expenditure, amount_received_date, 
            utilization_certificate, project_id)
           VALUES (?, ?, ?, ?, ?)`,
          [
            budget.installmentAmount || null,
            budget.installmentExpenditure || null,
            budget.amountRecievedDate || null,
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
          revised_project_cost as revisedProjectCost
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
    res
      .status(500)
      .json({
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
          p.actual_project_start_date as actualProjectStartDate,
          p.project_completion_date as projectCompletionDate,
          p.revised_project_sanction_date as revisedProjectSanctionDate,
          p.revised_project_completion_date as revisedProjectCompletionDate,
          p.estimated_completion_date as estimatedCompletionDate,
          p.actual_completion_date as actualCompletionDate,
          p.work_order_formation_date as workOrderFormationDate,
          p.land_handover_date as landHandoverDate,
          p.last_updated_date as lastUpdatedDate,
          p.last_updated_date_on_cmis as lastUpdatedDateOnCmis,
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
            SUM(installment_amount) as totalReleasedFunds,
            SUM(installment_expenditure) as totalExpenditure,
            MAX(amount_received_date) as lastFundReceivedDate,
            MAX(utilization_certificate) as utilizationCertificateSubmissionDate
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
          totalReleasedFunds: budgetSummary[0].totalReleasedFunds,
          totalExpenditure: budgetSummary[0].totalExpenditure,
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
        total_approved_budget,
        revised_project_cost,
        last_updated_date,
        last_updated_date_on_cmis
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        req.body.totalApprovedBudget || null,
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

app.post("/api/users/signup", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      officialName,
      email,
      officialPhone,
      officialDesignation,
      officialDepartment,
      password,
      role,
    } = req.body;

    if (
      !email ||
      !password ||
      !officialName ||
      !officialPhone ||
      !officialDesignation ||
      !officialDepartment
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await connection.execute(
      "SELECT user_id FROM users WHERE username = ? OR official_email = ?",
      [email, email]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const [result] = await connection.execute(
      `INSERT INTO users (
        official_name, official_email, official_phone, 
        official_designation, official_department, 
        username, password, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        officialName,
        email,
        officialPhone,
        officialDesignation,
        officialDepartment,
        email,
        hashedPassword,
        role || 3,
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
    const updates = [];
    const values = [];

    const {
      officialName,
      officialPhone,
      officialDesignation,
      officialDepartment,
      password,
      role,
      status,
    } = req.body;

    // Build update query dynamically
    if (officialName) {
      updates.push("official_name = ?");
      values.push(officialName);
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
    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    updates.push("updated_at = ?");
    values.push(new Date());

    // Add userId to values array
    values.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE user_id = ?`;

    const [result] = await connection.execute(updateQuery, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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

// Get single user by ID
app.get("/api/users/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [user] = await connection.execute(
      `SELECT 
        user_id, official_name, official_email, official_phone,
        official_designation, official_department, username,
        role, status, created_at, updated_at
       FROM users 
       WHERE user_id = ?`,
      [req.params.id]
    );

    if (!user.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// Get all users with filters
app.get("/api/users", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { department, role, departmentId, status } = req.query;
    let conditions = [];
    let values = [];

    if (department) {
      conditions.push("official_department = ?");
      values.push(department);
    }
    if (role) {
      conditions.push("role = ?");
      values.push(role);
    }
    if (departmentId) {
      conditions.push("department_id = ?");
      values.push(departmentId);
    }
    if (status !== undefined) {
      conditions.push("status = ?");
      values.push(status);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const [users] = await connection.execute(
      `SELECT 
        user_id, official_name, official_email, official_phone,
        official_designation, official_department, username,
        role, status, created_at, updated_at
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC`,
      values
    );

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
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
      data: totalBudget[0]
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
      data: stats
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
      data: stats
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
        remaining: (budgetStats[0].totalApprovedBudget || 0) - (budgetStats[0].totalReceivedBudget || 0),
        unspent: (budgetStats[0].totalReceivedBudget || 0) - (budgetStats[0].totalExpenditure || 0)
      },
      activeProjects: {
        count: activeProjectStats[0].activeProjectCount || 0,
        budget: activeProjectStats[0].activeProjectBudget || 0,
        received: activeProjectStats[0].activeProjectReceived || 0,
        expenditure: activeProjectStats[0].activeProjectExpenditure || 0,
        remaining: (activeProjectStats[0].activeProjectBudget || 0) - (activeProjectStats[0].activeProjectReceived || 0),
        unspent: (activeProjectStats[0].activeProjectReceived || 0) - (activeProjectStats[0].activeProjectExpenditure || 0)
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
