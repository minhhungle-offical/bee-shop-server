import { model, Schema, Types } from 'mongoose'

export const Product = model(
  'Product',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      slug: { type: String, required: true, unique: true },
      price: { type: Number, required: true },
      code: { type: String, required: true, trim: true },
      category: { type: Types.ObjectId, ref: 'Category', required: true },
      images: [
        {
          publicId: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      content: { type: String, default: '' },
    },
    { timestamps: true },
  ),
)
