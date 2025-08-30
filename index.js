import { connect } from 'mongoose'
import { config } from 'dotenv'
import app from './src/app.js'
config()

// ===== Connect DB & Start Server =====
const PORT = process.env.PORT || 8000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/db'

connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Failed to connect MongoDB', err)
    process.exit(1)
  })
