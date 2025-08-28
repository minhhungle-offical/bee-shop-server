import express from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/product.controller.js'
import { upload } from '../middlewares/upload.js'
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '../controllers/post.controller.js'

const postRouter = express.Router()

postRouter.get('/', getAllPosts)
postRouter.get('/:id', getPostById)
postRouter.post('/', upload.single('image'), createPost)
postRouter.put('/:id', upload.single('image'), updatePost)
postRouter.delete('/:id', deletePost)

export default postRouter
