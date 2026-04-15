const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());


// 👉 ADD ITEM (replace localStorage)
app.post("/add-item", (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO items 
    (name, listId, category, status, checked, quantity, addedBy, approvedBy, reviewNote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    data.name,
    data.listId,
    data.category,
    data.status,
    data.checked,
    data.quantity,
    data.addedBy,
    data.approvedBy,
    data.reviewNote
  ], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Item added");
  });
});


// 👉 GET ITEMS
app.get("/items", (req, res) => {
  db.query("SELECT * FROM items", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

app.delete("/delete-item/:id", (req, res) => {
  db.query("DELETE FROM items WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Deleted");
  });
});