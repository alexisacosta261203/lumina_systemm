const pool = require('../config/db');

const createContact = async (contactData) => {
  const { nombre, correo, asunto, mensaje } = contactData;

  const [result] = await pool.execute(
    `INSERT INTO contactos
      (nombre, correo, asunto, mensaje)
     VALUES (?, ?, ?, ?)`,
    [nombre, correo, asunto, mensaje]
  );

  return result.insertId;
};

module.exports = {
  createContact,
};