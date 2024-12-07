{
    "क्रम संख्या": 1,
    "परियोजना का नाम": "District Drug ware house Santravidas Nagar (Bhadohi)",
    "विभाग का नाम": "चिकित्सा स्वास्थ्य एवं परिवार कल्याण",
    "कार्यान्वयन एजेंसी": "HITES",
    "परियोजना  स्वीकृति की तिथि": "25.01.2022",
    "परियोजना की स्वीकृत लागत (करोड़ में)": 9.26,
    "अनुबन्ध की तिथि ": 7.439,
    "कुल अवमुक्त धनराशि (₹)": 6.81,
    "कुल व्यय धनराशि ((करोड़ में)": 6.81,
    "गत माह की भौतिक प्रगति (%)": 99.3,
    "वर्तमान माह की भौतिक प्रगति (%)": 99.5,
    "कार्य प्रारंभ की वास्तविक तिथ": "Nov' 22",
    "अनुबन्ध के अनुसार कार्य पूर्ण करने की तिथि": "July'24",
    "परियोजना पर अन्तिम बार धनराशि कब प्राप्त हुई": 45375,
    "उपयोग प्रमाण पत्र प्रस्तुत करने की तिथ": 45467,
    "अभ्यूक्ति": "\nबिजली का कार्य प्रगति पर "
},


this is the data 



based on the below table header 

const data = [
"क्रम संख्या", // id 1
"परियोजना का नाम", // projectName 2 
"परियोजना अद्यतन स्थिति", // projectStatus
"विभाग का नाम", // projectDepartment 3
"कार्यान्वयन एजेंसी", // executingAgency
"योजना का नाम", // scheme (19place)
"परियोजना स्वीकृति की तिथि", // projectSanctionDate 4
"परियोजना हेतु शासन द्वारा जारी वित्तीय स्वीकृति का दिनांक एवं शासनादेश संख्या", // projectFinancialApprovalGoNumber
"परियोजना की स्वीकृत लागत (करोड़ में) (₹)", // approvedProjectCost 5
"अनुबन्ध की तिथि", // contractDate 6 
"अनुबन्ध के अनुसर परियोजना की धनराशि (करोड़ में) (₹)", // contractCost 7 
"कुल अवमुक्त धनराशि (₹)", // totalReleasedFunds 8 // needs to be rechecked
"कुल व्यय धनराशि (₹)", // totalExpenditure 9
"गत माह की भौतिक प्रगति (%)", // lastMonthPhysicalProgress 10
"वर्तमान माह की भौतिक प्रगति (%)", // currentMonthPhysicalProgress  11
"कार्य प्रारंभ की वास्तविक तिथि", // actualProjectStartDate 12 
"अनुबन्ध के अनुसार कार्य पूर्ण करने की तिथि", // projectCompletionDate 13 
"मूल निर्धारित तिथि तक कार्य पूर्ण न होने की स्थिति मे विभाग द्वारा निर्धारित नई लक्षित तिथि",// ye nhi tha kahi bhi // revisedProjectCompletionDate 14
"परियोजना पर अन्तिम बार धनराशि कब प्राप्त हुई", // lastFundReceivedDate 15
"उपयोग प्रमाण पत्र प्रस्तुत करने की तिथि", // utilizationCertificateSubmissionDate 16
"यदि परियोजना मूल निर्धारित तिथि तक पूर्ण न  होने पर विलम्ब का कारण ", // delayReason nhi tha headers me 17
"कार्यदायी संस्था को भूमि उपलब्ध होने की तिथि", // landAvailabilityDate nhi tha header me 
"सीएमआईएस पर अंतिम अद्यतन तिथि", // lastUpdatedDateOnCmis
"पिछले माह की जियोटैग फोटो", // geoTaggedPhotosLastMonth
"वर्तमान माह की जियोटैग फोटो", // geoTaggedPhotosCurrentMonth
"समीक्षा बैठक निर्देश", // meetingDescription
"दिये गये निर्देश के सापेक्ष अनुपालन", // meetingCompliance
"अभ्यूक्ति", // meetingfeedback meetingComment
]


populate the below data

{
"projectName": "District Drug ware house Santravidas Nagar (Bhadohi)",
"projectStatus": 3,
"projectGoal": "Establish efficient wastewater treatment plants to reduce pollution in the Ganga river",
"projectDepartment": "चिकित्सा स्वास्थ्य एवं परिवार कल्याण",
"departmentId": 1,
"executingAgency": "Uttar Pradesh State Bridge Corporation, Bhadohi",
"executingAgencyId": 3,
"revisedProjectCost": "300000000",
"scheme": "Namami Gange Mission",
"description": "Construction of wastewater treatment plants and laying pipelines for the safe discharge of treated water into the Ganga",
"fundSanctionedBy": "State Urban Development Authority",
"concernedOfficialName": "Mr. Ashok Singh, Chief Engineer, +91-9876543201",
"concernedProjectManager": "Ms. Neha Sharma, Project Manager, +91-9876543202",
"projectSanctionDate": "2024-01-20",
"projectFinalcialApprovalGONumber": "UD/2024/GANGA/005",
"projectFinalcialApprovalDate": "2024-01-25",
"actualProjectStartDate": "2024-02-15",
"projectCompletionDate": "2025-12-31",
"revisedProjectSanctionDate": null,
"revisedProjectCompletionDate": "2026-03-31",
"estimatedCompletionDate": "2025-12-15",
"actualCompletionDate": null,
"workOrderFormationDate": "2024-01-28",
"landHandoverDate": "2024-02-05",
"contactInformation": 1004,
"lastUpdatedDate": "2024-03-22T14:30:00",
"lastUpdatedDateOnCMIS": "2024-03-22T14:30:00",
"projectHandoverDate": null,
"projectHandoverTo": null,
"approvedProjectCost":"1234567890",
"contractCost":"99999999",
"contractDate":"2024-03-22T14:30:00",
"parallelRequirements": "Environmental impact clearance, NOC from pollution control board",
"meetingInstructions": [
{
  "desc": "Finalize the design of wastewater treatment plants",
  "date": "2024-02-10",
  "compliance": "Completed",
  "feedback": "Design approved by the committee"
},
{
  "desc": "Begin land acquisition process",
  "date": "2024-02-05",
  "compliance": "In Progress",
  "feedback": "50% of the land acquired"
}
],
"projectInspection": [
{
  "inspectionDate": "2024-03-10",
  "officialName": "Dr. Rajesh Mehra",
  "officialEmail": "rajesh.mehra@namamigange.gov.in",
  "officialPhone": "+91-9876543203",
  "officialDesignation": "Senior Environmental Auditor",
  "officialDepartment": "Urban Development",
  "InspectionType": "Environmental Inspection",
  "inspectionInstruction": "Ensure compliance with environmental norms during construction",
  "inspectionStatus": "Completed",
  "inspectionReport": "environment_audit_march24.pdf"
}
],
"projectEssentialTest": [
{
  "testName": "Water Quality Test",
  "dateOfSampleCollection": "2024-03-01",
  "samplingAuthority": "Central Water Testing Authority",
  "sampleTestLabName": "National Water Quality Lab",
  "sampleTestReport": "water_quality_report.pdf",
  "sampleCollectionSiteImage": [
    "ganga_water_sample_1.jpg",
    "ganga_water_sample_2.jpg"
  ]
}
],
"projectGallery": [
{
  "image": "construction_site_1.jpg",
  "imageDescription": "Foundation work at treatment plant site in Bhadohi",
  "lattitude": "25.3949",
  "longitude": "82.5709",
  "elevation": "210.0",
  "accuracy": "2.5",
  "time": "2024-03-15T12:00:00"
}
],
"mileStones": [
{
  "milestoneName": "Foundation Work",
  "milestoneFromDate": "2024-02-15",
  "milestoneCompletionDate": "2024-05-31",
  "milestoneActualCompletionDate": null,
  "milestoneStatus": "In Progress",
  "milestoneDescription": "Construction of foundation for treatment plants",
  "milestoneProgress": "35.0"
},
{
  "milestoneName": "Pipeline Laying",
  "milestoneFromDate": "2024-06-01",
  "milestoneCompletionDate": "2024-12-31",
  "milestoneActualCompletionDate": null,
  "milestoneStatus": "Not Started",
  "milestoneDescription": "Laying of wastewater pipelines in urban areas",
  "milestoneProgress": "0"
}
],
"issues": [
{
  "issueName": "Delay in Land Clearance",
  "issueDescription": "Land clearance process is taking longer than expected",
  "issueRaisedBy": "Legal Team",
  "issueRaisedDate": "2024-02-25",
  "assignedTo": "Land Acquisition Team",
  "issueReportedOn": "2024-02-25",
  "issueStatus": "Open",
  "issueClosedDate": null,
  "issueClosedBy": null
}
],
"budegetInstallment": [
{
  "installmentAmount": "100000000.00",
  "installmentExpenditure": "25000000.00",
  "amountRecievedDate": "2024-03-01",
  "utilizationCertificate": "UC_March2024.pdf"
}
]
}



    "गत माह की भौतिक प्रगति (%)": 99.3,
    "वर्तमान माह की भौतिक प्रगति (%)": 99.5,


these physical progresses are from the milestones 


    "परियोजना पर अन्तिम बार धनराशि कब प्राप्त हुई": 45375,
    "उपयोग प्रमाण पत्र प्रस्तुत करने की तिथ": 45467,


these are from the budget uc upload  table 



"कुल अवमुक्त धनराशि (₹)", // totalReleasedFunds 8 // needs to be rechecked


"कुल अवमुक्त धनराशि (₹)", // totalReleasedFunds 8 // needs to be rechecked
"कुल व्यय धनराशि (₹)", // totalExpenditure 9


total released funds and total expenditure ka ye funda hai 

ki 


CREATE TABLE budget_installments (
id INT AUTO_INCREMENT PRIMARY KEY,
installment_amount DECIMAL(15, 2),
installment_expenditure DECIMAL(15, 2),
amount_received_date DATE,
utilization_certificate VARCHAR(255),
project_id INT,
FOREIGN KEY (project_id) REFERENCES projects(id)
);

particular project ka total released funds and total expenditure nikalne ke liye uss particular project ke sabhi budget installments ka sum nikalna padega and then uska total expenditure and total released funds nikal jayega



take अभ्यूक्ति as meeting feedback



{
    "क्रम संख्या": 1,
    "परियोजना का नाम": "District Drug ware house Santravidas Nagar (Bhadohi)",
    "विभाग का नाम": "चिकित्सा स्वास्थ्य एवं परिवार कल्याण",
    "कार्यान्वयन एजेंसी": "HITES",
    "परियोजना  स्वीकृति की तिथि": "25.01.2022",
    "परियोजना की स्वीकृत लागत (करोड़ में)": 9.26,
    "अनुबन्ध की तिथि ": 7.439,
    "कुल अवमुक्त धनराशि (₹)": 6.81,
    "कुल व्यय धनराशि ((करोड़ में)": 6.81,
    "गत माह की भौतिक प्रगति (%)": 99.3,
    "वर्तमान माह की भौतिक प्रगति (%)": 99.5,
    "कार्य प्रारंभ की वास्तविक तिथ": "Nov' 22",
    "अनुबन्ध के अनुसार कार्य पूर्ण करने की तिथि": "July'24",
    "परियोजना पर अन्तिम बार धनराशि कब प्राप्त हुई": 45375,
    "उपयोग प्रमाण पत्र प्रस्तुत करने की तिथ": 45467,
    "अभ्यूक्ति": "\nबिजली का कार्य प्रगति पर "
},

return this as 


{
    "projectName": "District Drug ware house Santravidas Nagar (Bhadohi)",
    "projectStatus": 3,
    "projectGoal": "",
    "projectDepartment": "चिकित्सा स्वास्थ्य एवं परिवार कल्याण",
    "departmentId": 1,
    "executingAgency": "HITES",
    "executingAgencyId": 3,
    "revisedProjectCost": "",
    "scheme": "",
    "description": "",
    "fundSanctionedBy": "",
    "concernedOfficialName": "",
    "concernedProjectManager": "",
    "projectSanctionDate": "2024-01-20",
    "projectFinalcialApprovalGONumber": "UD/2024/GANGA/005",
    "projectFinalcialApprovalDate": "2024-01-25",
    "actualProjectStartDate": "2024-02-15",
    "projectCompletionDate": "2025-12-31",
    "revisedProjectSanctionDate": null,
    "revisedProjectCompletionDate": "2026-03-31",
    "estimatedCompletionDate": "2025-12-15",
    "actualCompletionDate": null,
    "workOrderFormationDate": "2024-01-28",
    "landHandoverDate": "2024-02-05",
    "contactInformation": 1004,
    "lastUpdatedDate": "2024-03-22T14:30:00",
    "lastUpdatedDateOnCMIS": "2024-03-22T14:30:00",
    "projectHandoverDate": null,
    "projectHandoverTo": null,
    "approvedProjectCost":"",
    "contractCost":"",
    "contractDate":"2024-03-22T14:30:00",
    "parallelRequirements": "",
    "meetingInstructions": [
      {
        "desc": "",
        "date": "2024-02-05",
        "compliance": "In Progress",
        "feedback": ""
      }
    ],
    "projectInspection": [
      {
        "inspectionDate": "2024-03-10",
        "officialName": "",
        "officialEmail": "",
        "officialPhone": "+91-9876543203",
        "officialDesignation": "",
        "officialDepartment": "",
        "InspectionType": "",
        "inspectionInstruction": "",
        "inspectionStatus": "",
        "inspectionReport": "environment_audit_march24.pdf"
      }
    ],
    "projectEssentialTest": [
      {
        "testName": "",
        "dateOfSampleCollection": "2024-03-01",
        "samplingAuthority": "",
        "sampleTestLabName": "",
        "sampleTestReport": "",
        "sampleCollectionSiteImage": [
          "",
        ]
      }
    ],
    "projectGallery": [
      {
        "image": "",
        "imageDescription": "",
        "lattitude": "25.3949",
        "longitude": "82.5709",
        "elevation": "210.0",
        "accuracy": "2.5",
        "time": "2024-03-15T12:00:00"
      }
    ],
    "mileStones": [
      {
        "milestoneName": "",
        "milestoneFromDate": "2024-02-15",
        "milestoneCompletionDate": "2024-05-31",
        "milestoneActualCompletionDate": null,
        "milestoneStatus": "In Progress",
        "milestoneDescription": "",
        "milestoneProgress": "35.0"
      },
  
    ],
    "issues": [
      {
        "issueName": "",
        "issueDescription": "",
        "issueRaisedBy": "Legal Team",
        "issueRaisedDate": "2024-02-25",
        "assignedTo": "Land Acquisition Team",
        "issueReportedOn": "2024-02-25",
        "issueStatus": "Open",
        "issueClosedDate": null,
        "issueClosedBy": null
      }
    ],
    "budegetInstallment": [
      {
        "installmentAmount": "100000000.00",
        "installmentExpenditure": "25000000.00",
        "amountRecievedDate": "2024-03-01",
        "utilizationCertificate": "UC_March2024.pdf"
      }
    ]
  }