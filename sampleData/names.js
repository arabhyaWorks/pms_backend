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

const executiveAgencyEng = [
  "HITES",
  "UPRNSS",
  "Setu Nigam",
  "UP PCL-16",
  "RNN Bhadohi",
  "RNN Sonbhadra",
  "UPSTDC",
  "JAL NIGAM (R)",
  "JAL NIGAM (U)",
  "CLDF",
  "PWD",
  "Tubewell",
  "Canal ",
  "E.O. Ghosiya",
  "E.O. Gyanpur",
  "E.O. Nai Bazar",
  "E.O. Suriyavan",
  "C & DS",
  "Awash Vikash",
  "GMDIC",
  "RES",
];

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

console.log(executiveAgency.length);

// upload the data till

// भदोही के पलहिया में पाईप पेयजल योजना


const data = {
  "success": true,
  "data": [
      {
          "id": 3,
          "entity_name": "स्वास्थ्य विभाग",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 4,
          "entity_name": "पशुधन विभाग",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 5,
          "entity_name": "व्यवसायिक शिक्षा",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 6,
          "entity_name": "प्राविधिक शिक्षा",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 7,
          "entity_name": "पर्यटन विभाग",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 8,
          "entity_name": "चिकित्सा स्वास्थ्य एवं परिवार कल्याण",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 9,
          "entity_name": "स्वास्थ्य  विभाग अग्निशमन",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 10,
          "entity_name": "कृषि विभाग",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 11,
          "entity_name": "न्याय विभाग",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 12,
          "entity_name": "नगर विकास तथा नगरीय रोजगार एवं गरीबी उन्मूलन",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 13,
          "entity_name": "स्वास्थ्य  विभाग  IPHL",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 14,
          "entity_name": "गृह एवं गोपन",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 15,
          "entity_name": "स्वास्थ्य  विभाग  BPHU",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 16,
          "entity_name": "सिंचाई, जल संसाधन (जल शक्ति विभाग)",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 17,
          "entity_name": "शिक्षा विभाग",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 18,
          "entity_name": "अल्पसंख्यक कल्याण एवं वक्फ",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 19,
          "entity_name": "कारागार विभाग",
          "entity_type": 1,
          "status": 1
      },
      {
          "id": 20,
          "entity_name": "HITES",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 21,
          "entity_name": "उ.प्र. राज्य निर्माण सहकारी संध लि. लखनऊ (यू.पी.आर.एन.एस.एस.)",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 22,
          "entity_name": "उ.प्र. राज्य सेतु निगम लि.",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 23,
          "entity_name": "उ0 प्र0 प्रोजेक्ट्स कारपोरेशन लि0-16",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 24,
          "entity_name": "उ0 प्र0 राज्य पर्यटन विकास निगम( यू0 पी0 एस0 टी0 डी0 सी0)",
          "entity_type": 2,
          "status": 1
      },
   
      {
          "id": 26,
          "entity_name": "उत्तर प्रदेश जल निगम (RURAL)",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 27,
          "entity_name": "उत्तर प्रदेश जल निगम (URBAN)",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 28,
          "entity_name": "उत्तर प्रदेश राज्य निर्माण एवं श्रम विकास सहकारी संघ लिमिटेड",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 29,
          "entity_name": "लोक निर्माण विभाग",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 30,
          "entity_name": "सिंचाई एवं जल संसाधन विभाग",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 31,
          "entity_name": "नगर पंचायत - घोसियाबाजार",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 32,
          "entity_name": "नगर पंचायत - ज्ञानपुर",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 33,
          "entity_name": "नगर पंचायत - नईबाजार",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 34,
          "entity_name": "नगर पंचायत - सुरियावाँ",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 35,
          "entity_name": "सी० एण्ड डी० एस०",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 36,
          "entity_name": "उत्तर प्रदेश आवास विकास परिषद निर्माण इकाई",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 37,
          "entity_name": "उपायुक्त उद्योग",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 38,
          "entity_name": "ग्रामीण अभियंत्रण विभाग",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 39,
          "entity_name": "उ0 प्र0 राजकीय निर्माण निगम लि0- सोनभद्र इकाई",
          "entity_type": 2,
          "status": 1
      },
      {
          "id": 40,
          "entity_name": "उ0 प्र0 राजकीय निर्माण निगम लि0- भदोही",
          "entity_type": 2,
          "status": 1
      }
  ]
}