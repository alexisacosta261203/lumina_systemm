const ContactModel = require('../models/contact.model');

const createContact = async (req, res) => {
  try {
    const newId = await ContactModel.createContact(req.body);

    res.status(201).json({
      ok: true,
      message: 'Mensaje de contacto registrado correctamente.',
      id: newId,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al registrar mensaje de contacto.',
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
};