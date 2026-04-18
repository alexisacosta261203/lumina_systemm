const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const register = async (req, res) => {
  try {
    const { nombre, apellidos, correo, telefono, password, confirmPassword } = req.body;

    if (!nombre || !apellidos || !correo || !telefono || !password || !confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos son obligatorios.',
      });
    }

    if (telefono.length !== 10 || !/^\d{10}$/.test(telefono)) {
      return res.status(400).json({
        ok: false,
        message: 'El telefono debe tener exactamente 10 digitos.',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({
        ok: false,
        message: 'El correo no tiene un formato valido.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña debe tener al menos 8 caracteres.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Las contraseñas no coinciden.',
      });
    }

    const existingUser = await UserModel.findUserByEmail(correo);

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un usuario con ese correo.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUserId = await UserModel.createUser({
      nombre,
      apellidos,
      correo,
      telefono,
      passwordHash,
      role: 'user',
    });

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente.',
      id: newUserId,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al registrar usuario.',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Correo y contraseña son obligatorios.',
      });
    }

    const user = await UserModel.findUserByEmail(correo);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas.',
      });
    }

    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        message: 'La cuenta esta inactiva.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas.',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        correo: user.correo,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      message: 'Inicio de sesion correcto.',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        telefono: user.telefono,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesion.',
      error: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await UserModel.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el perfil.',
      error: error.message,
    });
  }
};

const confirmAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña es obligatoria.',
      });
    }

    const user = await UserModel.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        ok: false,
        message: 'Acceso solo para administradores.',
      });
    }

    const fullUser = await UserModel.findUserByEmail(req.user.correo);

    const passwordMatch = await bcrypt.compare(password, fullUser.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: 'La contraseña de administrador no es correcta.',
      });
    }

    return res.json({
      ok: true,
      message: 'Contraseña de administrador confirmada.',
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al confirmar la contraseña del administrador.',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  me,
  confirmAdminPassword,
};