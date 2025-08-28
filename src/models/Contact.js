import { model, Schema } from 'mongoose'

export const Contact = model(
  'Contact',
  new Schema(
    {
      title: { type: String, required: true, trim: true },
      name: { type: Number, required: true },
      email: { type: Number, required: true },
      phone: { type: Number, required: true },
      content: { type: String, default: '' },
    },
    { timestamps: true },
  ),
)
