import { Category } from '../models/Category.js'
import { sendError } from '../utils/sendError.js'
import { generateUniqueSlug } from '../utils/slug.js'

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return sendError(res, 400, 'Category name is required')

    const slug = await generateUniqueSlug(name, Category)
    const category = new Category({ name, slug })
    await category.save()

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return sendError(res, 400, 'Category name is required')

    const slug = await generateUniqueSlug(name, Category, req.params.id)
    const updated = await Category.findByIdAndUpdate(req.params.id, { name, slug }, { new: true })
    if (!updated) return sendError(res, 404, 'Category not found')

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return sendError(res, 404, 'Category not found')

    await category.deleteOne()

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: {},
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}
