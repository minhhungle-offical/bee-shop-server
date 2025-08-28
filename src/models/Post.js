import { model, Schema } from 'mongoose'

export const Post = model(
  'Post',
  new Schema(
    {
      title: { type: String, required: true, trim: true },
      excerpt: { type: String, trim: true },
      image: {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
      },
      content: { type: String, default: '' },
    },
    { timestamps: true },
  ),
)
