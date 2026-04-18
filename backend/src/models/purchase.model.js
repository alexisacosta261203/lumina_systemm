const pool = require('../config/db');

const createPurchase = async (purchaseData) => {
  const {
    cursoId,
    userId,
    nombreCliente,
    correoCliente,
    telefono,
    metodoPago,
    comprobanteUrl = null,
    precioPagado,
  } = purchaseData;

  const [result] = await pool.execute(
    `INSERT INTO compras
      (curso_id, user_id, nombre_cliente, correo_cliente, telefono, metodo_pago, comprobante_url, precio_pagado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cursoId,
      userId,
      nombreCliente,
      correoCliente,
      telefono,
      metodoPago,
      comprobanteUrl,
      precioPagado,
    ]
  );

  return result.insertId;
};

const hasUserPurchasedCourse = async (userId, cursoId) => {
  const [rows] = await pool.execute(
    `SELECT id
     FROM compras
     WHERE user_id = ? AND curso_id = ?
     LIMIT 1`,
    [userId, cursoId]
  );

  return rows.length > 0;
};

const getPurchasedCourseIdsByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT curso_id
     FROM compras
     WHERE user_id = ?`,
    [userId]
  );

  return rows.map((row) => row.curso_id);
};

const getPurchasedCoursesByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      c.id,
      c.titulo,
      c.descripcion,
      c.imagen_url AS imagenUrl,
      c.precio,
      c.categoria,
      c.duracion_horas AS duracionHoras,
      c.nivel,
      c.activo
     FROM compras cp
     INNER JOIN cursos c ON c.id = cp.curso_id
     WHERE cp.user_id = ?
     ORDER BY cp.id DESC`,
    [userId]
  );

  return rows;
};

module.exports = {
  createPurchase,
  hasUserPurchasedCourse,
  getPurchasedCourseIdsByUser,
  getPurchasedCoursesByUser,
};