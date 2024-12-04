import { convert } from './controllers/convert.js'
import express from 'express'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage })

const app = express()

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/convert', upload.single('xls'), (req, res, next) => {
  if (!req.file) return res.redirect('/')

  const ofx = convert(req.file)

  res.set({
    'Content-Type': 'text/plain',
    'Content-Disposition': `attachment; filename=${ofx.filename}`
  })

  res.send(Buffer.from(ofx.content))
})

app.listen(8080)
