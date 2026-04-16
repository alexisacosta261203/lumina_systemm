const pool = require('../config/db');

const createPurchase = async (purchaseData) => {
  const {
    cursoId,
    nombreCliente,
    correoCliente,
    telefono,
    metodoPago,
    comprobanteUrl = null,
  } = purchaseData;

  const [result] = await pool.execute(
    `INSERT INTO compras
      (curso_id, nombre_cliente, correo_cliente, telefono, metodo_pago, comprobante_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      cursoId,
      nombreCliente,
      correoCliente,
      telefono,
      metodoPago,
      comprobanteUrl,
    ]
  );

  return result.insertId;
};

module.exports = {
  createPurchase,
};