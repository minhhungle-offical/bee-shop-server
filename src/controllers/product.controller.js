import cloudinary, { uploadToCloudinary } from '../configs/cloudinary.js'
import { Product } from '../models/Product.js'
import { sendError } from '../utils/sendError.js'
import { generateUniqueSlug } from '../utils/slug.js'

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    const filter = {}
    if (search) filter.name = { $regex: search, $options: 'i' }

    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name')

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
    const { name, price, content, category, code } = req.body

    let images = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { publicId, url } = await uploadToCloudinary(file.buffer, 'products')
        images.push({ publicId, url })
      }
    }

    const slug = await generateUniqueSlug(name, Product)

    const product = new Product({
      name,
      price,
      content,
      images,
      category,
      code,
      slug,
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
    const { name, price, content, category, code, removeImages } = req.body
    const { id } = req.params

    const product = await Product.findById(id)
    if (!product) return sendError(res, 404, 'Product not found')

    if (name && name !== product.name) {
      product.slug = await generateUniqueSlug(name, Product, id)
      product.name = name
    }

    let removeList = []
    if (removeImages) {
      removeList = Array.isArray(removeImages) ? removeImages : JSON.parse(removeImages)
    }

    if (removeList.length > 0) {
      for (const publicId of removeList) {
        await cloudinary.uploader.destroy(publicId)
        product.images = product.images.filter((img) => img.publicId !== publicId)
      }
    }

    if (req.files?.length > 0) {
      for (const file of req.files) {
        const { publicId, url } = await uploadToCloudinary(file.buffer, 'products')
        if (publicId && url) {
          product.images.push({ publicId, url })
        }
      }
    }

    if (price !== undefined) product.price = price
    if (category !== undefined) product.category = category
    if (code !== undefined) product.code = code
    if (content !== undefined) product.content = content

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
