const form = document.getElementById('urlForm')
const originalUrlInput = document.getElementById('originalUrl')
const message = document.getElementById('message')
const result = document.getElementById('result')
const resultOriginal = document.getElementById('resultOriginal')
const resultShort = document.getElementById('resultShort')
const urlList = document.getElementById('urlList')

async function loadUrls() {
  const response = await fetch('/api/urls')
  const data = await response.json()

  urlList.innerHTML = ''

  if (!data.data || data.data.length === 0) {
    urlList.innerHTML = '<p>No URLs saved yet.</p>'
    return
  }

  data.data.forEach((item) => {
    const div = document.createElement('div')
    div.className = 'url-item'
    div.innerHTML = `
      <p><strong>Original:</strong> ${item.original_url}</p>
      <p><strong>Short:</strong> <a href="${item.short_url}" target="_blank">${item.short_url}</a></p>
    `
    urlList.appendChild(div)
  })
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const originalUrl = originalUrlInput.value.trim()

  if (!originalUrl) {
    message.textContent = 'Please enter a URL.'
    result.classList.add('hidden')
    return
  }

  const response = await fetch('/api/urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ originalUrl })
  })

  const data = await response.json()

  message.textContent = data.message

  if (data.data) {
    resultOriginal.textContent = data.data.original_url
    resultShort.textContent = data.data.short_url
    resultShort.href = data.data.short_url
    result.classList.remove('hidden')
    originalUrlInput.value = ''
    loadUrls()
  } else {
    result.classList.add('hidden')
  }
})

loadUrls()