const PDFDocument = require("pdfkit");
const fs = require("fs");
const convertToIST = require("./utils/convertIst");

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

const generateProjectPDF = (projectData) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 140,
  });

  const writeStream = fs.createWriteStream("project.pdf");
  doc.pipe(writeStream);

  // Add letterhead image
  doc.image("header.png", 0, 0, {
    width: doc.page.width,
    height: 150,
  });

  doc.page.margins = {
    top: 170,
    bottom: 50,
    left: 50,
    right: 50,
  };

  addProjectOverview(doc, projectData);
  addMilestones(doc, projectData);
  addInspections(doc, projectData);
  addEssentialTests(doc, projectData);
  addBudget(doc, projectData);

  doc.end();
  return new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
};

const addProjectOverview = (doc, data) => {
  doc.fontSize(16).text("Project Overview", {
    underline: true,
    indent: 50,
  });
  doc.moveDown();

  // Table-like structure with proper formatting
  const leftColumn = 50; // Left margin
  const valueColumn = 200; // Where values start
  const lineGap = 25; // Space between lines
  let yPosition = doc.y;

  // Helper function for adding rows
  const addRow = (label, value) => {
    doc.fontSize(12);
    doc.text(label, leftColumn, yPosition);
    doc.text(value || "N/A", valueColumn, yPosition);
    yPosition += lineGap;
  };

  // Add each detail row
  addRow("Project Name:", data.projectName);
  addRow("Department:", data.projectDepartment);
  addRow("Project Manager:", data.concernedProjectManager);
  addRow("Status:", data.projectStatus);
  addRow("Total Budget:", `₹${data.totalApprovedBudget}`);
  addRow("Contact:", data.concernedOfficialName);
  addRow("Executing Agency:", data.executingAgency);
  addRow("Project Goal:", data.projectGoal);
  addRow(
    "Sanction Date:",
    new Date(data.projectSanctionDate).toLocaleDateString()
  );
  addRow(
    "Completion Date:",
    new Date(data.projectCompletionDate).toLocaleDateString()
  );

  doc.moveDown(2);
};

const addMilestones = (doc, data) => {
  if (doc.y > 650) doc.addPage();

  doc.fontSize(16).text("Project Milestones", { underline: true });
  doc.moveDown();

  const tableTop = doc.y;
  const colWidths = [30, 150, 80, 80, 80, 80];

  // Headers
  let xPos = doc.page.margins.left;
  ["#", "Name", "Status", "Start Date", "End Date", "Progress"].forEach(
    (header, i) => {
      doc.fontSize(10).text(header, xPos, tableTop, { width: colWidths[i] });
      xPos += colWidths[i];
    }
  );

  doc.moveDown();
  let yPos = doc.y;

  data.mileStones.forEach((milestone, index) => {
    if (yPos > 750) {
      doc.addPage();
      yPos = doc.page.margins.top;
    }

    xPos = doc.page.margins.left;
    [
      (index + 1).toString(),
      milestone.milestoneName,
      milestone.milestoneStatus,
      new Date(milestone.milestoneFromDate).toLocaleDateString(),
      new Date(milestone.milestoneCompletionDate).toLocaleDateString(),
      `${milestone.milestoneProgress}%`,
    ].forEach((text, i) => {
      doc.text(text, xPos, yPos, { width: colWidths[i] });
      xPos += colWidths[i];
    });
    yPos += 20;
  });
  doc.moveDown(2);
};

const addInspections = (doc, data) => {
  if (doc.y > 650) doc.addPage();
  doc.fontSize(16).text("Project Inspection", {
    underline: true,
    indent: 50,
  });
  doc.moveDown();

  const tableTop = doc.y;
  const colWidths = [30, 80, 100, 120, 80];

  // Headers
  let xPos = doc.page.margins.left;
  [
    "S. No",
    "Inspection Date",
    "Officer",
    "Type",
    "Instruction",
    "Report",
  ].forEach((header, i) => {
    doc.fontSize(10).text(header, xPos, tableTop, { width: colWidths[i] });
    xPos += colWidths[i];
  });

  doc.moveDown();
  let yPos = doc.y;

  data.projectInspection.forEach((milestone, index) => {
    if (yPos > 750) {
      doc.addPage();
      yPos = doc.page.margins.top;
    }

    xPos = doc.page.margins.left;
    [
      (index + 1).toString(),
      convertToIST(milestone.inspectionDate),
      milestone.officialName,
      milestone.inspectionType,
      milestone.inspectionInstruction,
      milestone.inspectionReport,
    ].forEach((text, i) => {
      doc.text(text, xPos, yPos, { width: colWidths[i] });
      xPos += colWidths[i];
    });
    yPos += 20;
  });
  doc.moveDown(2);
};

const addEssentialTests = (doc, data) => {
  if (doc.y > 650) doc.addPage();
  doc.fontSize(16).text("Project Inspection", {
    underline: true,
    indent: 50,
  });
  doc.moveDown();
  data.projectEssentialTest.forEach((test, index) => {
    doc.fontSize(12).text(`Test ${index + 1}`);
    doc
      .fontSize(10)
      .text(`Name: ${test.testName}`)
      .text(
        `Date: ${new Date(test.dateOfSampleCollection).toLocaleDateString()}`
      )
      .text(`Authority: ${test.samplingAuthority}`)
      .text(`Lab: ${test.sampleTestLabName}`)
      .text(`Report: ${test.sampleTestReport}`);
    doc.moveDown();
  });
  doc.moveDown();
};

// const addEssentialTests = (doc, data) => {
//     if (doc.y > 650) doc.addPage();

//     doc.fontSize(16).text("Essential Tests", { underline: true });
//     doc.moveDown();

//     const tableTop = doc.y;
//     const colWidths = [30, 80, 100, 120, 80, 80, 60]; // Added width for Images column
//     const startX = 50;

//     // Headers
//     let xPos = startX;
//     const headers = [
//       "S. No",
//       "Inspection Date",
//       "Officer",
//       "Type",
//       "Instruction",
//       "Report",
//       "Images"
//     ];

//     headers.forEach((header, i) => {
//       doc.fontSize(10).text(header, xPos, tableTop, {
//         width: colWidths[i],
//         align: 'left'
//       });
//       xPos += colWidths[i];
//     });

//     doc.moveDown();
//     let yPos = doc.y;

//     data.projectEssentialTest.forEach((test, index) => {
//       if (yPos > 700) {
//         doc.addPage();
//         yPos = doc.page.margins.top + 50;
//       }

//       xPos = startX;
//       const row = [
//         (index + 1).toString(),
//         new Date(test.dateOfSampleCollection).toLocaleDateString(),
//         test.samplingAuthority || '',
//         test.testName || '',
//         test.sampleTestLabName || '',
//         test.sampleTestReport || '',
//         test.sampleCollectionSiteImages?.length || '0'
//       ];

//       row.forEach((cell, i) => {
//         doc.fontSize(10).text(cell, xPos, yPos, {
//           width: colWidths[i],
//           align: 'left'
//         });
//         xPos += colWidths[i];
//       });

//       yPos += 20;
//     });

//     doc.moveDown(2);
//    };

const addBudget = (doc, data) => {
  if (doc.y > 650) doc.addPage();

  doc.fontSize(16).text("Budget Information", { underline: true });
  doc.moveDown();

  doc
    .fontSize(12)
    .text("Budget Overview")
    .fontSize(10)
    .text(`Total Approved: ₹${data.totalApprovedBudget}`)
    .text(`Total Released: ₹${data.totalReleasedFunds}`)
    .text(`Total Expenditure: ₹${data.totalExpenditure}`);
  doc.moveDown();

  doc.fontSize(12).text("Installments");
  data.budgetInstallment.forEach((budget, index) => {
    doc
      .fontSize(10)
      .text(`Installment ${index + 1}:`)
      .text(`Amount: ₹${budget.installmentAmount}`)
      .text(`Expenditure: ₹${budget.installmentExpenditure}`)
      .text(
        `Date Received: ${new Date(
          budget.amountReceivedDate
        ).toLocaleDateString()}`
      )
      .text(`UC: ${budget.utilizationCertificate}`);
    doc.moveDown();
  });
};

// Export the function
module.exports = generateProjectPDF;


generateProjectPDF(data)
  .then(() => console.log("PDF generated successfully"))
  .catch((err) => console.error("Error generating PDF:", err));
