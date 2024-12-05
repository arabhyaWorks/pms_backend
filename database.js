// const mysql = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// // const db = mysql.createConnection({
// //   host: "developer.chciq0eeey32.ap-south-1.rds.amazonaws.com",
// //   user: "dev_pmo_bhadohi",
// //   password: "Bhadohi$$321##",
// //   database: 'pmo_bhadohi',
// // });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     process.exit(1);
//   }
//   console.log("Connected to the database");
// });

// const validateRequest = (req, res, next) => {
//   const { body } = req;

//   for (const key in body) {
//     if (body[key] === undefined || body[key] === null || body[key] === "") {
//       return res.status(400).json({
//         error: `The field "${key}" cannot be empty.`,
//       });
//     }
//   }

//   if (body.officialPhone && !/^\d{10}$/.test(body.officialPhone)) {
//     return res.status(400).json({
//       error: "Phone number must be exactly 10 digits.",
//     });
//   }

//   next();
// };

// module.exports = { db, validateRequest };


const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { db };