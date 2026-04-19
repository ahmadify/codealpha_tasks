const express = require('express')
const { shortenUrl, getAllUrls } = require('../controllers/urlController')

const router = express.Router()

router.post('/', shortenUrl)
router.get('/', getAllUrls)

module.exports = router