const registerRouter = require("express").Router();

const { Usuario } = require("../models");

registerRouter.post("/", async (req, res, next) => {
  try {
    const nuevoUsuario = new Usuario({
      ...req.body,
    });

    await nuevoUsuario.save();

    return res.status(201).json({
      created: "ok",
      status: 201,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = registerRouter;