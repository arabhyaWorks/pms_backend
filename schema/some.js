const dataFetched = {
  id: "1",
  projectName: "Project Name",
  projectDescription: "Project Description",
  // Goals & Objectives
  projectObjectives: "Project Objectives",
  projectDepartment: "Project Department",
  projectStatus: "Project Status",
  projectApprovalDate: "15-05-2023",
  approvedProjectCost: "₹100 करोड़",
  contractDate: "20-06-2023",
  contractCost: "₹95 करोड़",
  totalReleasedFunds: "₹50 करोड़",
  totalExpenditure: "₹45 करोड़",

  // fetch the physical progress from milestone table based on months
  lastMonthPhysicalProgress: "40%",
  currentMonthPhysicalProgress: "50%",

  projectStartDate: "01-07-2023",
  originalCompletionDate: "31-12-2025",
  revisedCompletionDate: "30-06-2026",

  // fetch the last fund received date from budget table
  lastFundReceivedDate: "01-12-2023",
  utilizationCertificateSubmissionDate: "15-12-2023",

  governmentApprovalDateAndOrder: "20-05-2023, आदेश संख्या 101/2023",
  delayReason: "भूमि अधिग्रहण में देरी",
  schemeName: "औद्योगिक क्षेत्र विकास योजना",
  landAvailabilityDate: "15-06-2023",

  geoTaggedPhotosLastMonth: "फोटो लिंक 1",
  geoTaggedPhotosCurrentMonth: "फोटो लिंक 2",
  meetingInstructions: [
    {
      desc: "निर्देश 1",
      date: "01-01-2023",
      compliance: "अनुपालन 1",
      projectId: "1",
      feedback: "प्रतिक्रिया 1",
    },
  ],

  projectManager: {
    officialName: "Official Name",
    officialEmail: "Official Email",
    officialPhone: "Official Phone",
    officialDesignation: "Official Designation",
    officialDepartment: "Official Department",
    projectId: "1",
  },
  concernedOfficial: [
    {
      officialName: "Official Name",
      officialEmail: "Official Email",
      officialPhone: "Official Phone",
      officialDesignation: "Official Designation",
      officialDepartment: "Official Department",
      projectId: "1",
    },
  ],
  projectInspection: [
    {
      inspectionDate: "Inspection Date",
      officialName: "Official Name",
      officialEmail: "Official Email",
      officialPhone: "Official Phone",
      officialDesignation: "Official Designation",
      officialDepartment: "Official Department",
      InspectionType: "Inspection Type",
      inspectionInstruction: "Inspection Instruction",
      inspectionStatus: "Inspection Status",
      inspectionReport: "inspectionReport.pdf",
      projectId: "1",
    },
  ],
  projectEssentialTest: [
    {
      testName: "Test Name",
      dateOfSampleCollection: "Date Of Sample Collection",
      samplingAuthority: "Sampling Authority",
      sampleTestLabName: "Sample Test Lab Name",
      sampleTestReport: "sampleTestReport.pdf",
      sampleCollectionSiteImage: [
        "sampleCollectionSiteImage1.jpg",
        "sampleCollectionSiteImage2.jpg",
      ],
      projectId: "1",
    },
  ],
  projectGallery: [
    {
      image: "image1.jpg",
      imageDescription: "Image Description",
      lattitude: "Lattitude",
      longitude: "Longitude",
      elevation: "Elevation",
      accuracy: "Accuracy",
      time: "Time",
      projectId: "1",
    },
  ],
  mileStones: [
    {
      milestoneName: "Milestone Name",
      milestoneFromDate: "Milestone From Date",
      milestoneCompletionDate: "Milestone Completion Date",
      milestoneActualCompletionDate: "Milestone Actual Completion Date",
      milestoneStatus: "Milestone Status",
      milestoneDescription: "Milestone Description",
      milestoneProgress: "Milestone Progress",
      projectId: "1",
    },
  ],
  issues: [
    {
      issueName: "Issue Name",
      issueDescription: "Issue Description",
      issueRaisedBy: "Issue Raised By",
      issueRaisedDate: "Issue Raised Date",
      assignedTo: "Assigned To",
      issueReportedOn: "Issue Reported On",
      issueStatus: "Issue Status",
      issueClosedDate: "Issue Closed Date",
      issueClosedBy: "Issue Closed By",

      projectId: "1",
    },
  ],
  budegetInstallment: [
    {
      installmentAmount: "Installment Amount",
      amountRecievedDate: "Amount Recieved Date",
      utilizationCertificate: "uc.pdf",
      projectId: "1",
    },
  ],

  //projectDetails
  lastUpdatedDate: "Last Updated Date",
  lastUpdatedDateOnCMIS: "Last Updated Date",
  projectHandoverDate: "Project Handover",
  projectHandoverTo: "Project Handover To",
  parallelRequirements: "Parallel Requirements",
};

const dataUpload = {
  projectName: "Project Name",
  projectDescription: "Project Description",
  // Goals & Objectives
  projectObjectives: "Project Objectives",
  projectDepartment: "Project Department",
  projectStatus: "Project Status",
  projectApprovalDate: "15-05-2023",
  approvedProjectCost: "₹100 करोड़",
  contractDate: "20-06-2023",
  contractCost: "₹95 करोड़",
  totalReleasedFunds: "₹50 करोड़",
  totalExpenditure: "₹45 करोड़",

  projectStartDate: "01-07-2023",
  originalCompletionDate: "31-12-2025",
  revisedCompletionDate: "30-06-2026",

  governmentApprovalDateAndOrder: "20-05-2023, आदेश संख्या 101/2023",
  delayReason: "भूमि अधिग्रहण में देरी",
  schemeName: "औद्योगिक क्षेत्र विकास योजना",
  landAvailabilityDate: "15-06-2023",

  geoTaggedPhotosLastMonth: "फोटो लिंक 1",
  geoTaggedPhotosCurrentMonth: "फोटो लिंक 2",
  meetingInstructions: [
    {
      desc: "निर्देश 1",
      date: "01-01-2023",
      compliance: "अनुपालन 1",
      projectId: "1",
      feedback: "प्रतिक्रिया 1",
    },
  ],

  projectManager: {
    officialName: "Official Name",
    officialEmail: "Official Email",
    officialPhone: "Official Phone",
    officialDesignation: "Official Designation",
    officialDepartment: "Official Department",
  },
  concernedOfficial: [
    {
      officialName: "Official Name",
      officialEmail: "Official Email",
      officialPhone: "Official Phone",
      officialDesignation: "Official Designation",
      officialDepartment: "Official Department",
    },
  ],
  projectInspection: [
    {
      inspectionDate: "Inspection Date",
      officialName: "Official Name",
      officialEmail: "Official Email",
      officialPhone: "Official Phone",
      officialDesignation: "Official Designation",
      officialDepartment: "Official Department",
      InspectionType: "Inspection Type",
      inspectionInstruction: "Inspection Instruction",
      inspectionStatus: "Inspection Status",
      inspectionReport: "inspectionReport.pdf",
    },
  ],
  projectEssentialTest: [
    {
      testName: "Test Name",
      dateOfSampleCollection: "Date Of Sample Collection",
      samplingAuthority: "Sampling Authority",
      sampleTestLabName: "Sample Test Lab Name",
      sampleTestReport: "sampleTestReport.pdf",
      sampleCollectionSiteImage: [
        "sampleCollectionSiteImage1.jpg",
        "sampleCollectionSiteImage2.jpg",
      ],
    },
  ],
  projectGallery: [
    {
      image: "image1.jpg",
      imageDescription: "Image Description",
      lattitude: "Lattitude",
      longitude: "Longitude",
      elevation: "Elevation",
      accuracy: "Accuracy",
      time: "Time",
    },
  ],
  mileStones: [
    {
      milestoneName: "Milestone Name",
      milestoneFromDate: "Milestone From Date",
      milestoneCompletionDate: "Milestone Completion Date",
      milestoneActualCompletionDate: "Milestone Actual Completion Date",
      milestoneStatus: "Milestone Status",
      milestoneDescription: "Milestone Description",
      milestoneProgress: "Milestone Progress",
    },
  ],
  issues: [
    {
      issueName: "Issue Name",
      issueDescription: "Issue Description",
      issueRaisedBy: "Issue Raised By",
      issueRaisedDate: "Issue Raised Date",
      assignedTo: "Assigned To",
      issueReportedOn: "Issue Reported On",
      issueStatus: "Issue Status",
      issueClosedDate: "Issue Closed Date",
      issueClosedBy: "Issue Closed By",
    },
  ],
  budegetInstallment: [
    {
      installmentAmount: "Installment Amount",
      amountRecievedDate: "Amount Recieved Date",
      utilizationCertificate: "uc.pdf",
    },
  ],

  //projectDetails
  lastUpdatedDate: "Last Updated Date",
  lastUpdatedDateOnCMIS: "Last Updated Date",
  projectHandoverDate: "Project Handover",
  projectHandoverTo: "Project Handover To",
  parallelRequirements: "Parallel Requirements",
};

const ProjectTableDataKeys = [
  "id",
  "projectName",
  "projectStatus",
  "projectDepartment",
  "projectApprovalDate",
  "approvedProjectCost",
  "contractDate",
  "contractCost",
  "totalReleasedFunds",
  "totalExpenditure",
  //   Inhe fetch karo milestone table se (derived data)
  "lastMonthPhysicalProgress",
  "currentMonthPhysicalProgress",

  "projectStartDate",
  "originalCompletionDate",
  "revisedCompletionDate",

  //   Inhe fetch karo budget table se (derived data)
  "lastFundReceivedDate",
  "utilizationCertificateSubmissionDate",

  "governmentApprovalDateAndOrder",

  "delayReason",
  "schemeName",
  "landAvailabilityDate",

//   INhe fetch karo gallery instructions table se
  "geoTaggedPhotosLastMonth",
  "geoTaggedPhotosCurrentMonth",
  
  "meetingInstructions",
  "complianceOfMeetingInstructions",
  "feedback",
];



const tableHeaderKeys = [
  "id",
  "projectName",
  "projectStatus",
  "projectDepartment",
  "projectApprovalDate",
  "approvedProjectCost",
  "contractDate",
  "contractCost",
  "totalReleasedFunds",
  "totalExpenditure",
  "lastMonthPhysicalProgress",
  "currentMonthPhysicalProgress",
  "projectStartDate",
  "originalCompletionDate",
  "revisedCompletionDate",
  "lastFundReceivedDate",
  "utilizationCertificateSubmissionDate",
  "governmentApprovalDateAndOrder",
  "delayReason",
  "schemeName",
  "landAvailabilityDate",
  "geoTaggedPhotosLastMonth",
  "geoTaggedPhotosCurrentMonth",
  "meetingInstructions",
  "complianceOfMeetingInstructions",
  "feedback",
];