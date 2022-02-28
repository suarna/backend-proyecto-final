// const multer = require("multer");
// const upload = multer();
const upload = require("../lib/multerConfig");
const articulosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

/* GET */
articulosRouter.get("/categories", articulosController.getCategorias);

articulosRouter.get("/", articulosController.getArticulos);

articulosRouter.get("/:id", articulosController.getArticulo);



/* PATCH */
articulosRouter.patch(
  "/:id",
  jwtAuth,
  upload.single("archivoDestacado"),
  articulosController.actualizarArticulo
);

/* DELETE */
articulosRouter.delete("/:id", jwtAuth, articulosController.borraArticulo);

/* POST */
articulosRouter.post(
  "/",
  jwtAuth,
  upload.single("archivoDestacado"),
  articulosController.creaArticulo
);

articulosRouter.post(
  "/response/:id",
  jwtAuth,
  upload.single("archivoDestacado"),
  articulosController.respuestaArticulo
);

module.exports = articulosRouter;
