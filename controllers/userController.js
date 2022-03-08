const asyncHandler = require("express-async-handler");

const { Usuario } = require("../models");
const { getFollowData, getArticuloSeguidoData, deleteF } = require("../utils");
const { deleteFileOfPath, deleteFolderUser } = deleteF;

const userController = {};

/* GET - Controllers */
userController.getUsuario = asyncHandler(async (req, res, next) => {
  const { nickname } = req.params;

  const usuario = await Usuario.findOnePopulated(nickname);

  return res.status(302).json(usuario);
});

/* POST - Controllers */
userController.followUsuario = asyncHandler(async (req, res) => {
  const { id: userIdDestino } = req.params;
  const userIdRemitente = req.userId;

  const usuarioDestino = await Usuario.findById(userIdDestino);
  const usuarioRemitente = await Usuario.findById(userIdRemitente);

  const { dataToRemitente, dataToDestino } = getFollowData(
    usuarioDestino,
    usuarioRemitente
  );

  // Actualizamos el usuario remitente y añadimos que sigue a esa persona
  await usuarioRemitente.actualizaUsuario(dataToRemitente);

  // Actualizamos el usuario destino y le añadimos el seguidor que le sigue
  await usuarioDestino.actualizaUsuario(dataToDestino);

  return res.status(204).end();
});

userController.articulosFavorito = asyncHandler(async (req, res, next) => {
  // obtenemos el id
  const { id } = req.params;
  // obtener id de usuario del token
  const usuarioId = req.userId;

  const usuario = await Usuario.findById(usuarioId);

  const articulofavorito = getArticuloSeguidoData(id, usuario);

  await usuario.actualizaUsuario(articulofavorito);

  return res.status(204).end();
});

/* PATCH - Controllers */
// TODO: Mirar implementacion de deletefile en errorhandler
userController.updateUsuario = async (req, res, next) => {
  // obtenemos id del usuario a actualizar
  const { id } = req.params;

  // datos a actualizar
  const datosActualizar = {
    ...req.body,
    avatar: req.file?.path, // Si se envia avatar, se guarda el path
  };
  
  try {
    // buscamos al usuario
    const usuario = await Usuario.findById(id);

    await usuario.actualizaUsuario(datosActualizar);

    // Al no enviar información simplemente enviaremos .end()
    return res.status(204).end();
  } catch (error) {
    if (req.file) deleteFileOfPath(datosActualizar.avatar);
    return next(error);
  }
};

/* DELETE - Controllers */
userController.borrarUsuario = asyncHandler(async (req, res, next) => {
  // obtendremos el id
  const { id } = req.params;

  // buscamos al usuario
  const usuario = await Usuario.findById(id);

  await Usuario.deleteAllData(usuario);

  deleteFolderUser(id);

  // Al no enviar información simplemente enviaremos .end()
  return res.status(204).end();
});

module.exports = userController;
