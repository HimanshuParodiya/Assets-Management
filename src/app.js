import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, // accepting origin from 
    credentials: true
}))

app.use(express.json({ limit: "16kb" })) // middleware for parsing JSON payloads from incoming HTTP requests.  express.json() parses incoming requests with JSON payloads 
// sometimes url has + and %20 for that we use urlencoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// sometimes we want to store file in our server like favicon, image etc
app.use(express.static("public"))
// cookieParser -> to perform CRUD operation form server to user's browser
app.use(cookieParser())

export default app

// middlewares ->
