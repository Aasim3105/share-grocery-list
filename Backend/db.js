const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",   // your mysql password
  database: "grocery_db" // your DB name
});

db.connect(err => {
  if (err) {
    console.error("DB Error:", err);
  } else {
    console.log("✅ Database Connected");
  }
});

module.exports = db;