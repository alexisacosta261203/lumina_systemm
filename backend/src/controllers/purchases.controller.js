const PurchaseModel = require('../models/purchase.model');

const createPurchase = async (req, res) => {
  try {
    const newId = await PurchaseModel.createPurchase(req.body);

    res.status(201).json({
      ok: true,
      message: 'Compra registrada correctamente.',
      id: newId,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al registrar compra.',
      error: error.message,
    });
  }
};

module.exports = {
  createPurchase,
};