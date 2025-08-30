import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import categoryRouter from './routes/category.route.js'
import productRouter from './routes/product.route.js'
import { sendError } from './utils/sendError.js'

dotenv.config()
const app = express()

// ===== CORS Options =====
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173']

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

// ===== Middlewares =====
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ===== Routes =====
app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)

// ===== Not Found =====
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('Error:', err)
  sendError(res, err.status || 500, err.message || 'Internal Server Error')
})

export default app
