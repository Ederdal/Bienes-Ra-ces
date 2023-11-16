// Importación de módulos
import Sequelize from "sequelize"; // Importa la biblioteca Sequelize para trabajar con bases de datos SQL.
import dotenv from "dotenv"; // Importa el módulo dotenv para cargar variables de entorno desde un archivo .env.

// Configuración de las variables de entorno
dotenv.config({ path: "src/.env" }); // Carga variables de entorno desde un archivo .env ubicado en la ruta "src/.env".

// Creación de una instancia Sequelize
const db = new Sequelize(
  process.env.BD_NAME,        // Nombre de la base de datos obtenido desde las variables de entorno.
  process.env.BD_USER,        // Nombre de usuario de la base de datos obtenido desde las variables de entorno.
  process.env.BD_PASSWORD,    // Contraseña de la base de datos obtenida desde las variables de entorno.
  {
    // Configuración de la conexión a la base de datos
    host: process.env.BD_HOST, // Dirección del servidor de la base de datos obtenida desde las variables de entorno.
    port: "3309",              // Puerto del servidor de la base de datos (en este caso, 3309).
    dialect: "mysql",         // Tipo de base de datos que se está utilizando (MySQL en este caso).
    timezone: "America/Mexico_City", // Zona horaria utilizada para la base de datos.
    define: {
      timestamps: true,       // Habilita las marcas de tiempo (timestamps) en los modelos de datos.
    },
    pool: {
      max: 5,                 // Número máximo de conexiones en el grupo de conexiones.
      min: 0,                 // Número mínimo de conexiones en el grupo de conexiones.
      acquire: 30000,         // Tiempo máximo (en milisegundos) para adquirir una conexión.
      idle: 10000,            // Tiempo máximo (en milisegundos) que una conexión puede estar inactiva antes de ser liberada.
      operatorAliases: false, // Deshabilita los alias de operadores en Sequelize.
    },
  }
);

// Exportación de la instancia Sequelize
export default db; // Exporta la instancia 'db' para su uso en otros módulos de la aplicación.
