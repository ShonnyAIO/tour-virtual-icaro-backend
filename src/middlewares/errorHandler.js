const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      message: 'Validation Failed',
      details: err.details.map(detail => detail.message)
    });
  }

  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large.' });
  }
  if (err.message === 'Invalid file type. Only JPG, PNG, and WEBP are allowed.') {
    return res.status(400).json({ message: err.message });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Conflict: Resource already exists.',
      details: err.errors.map(e => e.message)
    });
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json({
    message: err.message || 'An unexpected error occurred on the server.'
  });
};

module.exports = errorHandler;
