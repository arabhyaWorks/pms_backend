const data = {
  id: 14,
  projectName: "Clean Ganga Wastewater Treatment",
  projectStatus: "3",
  projectGoal:
    "Establish efficient wastewater treatment plants to reduce pollution in the Ganga river",
  projectDepartment: "Urban Development",
  departmentId: 1,
  executingAgency: "Uttar Pradesh State Bridge Corporation, Bhadohi",
  executingAgencyId: 3,
  scheme: "Namami Gange Mission",
  description:
    "Construction of wastewater treatment plants and laying pipelines for the safe discharge of treated water into the Ganga",
  fundSanctionedBy: "State Urban Development Authority",
  concernedOfficialName: "Mr. Ashok Singh, Chief Engineer, +91-9876543201",
  concernedProjectManager: "Ms. Neha Sharma, Project Manager, +91-9876543202",
  projectSanctionDate: "2024-01-19T18:30:00.000Z",
  projectFinancialApprovalGoNumber: "UD/2024/GANGA/005",
  projectFinancialApprovalDate: "2024-01-24T18:30:00.000Z",
  actualProjectStartDate: "2024-02-14T18:30:00.000Z",
  projectCompletionDate: "2025-12-30T18:30:00.000Z",
  revisedProjectSanctionDate: null,
  revisedProjectCompletionDate: "2026-03-30T18:30:00.000Z",
  estimatedCompletionDate: "2025-12-14T18:30:00.000Z",
  actualCompletionDate: null,
  workOrderFormationDate: "2024-01-27T18:30:00.000Z",
  landHandoverDate: "2024-02-04T18:30:00.000Z",
  contactInformation: 1004,
  lastUpdatedDate: "2024-03-22T09:00:00.000Z",
  lastUpdatedDateOnCmis: "2024-03-22T09:00:00.000Z",
  projectHandoverDate: null,
  projectHandoverTo: null,
  parallelRequirements:
    "Environmental impact clearance, NOC from pollution control board",
  totalApprovedBudget: "250000000.00",
  revisedProjectCost: "300000000.00",
  lastMonthPhysicalProgress: null,
  currentMonthPhysicalProgress: null,
  totalReleasedFunds: "100000000.00",
  totalExpenditure: "25000000.00",
  lastFundReceivedDate: "2024-02-29T18:30:00.000Z",
  utilizationCertificateSubmissionDate: "UC_March2024.pdf",
  geoTaggedPhotosLastMonth: null,
  geoTaggedPhotosCurrentMonth: null,
  meetingInstructions: [
    {
      id: 18,
      description: "Finalize the design of wastewater treatment plants",
      date: "2024-02-09T18:30:00.000Z",
      compliance: "Completed",
      projectId: 14,
      feedback: "Design approved by the committee",
    },
    {
      id: 19,
      description: "Begin land acquisition process",
      date: "2024-02-04T18:30:00.000Z",
      compliance: "In Progress",
      projectId: 14,
      feedback: "50% of the land acquired",
    },
  ],
  projectInspection: [
    {
      id: 10,
      inspectionDate: "2024-03-09T18:30:00.000Z",
      officialName: "Dr. Rajesh Mehra",
      officialEmail: "rajesh.mehra@namamigange.gov.in",
      officialPhone: "+91-9876543203",
      officialDesignation: "Senior Environmental Auditor",
      officialDepartment: "Urban Development",
      inspectionType: "Environmental Inspection",
      inspectionInstruction:
        "Ensure compliance with environmental norms during construction",
      inspectionStatus: "Completed",
      inspectionReport: "environment_audit_march24.pdf",
      projectId: 14,
    },
  ],
  projectEssentialTest: [
    {
      id: 10,
      testName: "Water Quality Test",
      dateOfSampleCollection: "2024-02-29T18:30:00.000Z",
      samplingAuthority: "Central Water Testing Authority",
      sampleTestLabName: "National Water Quality Lab",
      sampleTestReport: "water_quality_report.pdf",
      sampleCollectionSiteImages: [],
      projectId: 14,
    },
  ],
  projectGallery: [
    {
      id: 10,
      image: "construction_site_1.jpg",
      imageDescription: "Foundation work at treatment plant site in Bhadohi",
      latitude: "25.39490000",
      longitude: "82.57090000",
      elevation: "210.00",
      accuracy: "2.50",
      time: "2024-03-15T06:30:00.000Z",
      projectId: 14,
    },
  ],
  mileStones: [
    {
      id: 19,
      milestoneName: "Pipeline Laying",
      milestoneFromDate: "2024-05-31T18:30:00.000Z",
      milestoneCompletionDate: "2024-12-30T18:30:00.000Z",
      milestoneActualCompletionDate: null,
      milestoneStatus: "Not Started",
      milestoneDescription: "Laying of wastewater pipelines in urban areas",
      milestoneProgress: "0.00",
      projectId: 14,
    },
    {
      id: 18,
      milestoneName: "Foundation Work",
      milestoneFromDate: "2024-02-14T18:30:00.000Z",
      milestoneCompletionDate: "2024-05-30T18:30:00.000Z",
      milestoneActualCompletionDate: null,
      milestoneStatus: "In Progress",
      milestoneDescription: "Construction of foundation for treatment plants",
      milestoneProgress: "35.00",
      projectId: 14,
    },
  ],
  issues: [
    {
      id: 10,
      issueName: "Delay in Land Clearance",
      issueDescription: "Land clearance process is taking longer than expected",
      issueRaisedBy: "Legal Team",
      issueRaisedDate: "2024-02-24T18:30:00.000Z",
      assignedTo: "Land Acquisition Team",
      issueReportedOn: "2024-02-24T18:30:00.000Z",
      issueStatus: "Open",
      issueClosedDate: null,
      issueClosedBy: null,
      projectId: 14,
    },
  ],
  budgetInstallment: [
    {
      id: 10,
      installmentAmount: "100000000.00",
      installmentExpenditure: "25000000.00",
      amountReceivedDate: "2024-02-29T18:30:00.000Z",
      utilizationCertificate: "UC_March2024.pdf",
      projectId: 14,
    },
  ],
};

const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateProjectPDF = (projectData) => {
  // Create a document with smart configuration
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  // Pipe the PDF to file
  const writeStream = fs.createWriteStream("project.pdf");
  doc.pipe(writeStream);
  

  // Header
  doc.fontSize(20).text("Project Details Report", { align: "center" });
  doc.moveDown(2);

  // Project Overview
  doc.fontSize(16).text("Project Overview", { underline: true });
  doc.moveDown();

  // Project Details Table
  const details = [
    ["Project Name:", projectData.projectName],
    ["Department:", projectData.projectDepartment],
    ["Project Manager:", projectData.concernedProjectManager],
    ["Status:", projectData.projectStatus],
    ["Total Budget:", `₹${projectData.totalApprovedBudget}`],
    ["Contact:", projectData.concernedOfficialName],
  ];

  details.forEach(([key, value]) => {
    doc
      .fontSize(12)
      .text(key, { continued: true, width: 150 })
      .text(value || "N/A", { continued: false });
    doc.moveDown(0.5);
  });

  doc.moveDown(2);

  // Milestones
  doc.fontSize(16).text("Project Milestones", { underline: true });
  doc.moveDown();

  projectData.mileStones.forEach((milestone, index) => {
    doc.fontSize(12).text(`${index + 1}. ${milestone.milestoneName}`);
    doc
      .fontSize(10)
      .text(`Status: ${milestone.milestoneStatus}`)
      .text(`Progress: ${milestone.milestoneProgress}%`)
      .text(
        `Timeline: ${new Date(
          milestone.milestoneFromDate
        ).toLocaleDateString()} - ${new Date(
          milestone.milestoneCompletionDate
        ).toLocaleDateString()}`
      );
    doc.moveDown();
  });

  if (doc.y > 700) doc.addPage();

  // Inspections
  doc.fontSize(16).text("Project Inspections", { underline: true });
  doc.moveDown();

  projectData.projectInspection.forEach((inspection, index) => {
    doc
      .fontSize(12)
      .text(
        `${index + 1}. Date: ${new Date(
          inspection.inspectionDate
        ).toLocaleDateString()}`
      )
      .fontSize(10)
      .text(`Officer: ${inspection.officialName}`)
      .text(`Type: ${inspection.inspectionType}`)
      .text(`Status: ${inspection.inspectionStatus}`);
    doc.moveDown();
  });

  if (doc.y > 700) doc.addPage();

  // Budget
  doc.fontSize(16).text("Budget Information", { underline: true });
  doc.moveDown();

  projectData.budgetInstallment.forEach((budget, index) => {
    doc
      .fontSize(12)
      .text(`Installment ${index + 1}`)
      .fontSize(10)
      .text(`Amount: ₹${budget.installmentAmount}`)
      .text(`Expenditure: ₹${budget.installmentExpenditure}`)
      .text(
        `Date: ${new Date(budget.amountReceivedDate).toLocaleDateString()}`
      );
    doc.moveDown();
  });

  // Finalize the PDF
  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve());
    writeStream.on("error", reject);
  });
};

// Usage
const createPDF = async () => {
  try {
    await generateProjectPDF(data);
    console.log("PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

createPDF();

// Usage:
// app.get("/api/projects/:id/pdf", async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const [project] = await connection.execute(
//       "SELECT * FROM projects WHERE id = ?",
//       [projectId]
//     );

//     if (!project.length) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Fetch all related data (similar to your existing get project API)
//     // ... fetch milestones, inspections, budget etc.

//     const doc = generateProjectPDF(projectData);

//     // Set response headers
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=project-${projectId}.pdf`
//     );

//     // Pipe the PDF document to the response
//     doc.pipe(res);
//     doc.end();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error generating PDF" });
//   }
// });

// module.exports = generateProjectPDF;
