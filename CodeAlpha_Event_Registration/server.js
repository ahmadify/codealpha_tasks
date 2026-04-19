const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
require("./db")

const eventRoutes = require("./routes/events")
const userRoutes = require("./routes/users")
const registrationRoutes = require("./routes/registrations")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Event Registration API is running" })
})

app.use("/api/events", eventRoutes)
app.use("/api/users", userRoutes)
app.use("/api/registrations", registrationRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})