const PurchaseModel = require('../models/purchase.model');
const UserModel = require('../models/user.model');
const pool = require('../config/db');

const createPurchase = async (req, res) => {
  try {
    const { cursoId, metodoPago, comprobanteUrl = null } = req.body;

    if (!cursoId || !metodoPago) {
      return res.status(400).json({
        ok: false,
        message: 'cursoId y metodoPago son obligatorios.',
      });
    }

    const user = await UserModel.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    const alreadyPurchased = await PurchaseModel.hasUserPurchasedCourse(user.id, cursoId);

    if (alreadyPurchased) {
      return res.status(409).json({
        ok: false,
        message: 'Ya compraste este curso.',
      });
    }

    const [courseRows] = await pool.execute(
      `SELECT id, titulo, precio, activo
       FROM cursos
       WHERE id = ?
       LIMIT 1`,
      [cursoId]
    );

    const course = courseRows[0];

    if (!course) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado.',
      });
    }

    if (!course.activo) {
      return res.status(400).json({
        ok: false,
        message: 'El curso no esta disponible para compra.',
      });
    }

    const newPurchaseId = await PurchaseModel.createPurchase({
      cursoId,
      userId: user.id,
      nombreCliente: `${user.nombre} ${user.apellidos}`.trim(),
      correoCliente: user.correo,
      telefono: user.telefono,
      metodoPago,
      comprobanteUrl,
      precioPagado: course.precio,
    });

    return res.status(201).json({
      ok: true,
      message: 'Compra registrada correctamente.',
      id: newPurchaseId,
      data: {
        id: newPurchaseId,
        cursoId: course.id,
        tituloCurso: course.titulo,
        precioPagado: course.precio,
        userId: user.id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar la compra.',
      error: error.message,
    });
  }
};

const getMyPurchasedCourseIds = async (req, res) => {
  try {
    const courseIds = await PurchaseModel.getPurchasedCourseIdsByUser(req.user.id);

    return res.json({
      ok: true,
      data: courseIds,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener cursos comprados.',
      error: error.message,
    });
  }
};

const hasPurchasedCourse = async (req, res) => {
  try {
    const cursoId = Number(req.params.cursoId);

    if (!cursoId) {
      return res.status(400).json({
        ok: false,
        message: 'cursoId invalido.',
      });
    }

    const purchased = await PurchaseModel.hasUserPurchasedCourse(req.user.id, cursoId);

    return res.json({
      ok: true,
      data: {
        purchased,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al validar compra del curso.',
      error: error.message,
    });
  }
};

module.exports = {
  createPurchase,
  getMyPurchasedCourseIds,
  hasPurchasedCourse,
};