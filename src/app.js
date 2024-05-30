import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import multer from 'multer'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, // accepting origin from 
    credentials: true
}))

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse urlencoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();

app.use(express.json({ limit: "16kb" })) // middleware for parsing JSON payloads from incoming HTTP requests.  express.json() parses incoming requests with JSON payloads 
// sometimes url has + and %20 for that we use urlencoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// sometimes we want to store file in our server like favicon, image etc
app.use(express.static("public"))
// cookieParser -> to perform CRUD operation form server to user's browser
app.use(cookieParser())

// Routes
import assetRouter from './routes/asset.routes.js'
import ticketRouter from './routes/ticket.routes.js'
app.use("/api/v1/assets", upload.none(), assetRouter)

app.use("/api/v1/ticket", upload.none(), ticketRouter)


export default app

// middlewares ->
