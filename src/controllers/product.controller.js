import cloudinary, { uploadToCloudinary } from '../configs/cloudinary.js'
import { Product } from '../models/Product.js'
import { sendError } from '../utils/sendError.js'

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    const filter = {}
    if (search) filter.title = { $regex: search, $options: 'i' }

    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return sendError(res, 404, 'Product not found')

    res.json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { title, price, content, category, code } = req.body

    let images = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { publicId, url } = await uploadToCloudinary(file.buffer, 'products')
        images.push({ publicId, url })
      }
    }

    const product = new Product({
      title,
      price,
      content,
      images,
      category,
      code,
    })
    await product.save()

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { title, price, content, category, code, removeImages } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) return sendError(res, 404, 'Product not found')

    if (removeImages && Array.isArray(removeImages)) {
      for (const publicId of removeImages) {
        await cloudinary.uploader.destroy(publicId)
        product.images = product.images.filter((img) => img.publicId !== publicId)
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { publicId, url } = await uploadToCloudinary(file.buffer, 'products')
        product.images.push({ publicId, url })
      }
    }

    product.title = title ?? product.title
    product.price = price ?? product.price
    product.category = category ?? product.category
    product.code = code ?? product.code
    product.content = content ?? product.content

    await product.save()

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return sendError(res, 404, 'Product not found')

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.publicId)
      }
    }

    await product.deleteOne()

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: {},
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}
