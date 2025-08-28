import cloudinary, { uploadToCloudinary } from '../configs/cloudinary.js'
import { Post } from '../models/Post.js'
import { sendError } from '../utils/sendError.js'

// GET /api/posts
export const getAllPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    const filter = search ? { title: { $regex: search, $options: 'i' } } : {}

    const total = await Post.countDocuments(filter)
    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      message: 'Posts fetched successfully',
      data: {
        data: posts,
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

// GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return sendError(res, 404, 'Post not found')

    res.json({
      success: true,
      message: 'Post fetched successfully',
      data: post,
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}

// POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { title, excerpt, content } = req.body
    const createdBy = req.user.id

    const image = req.file
      ? await (async () => {
          const { publicId, url } = await uploadToCloudinary(req.file.buffer, 'posts')
          return { publicId, url }
        })()
      : null

    const post = new Post({ title, excerpt, content, image, createdBy })
    await post.save()

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const { title, excerpt, content } = req.body

    const post = await Post.findById(req.params.id)
    if (!post) return sendError(res, 404, 'Post not found')

    if (req.file) {
      if (post.image?.publicId) await cloudinary.uploader.destroy(post.image.publicId)
      const { publicId, url } = await uploadToCloudinary(req.file.buffer, 'posts')
      post.image = { publicId, url }
    }

    post.title = title ?? post.title
    post.excerpt = excerpt ?? post.excerpt
    post.content = content ?? post.content

    await post.save()

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return sendError(res, 404, 'Post not found')

    if (post.image?.publicId) await cloudinary.uploader.destroy(post.image.publicId)
    await post.deleteOne()

    res.json({
      success: true,
      message: 'Post deleted successfully',
      data: {},
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}
