import { Contact } from '../models/Contact.js'
import { sendError } from '../utils/sendError.js'

// GET /api/contacts
export const getAllContacts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    const filter = search ? { title: { $regex: search, $options: 'i' } } : {}

    const total = await Contact.countDocuments(filter)
    const contacts = await Contact.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      message: 'Contacts fetched successfully',
      data: {
        data: contacts,
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

// GET /api/contacts/:id
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) return sendError(res, 404, 'Contact not found')

    res.json({
      success: true,
      message: 'Contact fetched successfully',
      data: contact,
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}

// POST /api/contacts
export const createContact = async (req, res) => {
  try {
    const { title, name, email, phone, content } = req.body

    if (!title || !name || !email || !phone) return sendError(res, 400, 'Missing required fields')

    const contact = new Contact({ title, name, email, phone, content })
    await contact.save()

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// PUT /api/contacts/:id
export const updateContact = async (req, res) => {
  try {
    const { title, name, email, phone, content } = req.body

    const contact = await Contact.findById(req.params.id)
    if (!contact) return sendError(res, 404, 'Contact not found')

    contact.title = title ?? contact.title
    contact.name = name ?? contact.name
    contact.email = email ?? contact.email
    contact.phone = phone ?? contact.phone
    contact.content = content ?? contact.content

    await contact.save()

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    })
  } catch (err) {
    sendError(res, 400, err.message)
  }
}

// DELETE /api/contacts/:id
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) return sendError(res, 404, 'Contact not found')

    await contact.deleteOne()

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: {},
    })
  } catch (err) {
    sendError(res, 500, err.message)
  }
}
