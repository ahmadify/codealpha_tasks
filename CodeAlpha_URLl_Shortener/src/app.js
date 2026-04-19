const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()
require('./models/db')

const urlRoutes = require('./routes/urlRoutes')
const { redirectToOriginalUrl } = require('./controllers/urlController')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({
    message: 'URL Shortener API is running'
  })
})

app.use('/app', express.static(path.join(__dirname, '../public')))

app.use('/api/urls', urlRoutes)
app.get('/:code', redirectToOriginalUrl)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})