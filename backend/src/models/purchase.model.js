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

module.exports = {
  createPurchase,
};