# Bootcamp Full Stack Web Developer #


## Proyecto Final: "El último y me voy" - Backend

### EL ÚLTIMO Y ME VOY

Backend del proyecto final...

## Equipo

[![](https://contrib.rocks/image?repo=proyectojotazo/backend-proyecto-final)](https://github.com/proyectojotazo/backend-proyecto-final/graphs/contributors)

## Instrucciones

#### Instalar dependencias:

Antes de nada debemos usar el siguiente comando para instalar todas las dependencias del proyecto:

    npm install

#### Configurar variables de entorno:

Para configurar las variables de entorno, deberemos crear un archivo `.env` en la raíz del proyecto y añadir las variables de entorno proporcionadas en el archivo `.example.env`, con los valores que queramos usar.

#### Añadir fichero .npmrc (sólo en Windows)

Si se usa Windows, deberemos crear el archivo `.npmrc` en la carpeta raíz del proyecto y dentro incluir la siguiente línea:

    	script-shell = "C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
> Con esa línea le estaríamos pasando la ruta por defecto de PowerShell en Windows, para que pueda ejecutar correctamente los scripts incluidos en el `package.json`.

#### Iniciar en modo desarrollo:

Para arrancar el proyecto en modo desarrollo, usar el comando:

    npm run dev

> Esto nos iniciará el proyecto con "nodemon", por lo que podremos realizar cambios y que estos se apliquen, estando el servidor arrancado.

## Rutas del API

![](https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.svg)

El API dispone de una documentación a través de Swagger, para poder probar todos los endpoints disponibles. La ruta de acceso al Swagger del API es la siguiente:

    	http://localhost:3001/swagger

### GET:

**- Usuarios -**

Mostrar usuario por su Nickname:

    	http://localhost:3001/users/<nickName>
> Esta petición se puede realizar indicando el nick del usuario en mayúscula o minúscula. La búsqueda se hará en minúscula indistintamente, ya que así es como se almacena en la base de datos.

**- Artículos -**

Mostrar todos los artículos:

    	http://localhost:3001/articles

Mostrar artículo por ID:

    	http://localhost:3001/articles/<IdArticulo>

Para mostrar los resultados de los artículos en orden "ascendente" o "descendente", se le puede aplicar la condición a la url, según el campo que queramos tener en cuenta para ordenar. 

Por ejemplo:

Orden Ascendente - Muestra artículos por fecha de publicación ascendente (antiguos primero):

    	http://localhost:3001/articles?sort=fechaPublicacion

Orden Descendente - Muestra artículos por fecha de publicación descendente (nuevos primero):

    	http://localhost:3001/articles?sort=-fechaPublicacion

**- Comentarios -**

Mostrar comentario por ID:

    	http://localhost:3001/comment/<idComentario>

### POST:

**- Usuarios -**

Registrar un usuario:

    	http://localhost:3001/register
Iniciar sesión con usuario:

    	http://localhost:3001/login
> Esta petición nos devolverá un token para poder hacer futuras peticiones.

Restablecer contraseña:

    	http://localhost:3001/password-reset
> Se debe enviar un objeto en el "body" con la clave "email" y como valor el email del usuario.

> Si existe un usuario con ese email, se enviará un correo electrónico a la dirección del usuario, con un link que tendrá la petición para cambiar su contraseña por una nueva. El link tendrá la siguiente estructura:

> **http://localhost:3001/password-reset/IdUsuario/TokenTemporalGenerado**

> Para enviar la petición generada al API, se deberá añadir un objeto en el "body" con la clave "password" y como valor la nueva contraseña, para que pueda ser modificada correctamente.

Seguir a un usuario:

    	http://localhost:3001/users/follow/<nickNameOrEmail>
> Puedes seguir a un usuario añadiendo a la ruta su "nickname" o "email".

> Esta petición necesita el header "Authorization" con el valor `Bearer <token>`

Dejar de seguir a un usuario:

    	http://localhost:3001/users/unfollow/<nickNameOrEmail>
> Puedes dejar de seguir a un usuario añadiendo a la ruta su "nickname" o "email".

> Esta petición necesita el header "Authorization" con el valor `Bearer <token>`

Añadir o eliminar un artículo de favoritos:

    	http://localhost:3001/users/articles/favourites/<idArticulo>
> Puedes añadir o eliminar artículos favoritos a un usuario autenticado, incluyendo el id del artículo en la ruta. Al hacer la petición si el artículo no esta en tus artículos favoritos, lo añade, si no eliminará el artículo de favoritos con la misma petición.

> Esta petición necesita el header "Authorization" con el valor `Bearer <token>`

**- Artículos -**

Crear un artículo:

    	http://localhost:3001/articles
> Para poder crear un artículo será necesario incluir el valor `Bearer <token>`, en la cabecera "Authorization".

> Será necesario incluir un "body" con al menos los siguientes campos requeridos: "titulo", "textoIntroductorio" y "contenido".

Crear un nuevo artículo en respuesta a otro artículo:

    	http://localhost:3001/articles/response/{idArticulo}
> Funciona igual que "Crear un artículo", sólo hay que añadir a la ruta el id del artículo existente del que se quiera crear la respuesta.

> Al realizar la petición se añadirá automáticamente el id y título del artículo del que se crea la respuesta a la base de datos.

**- Comentarios -**

Añadir un comentario a un artículo:

    	http://localhost:3001/comment/<idArticulo>

Responder a un comentario de un artículo:

    	http://localhost:3001/comment/response/<idComentario>
> Para realizar ambas peticiones será necesario incluir el valor `Bearer <token>`, en la cabecera "Authorization".

### PATCH:

**- Usuarios -**

Actualizar un usuario (estando autenticado):

    	http://localhost:3001/users/<IdUsuario>
> Al usar PATCH, sólo será necesario enviar un "body" con los campos que quieran actualizarse y no todos los campos.

> Para poder actualizar un usuario, se necesitará incluir el valor `Bearer <token>` del usuario que creó el usuario a modificar, en la cabecera "Authorization". Si se intentara actualizar un usuario con un token válido, perteneciente a otro usuario, devolvería un error.

> Si el usuario no existe, también devolverá un error.

**- Artículos -**

Actualizar un artículo:

    	http://localhost:3001/articles/<IdArticulo>
> Al usar PATCH, sólo será necesario enviar un "body" con los campos que quieran actualizarse y no todos los campos.

> Para poder actualizar un artículo, se necesitará incluir el valor `Bearer <token>` del usuario creador de ese artículo, en la cabecera "Authorization". Si se intentara actualizar un artículo con un token válido, perteneciente a otro usuario, devolvería un error.

> Si el artículo no existe, también devolverá un error.

### DELETE:

**- Usuarios -**

Eliminar un usuario (y los anuncios que hubiese creado):

    	http://localhost:3001/users/<IdUsuario>
> Para poder eliminar un usuario será necesario incluir el valor `Bearer <token>` del usuario correspondiente en la cabecera "Authorization". Si se intentara eliminar un usuario con un token válido, perteneciente a otro usuario, devolvería un error.

> Se eliminará toda la información del usuario en la base de datos, incluidos los artículos que ese usuario hubiese creado.

**- Artículos -**

Eliminar un artículo:

    	http://localhost:3001/articles/<IdArticulo>
> Para poder eliminar un artículo, se necesitará incluir el valor `Bearer <token>` del usuario creador de ese artículo, en la cabecera "Authorization". Si se intentara eliminar un artículo con un token válido, perteneciente a otro usuario, devolvería un error.

