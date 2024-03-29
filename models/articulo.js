const { Schema, model } = require("mongoose");
const mongooseDateFormat = require("mongoose-date-format");

const validators = require("./customValidators");

const { deleteFile } = require("../services/fileHandlerServices");

const categorias = [
  "html",
  "css",
  "javascript",
  "angular",
  "vue",
  "react",
  "python",
  "php",
  "java",
  "node",
  "laravel",
  "mysql",
  "mongodb",
];

const articuloSchema = new Schema({
  titulo: {
    type: String,
    required: [true, "Titulo requerido"],
    index: true,
  },
  archivoDestacado: {
    type: String,
  },
  textoIntroductorio: {
    type: String,
    required: [true, "Texto requerido"],
    index: true,
  },
  contenido: {
    type: String,
    required: [true, "Contenido requerido"],
    index: true,
  },
  fechaBorrador: {
    type: Date,
    inmmutable: true,
    default: () => Date.now(),
    index: true,
  },
  fechaPublicacion: {
    type: Date,
    default: () => Date.now(),
    index: true,
  },
  estado: {
    type: String,
    index: true,
  },
  categorias: {
    type: [String],
    validate: validators.categorias,
    required: true,
    index: true,
  },
  usuario: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  comentarios: [{ type: Schema.Types.ObjectId, ref: "Comentarios" }],
  respuesta: {
    idArticulo: [{ type: Schema.Types.ObjectId, ref: "Articulo" }],
    titulo: { type: String },
  },
});

articuloSchema.plugin(mongooseDateFormat);

/*
 Modifica la muestra cuando retornamos el usuario como JSON no mostrando la 
 propiedad __v.
 TODO: Cambiar la propiedad _id por id?
*/
articuloSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString()
    // delete returnedObject._id
    delete returnedObject.fechaBorrador;
    delete returnedObject.__v;
  },
});

/* Funcion que actualiza el estado en funcion de la fecha que se le haya introducido */
articuloSchema.pre("save", function (next) {
  this.estado = this.fechaPublicacion > Date.now() ? "Borrador" : "Publicado";
  next();
});

articuloSchema.methods.actualizaArticulo = async function (datosActualizar) {
  const { archivoDestacado } = datosActualizar;
  await this.updateOne(datosActualizar, { runValidators: true });
  // En caso de que ya tenga una imagen éste artículo
  if (archivoDestacado && this.archivoDestacado) {
    // Borramos la imagen del directorio
    await deleteFile(this.archivoDestacado);
  }
};

articuloSchema.statics.borraArticulo = async function (
  articuloAborrar,
  usuarioPropietario
) {
  // Borramos el articulo de mongo
  await this.findByIdAndDelete(articuloAborrar.id);

  // Si el articulo tenia una imagen la eliminamos de la carpeta del usuario
  if (articuloAborrar.archivoDestacado) {
    await deleteFile(articuloAborrar.archivoDestacado);
  }

  // Obtenemos todos los articulos del usuario propietario
  // y borramos la referencia a éste
  const articulosActualizar = {
    articulos: {
      ...usuarioPropietario.articulos,
      creados: usuarioPropietario.articulos.creados.filter(
        (articuloId) => articuloId.toString() !== articuloAborrar.id
      ),
    },
  };

  // Actualizamos al usuario sin éste articulo
  await usuarioPropietario.actualizaUsuario(articulosActualizar);
};

articuloSchema.statics.search = async function (
  filtro,
  regex,
  sort,
  skip,
  limit
) {
  const query = this.find(filtro);
  query.populate("usuario", {
    nombre: 1,
    apellidos: 1,
    email: 1,
    nickname: 1,
    avatar: 1,
    articulos: 1,
    usuarios: 1,
  });
  query.or([
    { titulo: { $regex: regex } },
    { textoIntroductorio: { $regex: regex } },
    { contenido: { $regex: regex } },
  ]);
  query.sort(sort);
  query.skip(skip);
  query.limit(limit);
  return query.exec();
};

articuloSchema.statics.lista = function (filtro, sort, skip, limit) {
  const query = this.find(filtro).populate("usuario", {
    nombre: 1,
    apellidos: 1,
    email: 1,
    nickname: 1,
    avatar: 1,
    articulos: 1,
    usuarios: 1,
  });
  query.sort(sort);
  query.skip(skip);
  query.limit(limit);
  return query.exec();
};

articuloSchema.statics.findByIdPopulated = async function (id) {
  return await this.findById(id)
    .populate("usuario", {
      nombre: 1,
      apellidos: 1,
      email: 1,
      nickname: 1,
      avatar: 1,
      articulos: 1,
      usuarios: 1,
    })
    .populate("comentarios", {
      usuario: 1,
      fechaPublicacion: 1,
      contenido: 1,
      respuesta: 1,
    });
};

articuloSchema.statics.listcategories = () => {
  return categorias;
};

const Articulo = model("Articulo", articuloSchema);

module.exports = Articulo;
