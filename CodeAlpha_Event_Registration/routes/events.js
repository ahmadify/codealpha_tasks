const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", (req, res) => {
  const sql = "SELECT * FROM events ORDER BY event_date ASC"

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch events" })
    }

    res.json(rows)
  })
})

router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM events WHERE id = ?"

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch event" })
    }

    if (!row) {
      return res.status(404).json({ error: "Event not found" })
    }

    res.json(row)
  })
})

router.post("/", (req, res) => {
  const { title, description, event_date, location, capacity } = req.body

  if (!title || !event_date || !location || !capacity) {
    return res.status(400).json({ error: "Title, event_date, location, and capacity are required" })
  }

  const sql = `
    INSERT INTO events (title, description, event_date, location, capacity)
    VALUES (?, ?, ?, ?, ?)
  `

  const values = [title, description || "", event_date, location, capacity]

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to create event" })
    }

    res.status(201).json({
      message: "Event created successfully",
      eventId: this.lastID
    })
  })
})

module.exports = router