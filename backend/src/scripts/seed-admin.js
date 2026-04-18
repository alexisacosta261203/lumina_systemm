require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const seedAdmin = async () => {
  try {
    const correo = 'admin@lumina.com';
    const passwordPlano = 'Admin1234';

    const [existing] = await pool.execute(
      'SELECT id, correo, role FROM users WHERE correo = ? LIMIT 1',
      [correo]
    );

    if (existing.length > 0) {
      console.log('El admin ya existe:', existing[0]);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    const [result] = await pool.execute(
      `INSERT INTO users
        (nombre, apellidos, correo, telefono, password_hash, role, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Admin', 'Lumina', correo, '4490000000', passwordHash, 'admin', 1]
    );

    console.log('Admin creado correctamente con ID:', result.insertId);
    console.log('Correo: admin@lumina.com');
    console.log('Password: Admin1234');

    process.exit(0);
  } catch (error) {
    console.error('Error al crear admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();