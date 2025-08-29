import { model, Schema } from 'mongoose'

export const Category = model(
  'Category',
  new Schema(
    {
      name: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      image: {
        publicId: { type: String, default: '' },
        url: { type: String, default: '' },
      },
    },
    { timestamps: true },
  ),
)
