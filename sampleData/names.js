const axios = require("axios");
const executiveAgency = [
  "HITES",
  "उ.प्र. राज्य निर्माण सहकारी संध लि. लखनऊ (यू.पी.आर.एन.एस.एस.)",
  "उ.प्र. राज्य सेतु निगम लि.",
  "उ0 प्र0 प्रोजेक्ट्स कारपोरेशन लि0-16",

  "उ0 प्र0 राजकीय निर्माण निगम लि0- भदोही",
  "उ0 प्र0 राजकीय निर्माण निगम लि0- सोनभद्र इकाई",

  "उ0 प्र0 राज्य पर्यटन विकास निगम(( यू0 पी0 एस0 टी0 डी0 सी0)",
  "उत्तर प्रदेश जल निगम (RURAL)",
  "उत्तर प्रदेश जल निगम (URBAN)",
  "उत्तर प्रदेश राज्य निर्माण एवं श्रम विकास सहकारी संघ लिमिटेड",
  "लोक निर्माण विभाग",
  "सिंचाई एवं जल संसाधन विभाग",
  "नगर पंचायत - घोसियाबाजार",
  "नगर पंचायत - ज्ञानपुर",
  "नगर पंचायत - नईबाजार",
  "नगर पंचायत - सुरियावाँ",
  "सी० एण्ड डी० एस०",
  "उत्तर प्रदेश आवास विकास परिषद निर्माण इकाई",
  "उपायुक्त उद्योग",
  " ग्रामीण अभियंत्रण विभाग",
];

// const executiveAgencyEng = [
//   "HITES",
//   "UPRNSS",
//   "Setu Nigam",
//   "UP PCL-16",
//   "RNN Bhadohi",
//   "RNN Sonbhadra",
//   "UPSTDC",
//   "JAL NIGAM (R)",
//   "JAL NIGAM (U)",
//   "CLDF",
//   "PWD",
//   "Tubewell",
//   "Canal ",
//   "E.O. Ghosiya",
//   "E.O. Gyanpur",
//   "E.O. Nai Bazar",
//   "E.O. Suriyavan",
//   "C & DS",
//   "Awash Vikash",
//   "GMDIC",
//   "RES",
// ];

const vibhags = [
  "स्वास्थ्य विभाग",
  "पशुधन विभाग",
  "व्यवसायिक शिक्षा",
  "प्राविधिक शिक्षा",
  "पर्यटन विभाग",
  "चिकित्सा स्वास्थ्य एवं परिवार कल्याण",
  "स्वास्थ्य  विभाग अग्निशमन",
  "कृषि विभाग",
  "न्याय विभाग",
  "नगर विकास तथा नगरीय रोजगार एवं गरीबी उन्मूलन",
  "स्वास्थ्य  विभाग  IPHL",
  "गृह एवं गोपन",
  "स्वास्थ्य  विभाग  BPHU",
  "सिंचाई, जल संसाधन (जल शक्ति विभाग)",
  "शिक्षा विभाग",
  "अल्पसंख्यक कल्याण एवं वक्फ",
  "लोक निर्माण विभाग",
  "कारागार विभाग",
];

const createEntity = async (entity) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/entities",
      entity
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

for (let i = 0; i < executiveAgency.length; i++) {
  const entity = {
    entityName: executiveAgency[i],
    entityType: 2,
    status: 1,
  };
  createEntity(entity);
}
