import express from 'express'
import bodyParser from 'body-parser'
import { getAuth } from './routes/getAuth'
import { postAuth } from './routes/postAuth'
import { postToken } from './routes/postToken'
import { getUserinfo } from './routes/getUserinfo'
import { logMiddleware } from './middleware/logMiddleware'

const PORT = process.env.PORT || 8093

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(logMiddleware())

app.get('/auth', getAuth)
app.post('/auth', postAuth)
app.post('/token', postToken)
app.get('/userinfo', getUserinfo)

app.listen(PORT, () => console.log(`Server listening on :${PORT}`))
