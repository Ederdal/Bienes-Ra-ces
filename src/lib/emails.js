import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config({ path: "src/.env"})
const emailRegister = async (userData) =>{

var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});
const { name, email, token } = userData;
await transport.sendMail({
  from: "220219@utxicotepec.edu.mx",
  to: email,
  subject: "Welcome to RealState - 220219 - Confirm your account",
  html: `
  <html>
    <head>
      <style>
        /* Estilos CSS para el mensaje de correo electrónico */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 10px; /* Agrega bordes redondeados */
        }
        .header {
          background-color: #B8B8FF;
          color: #fff;
          text-align: center;
          padding: 20px;
          position: relative;
        }
        .message {
          background-color: #F8F7FF;
          padding: 20px;
        }
        .button {
          background-color: #B8B8FF;
          color: #fff;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          border-radius: 5px;
        }
        .signature {
          background-color: #F4F4F4;
          padding: 20px;
          border-top: 1px solid #ccc;
        }
        .social-icons {
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .social-icons img {
          width: 30px;
          height: auto;
          margin-left: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to RealState</h1>
          <div class="social-icons">
            <img src="https://www.freepnglogos.com/uploads/facebook-logo-png-3.png" alt="Facebook ">
            <img src="https://th.bing.com/th/id/R.7d0c2ee1d8d13c929f59cb413ffbabcc?rik=EN8tUUzm0MBKsA&pid=ImgRaw&r=0" alt="Instagaram">
            <img src="https://uploads-ssl.webflow.com/62616de606bfbbf506438d52/627d1e67f926425858f195fd_twitterpsd.png" alt="Red Twitter">
          </div>
        </div>
        <div class="message">
          <p>Hello, ${name}, you are verifying your account on RealState.com.</p>
          <p>Your account is almost active. Please follow the activation link below:</p>
          <p>
            <a class="button" href="https://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/BIENES-RAICES-220219/login/login/confirm/${token}">Click Here to Activate Your Account</a>
          </p>
          <p>If you didn't create this account, just ignore this email.</p>
          <img src="https://www.altonivel.com.mx/assets/images/Estructura_2015/Estilo_de_vida/Imagen/firma-izquierda.jpg" alt="Descripción de la imagen" style="max-width: 100px; height: 100;">
        </div>
      </div>
    </body>
  </html>
`,
});




console.log(`##### mailTrap #### \n
Se está intentando enviar un correo electronico al usuario ${email}, con el token de validación: ${token} \n ################ `)

}
export {
    emailRegister
}