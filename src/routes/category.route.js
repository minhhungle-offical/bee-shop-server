import express from 'express'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '../controllers/category.controller.js'
import { upload } from '../middlewares/upload.js'

const categoryRouter = express.Router()

categoryRouter.get('/', getAllCategories)
categoryRouter.post('/', upload.single('image'), createCategory)
categoryRouter.put('/:id', upload.single('image'), updateCategory)
categoryRouter.delete('/:id', deleteCategory)

export default categoryRouter
