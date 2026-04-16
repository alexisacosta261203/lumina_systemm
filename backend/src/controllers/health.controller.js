const getHealthStatus = (req, res) => {
  res.json({
    ok: true,
    message: 'API de prueba funcionando correctamente.',
    project: 'Lumina System',
  });
};

module.exports = {
  getHealthStatus,
};