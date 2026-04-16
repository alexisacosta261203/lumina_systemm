const pool = require('../config/db');

const getAllCourses = async () => {
  const [rows] = await pool.execute(
    `SELECT 
      id,
      titulo,
      descripcion,
      imagen_url AS imagenUrl,
      precio,
      categoria,
      duracion_horas AS duracionHoras,
      nivel,
      activo
     FROM cursos
     ORDER BY id ASC`
  );

  return rows;
};

const getCourseById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT 
      id,
      titulo,
      descripcion,
      imagen_url AS imagenUrl,
      precio,
      categoria,
      duracion_horas AS duracionHoras,
      nivel,
      activo
     FROM cursos
     WHERE id = ?`,
    [id]
  );

  return rows[0];
};

const createCourse = async (courseData) => {
  const {
    titulo,
    descripcion,
    imagenUrl,
    precio,
    categoria,
    duracionHoras,
    nivel,
    activo,
  } = courseData;

  const [result] = await pool.execute(
    `INSERT INTO cursos
      (titulo, descripcion, imagen_url, precio, categoria, duracion_horas, nivel, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      titulo,
      descripcion,
      imagenUrl,
      precio,
      categoria,
      duracionHoras,
      nivel,
      activo ? 1 : 0,
    ]
  );

  return result.insertId;
};

const updateCourse = async (id, courseData) => {
  const {
    titulo,
    descripcion,
    imagenUrl,
    precio,
    categoria,
    duracionHoras,
    nivel,
    activo,
  } = courseData;

  const [result] = await pool.execute(
    `UPDATE cursos
     SET titulo = ?, descripcion = ?, imagen_url = ?, precio = ?, categoria = ?, duracion_horas = ?, nivel = ?, activo = ?
     WHERE id = ?`,
    [
      titulo,
      descripcion,
      imagenUrl,
      precio,
      categoria,
      duracionHoras,
      nivel,
      activo ? 1 : 0,
      id,
    ]
  );

  return result.affectedRows;
};

const deleteCourse = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM cursos WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};