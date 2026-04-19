const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id DESC"

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch users" })
    }

    res.json(rows)
  })
})

router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?"

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch user" })
    }

    if (!row) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(row)
  })
})

router.post("/", (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" })
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)"

  db.run(sql, [name, email], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Email already exists" })
      }

      return res.status(500).json({ error: "Failed to create user" })
    }

    res.status(201).json({
      message: "User created successfully",
      userId: this.lastID
    })
  })
})

module.exports = router