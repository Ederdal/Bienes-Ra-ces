// common js

//Importa la libreria de Express para iniciar la comunicacion con el portocolo HTTP
import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './config/db.js';
import usuario from './models/User.js'
import cookieParser from 'cookie-parser';
import { homePage } from './controllers/usercontroller.js';
import propertyRoutes from './routes/propertyRoutes.js';
import dotenv from 'dotenv';
dotenv.config({ path: "src/.env" }); // Carga variables de entorno desde un archivo .env ubicado en la ruta "src/.env".

//Instanciamos el modulo express de la libreria para definir el servidor que atendera las peticiones 
const app = express();


try {
    await  db.authenticate();
    await  db.sync();
    console.log("Conexión a la Base de Datos exitosa ")
} catch (error) {
    console.log(error)
    
}

app.set('view engine', 'pug')
app.set('views','./src/views')

//Definir carpeta para recursos publicos
app.use(express.static('./src/public'))
app.use(express.urlencoded({extended:true}))//permitimos la lectura de datos a traves de los elementos HTML
// cookie-parser
app.use(cookieParser());

app.listen(process.env.SERVER_PORT,(request,response)=> console.log(`El servidor WEB ha sido iniciado y esta esperando solicitudes(requests)\nActualmente se encuentra escuchando a traves del puerto: ${process.env.SERVER_PORT}`));

app.use('/',generalRoutes);
app.use('/login',userRoutes);
app.use('/home',homePage);
app.use('/property', propertyRoutes)
