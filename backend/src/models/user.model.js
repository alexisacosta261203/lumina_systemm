const pool = require('../config/db');

const findUserByEmail = async (correo) => {
  const [rows] = await pool.execute(
    `SELECT 
      id,
      nombre,
      apellidos,
      correo,
      telefono,
      password_hash AS passwordHash,
      role,
      activo,
      created_at AS createdAt
     FROM users
     WHERE correo = ?
     LIMIT 1`,
    [correo]
  );

  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT 
      id,
      nombre,
      apellidos,
      correo,
      telefono,
      role,
      activo,
      created_at AS createdAt
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0];
};

const createUser = async (userData) => {
  const {
    nombre,
    apellidos,
    correo,
    telefono,
    passwordHash,
    role = 'user',
  } = userData;

  const [result] = await pool.execute(
    `INSERT INTO users
      (nombre, apellidos, correo, telefono, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, apellidos, correo, telefono, passwordHash, role]
  );

  return result.insertId;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};