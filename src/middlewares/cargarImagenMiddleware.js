const crypto = require("crypto");
const { NextFunction, Request, Response } = require("express");
const multer = require("multer");
const path = require("path");

const uuid = crypto.randomUUID();

// Definir el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: function (req, file, cb) {
    cb(null, uuid + file.originalname.substring(file.originalname.lastIndexOf(".")));
  },
});

// Filtrar por tipos MIME
const fileFilter = (req, file, cb) => {
  const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

  if (fileTypes.some((fileType) => fileType === file.mimetype)) {
    return cb(null, true);
  }

  return cb(null, false);
};

const maxSize = 5 * 1024 * 1024;

// Esta función permite subir una imagen y en caso de estar vacía solo subiría null
exports.subirImagen = (req, res, next) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  }).single("foto")(req, res, (err) => {
    // Éxito
    next();
  });
};

exports.actualizarImagen = (req, res, next) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  }).single("foto")(req, res, (err) => {
    // Error de tamaño de archivo
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json("Tamaño máximo de archivo permitido: 5MB");
      } else {
        return res.status(400).json("Error al subir el archivo");
      }
    }
    // Tipo de archivo no válido, el mensaje vendrá del callback fileFilter
    if (err) {
      return res.status(400).json(err.message);
    }
    // Archivo no seleccionado o formato incorrecto
    if (!req.file) {
      return res.status(400).json({
        msg: "No se ha subido ningún archivo. Recuerda que solo puedes subir formatos .jpeg, .jpg, .png y .gif.",
      });
    }
    // Éxito
    next();
  });
};
