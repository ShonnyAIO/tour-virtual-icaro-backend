/**
 * @description Handles the response after a file is uploaded by middleware.
 */
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded. Make sure the form field name is \'panorama\'.' });
  }

  res.status(200).json({
    message: "Archivo subido exitosamente",
    url: req.file.location // 'location' is provided by multer-s3
  });
};
