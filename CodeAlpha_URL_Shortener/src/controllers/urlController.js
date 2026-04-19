const db = require('../models/db')
const generateShortCode = require('../utils/generateShortCode')

function shortenUrl(req, res) {
  const { originalUrl } = req.body

  if (!originalUrl) {
    return res.status(400).json({
      message: 'originalUrl is required'
    })
  }

  let parsedUrl

  try {
    parsedUrl = new URL(originalUrl)
  } catch {
    return res.status(400).json({
      message: 'Invalid URL'
    })
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return res.status(400).json({
      message: 'URL must start with http:// or https://'
    })
  }

  db.get(
    'SELECT * FROM urls WHERE original_url = ?',
    [originalUrl],
    (selectError, existingUrl) => {
      if (selectError) {
        return res.status(500).json({
          message: 'Database error'
        })
      }

      if (existingUrl) {
        return res.status(200).json({
          message: 'URL already shortened',
          data: {
            id: existingUrl.id,
            original_url: existingUrl.original_url,
            short_code: existingUrl.short_code,
            short_url: `${process.env.BASE_URL}/${existingUrl.short_code}`,
            created_at: existingUrl.created_at
          }
        })
      }

      createUniqueShortCode(originalUrl, res)
    }
  )
}

function createUniqueShortCode(originalUrl, res) {
  const shortCode = generateShortCode()

  db.get(
    'SELECT * FROM urls WHERE short_code = ?',
    [shortCode],
    (selectError, existingCode) => {
      if (selectError) {
        return res.status(500).json({
          message: 'Database error'
        })
      }

      if (existingCode) {
        return createUniqueShortCode(originalUrl, res)
      }

      db.run(
        'INSERT INTO urls (original_url, short_code) VALUES (?, ?)',
        [originalUrl, shortCode],
        function (insertError) {
          if (insertError) {
            return res.status(500).json({
              message: 'Failed to save URL'
            })
          }

          return res.status(201).json({
            message: 'Short URL created successfully',
            data: {
              id: this.lastID,
              original_url: originalUrl,
              short_code: shortCode,
              short_url: `${process.env.BASE_URL}/${shortCode}`
            }
          })
        }
      )
    }
  )
}

function redirectToOriginalUrl(req, res) {
  const { code } = req.params

  db.get(
    'SELECT * FROM urls WHERE short_code = ?',
    [code],
    (error, url) => {
      if (error) {
        return res.status(500).json({
          message: 'Database error'
        })
      }

      if (!url) {
        return res.status(404).json({
          message: 'Short URL not found'
        })
      }

      return res.redirect(url.original_url)
    }
  )
}

function getAllUrls(req, res) {
  db.all(
    'SELECT * FROM urls ORDER BY id DESC',
    [],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          message: 'Database error'
        })
      }

      const formattedRows = rows.map((row) => ({
        id: row.id,
        original_url: row.original_url,
        short_code: row.short_code,
        short_url: `${process.env.BASE_URL}/${row.short_code}`,
        created_at: row.created_at
      }))

      return res.status(200).json({
        message: 'URLs fetched successfully',
        count: formattedRows.length,
        data: formattedRows
      })
    }
  )
}

module.exports = {
  shortenUrl,
  redirectToOriginalUrl,
  getAllUrls
}