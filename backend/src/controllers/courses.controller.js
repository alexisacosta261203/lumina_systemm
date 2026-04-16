const CourseModel = require('../models/course.model');

const getCourses = async (req, res) => {
  try {
    const courses = await CourseModel.getAllCourses();
    res.json({
      ok: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener cursos.',
      error: error.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const course = await CourseModel.getCourseById(id);

    if (!course) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado.',
      });
    }

    res.json({
      ok: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el curso.',
      error: error.message,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const newId = await CourseModel.createCourse(req.body);

    res.status(201).json({
      ok: true,
      message: 'Curso creado correctamente.',
      id: newId,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al crear curso.',
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const affectedRows = await CourseModel.updateCourse(id, req.body);

    if (!affectedRows) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado para actualizar.',
      });
    }

    res.json({
      ok: true,
      message: 'Curso actualizado correctamente.',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar curso.',
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const affectedRows = await CourseModel.deleteCourse(id);

    if (!affectedRows) {
      return res.status(404).json({
        ok: false,
        message: 'Curso no encontrado para eliminar.',
      });
    }

    res.json({
      ok: true,
      message: 'Curso eliminado correctamente.',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar curso.',
      error: error.message,
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};