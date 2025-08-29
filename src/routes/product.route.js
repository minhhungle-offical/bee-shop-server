import express from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/product.controller.js'
import { upload } from '../middlewares/upload.js'

const productRouter = express.Router()

productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.post('/', upload.array('images', 6), createProduct)
productRouter.put('/:id', upload.array('images', 6), updateProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter
