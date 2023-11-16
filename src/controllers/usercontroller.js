import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt"; // Añade la importación de bcrypt si no está importado
import { check, validationResult } from "express-validator";
import { generateID, jwttoken } from "../lib/tokens.js";
import { emailRegister } from "../lib/emails.js";
import { response } from "express";
import { render } from "pug";

dotenv.config({ path: "src/.env" });

const formLogin = (request, response) => {
  response.render("auth/login", {
    showHeader:false,
    page: "Login",
  });
};

const formRegister = (request, response) => {
  response.render("auth/register", {
    page: "Create your account",
  });
};

const formPasswordRecovery = (request, response) => {
  response.render("auth/password-recovery.pug", {
    page: "Password-Recovery",
  });
};

const message = (request, response) => {
  const email = request.body.email;
  response.render("templates/message.pug", {
    page: "User Created Successful",
    message: `We will send you an email to: ${email}, please verify your account.`,
  });
};

const insertUser = async (request, response) => {
  console.log("El usuario está intentando registrar sus datos en la base de datos");
  console.log(`Nombre: ${request.body.name}`);
  // Validaciones
  await check("name").notEmpty().withMessage("This field is required -NAME-").run(request);
  await check("email").notEmpty().withMessage("This field is required -EMAIL-").isEmail().withMessage("The value must be in the format user@domain.ext").run(request);

  // Validación del mínimo y máximo de caracteres
  await check("password").notEmpty().withMessage("This field is required -password-").isLength({ min: 8 }).withMessage("Password must contain at least 8 characters").isLength({ max: 20 }).withMessage("Password must contain less than 20 characters").equals(request.body.password).withMessage("Both passwords must be the same").run(request);

  let resultadoValidacion = validationResult(request);

  // Validar correo electrónico duplicado
  if (resultadoValidacion.isEmpty()) {
    const { name, email, password } = request.body;
    const token = generateID();
    console.log(`Intentando insertar al usuario: ${name}, con correo electrónico: ${email}, password: ${password} y token: ${token}`);

    const userExists = await User.findOne({ where: { email: email } });

    console.log(userExists);
    if (userExists) {
      return response.render("auth/register.pug", {
        page: "Creating New Account",
        errors: [{ msg: `The user with ${email} already exists.` }],
        user: {
          name: request.body.name,
          email: request.body.email,
        },
      });
    } else {
      const newUser = await User.create({
        name,
        email,
        password,
        token,
      });

      // Enviar correo de confirmación
      emailRegister({
        name,
        email,
        token,
      });

      // Respuesta cuando se crea el usuario
      response.render('templates/message.pug', {
        page: "User Created Successful",
        message: `We have sent you an Email to: <span style="color: #B8B8FF;">${email}</span>, please verify your account.`,
      });      
    }
  } else {
    return response.render("auth/register.pug", {
      page: "Creating New Account",
      errors: resultadoValidacion.array(),
      user: {
        name: request.body.name,
        email: request.body.email,
      },
    });
  }
};

const confirmAccount = async (request, response, next) => {
  const { token } = request.params;
  let userToken = await User.findOne({ where: { token } });

  if (!userToken) {
    console.log("Este token no es válido");
    response.render("templates/message", {
      page: "Error: Invalidation process",
      notificationTitle: "The token is invalid",
      notificationMessage: "The token is invalid",
      type: "Error",
    });
  } else {
    console.log("Este token es válido");
    userToken.verified = true;
    userToken.token = ""; // Eliminar el token.
    await userToken.save();

    response.render("templates/message.pug", {
      page: "Successful",
      notificationTitle: "Your account has been confirmed",
      message: "Your account has been confirmed",
      type: "Information",
    });
  }
};

const resetPassword = async (request, response) => {
  await check('email').notEmpty().withMessage('Email field is required').isEmail().withMessage('The Email field should be an Email (user@domain.ext) and not empty').run(request);
  let result = validationResult(request);
  const { email } = request.body;
  const userExists = await User.findOne({ where: { email } });

  if (result.isEmpty()) {
    if (!userExists) {
      console.log(`El usuario con correo ${email}`);
      response.render('templates/message.pug', {
        page: "Recovery Password",
        notificationTitle: `Error Email not Found`,
        notificationMessage: "The token is invalid",
        type: "Error",
      });
    } else {
      const tokenPassword = generateID();
      userExists.token = tokenPassword;
      await userExists.save();

      resetPassword({
        email,
        tokenPassword,
      });
      console.log(`El usuario con correo ${email}`);
      response.render('templates/message.pug', {
        page: "Recovery Password",
        notificationTitle: `Email Found`,
        notificationMessage: "The token is invalid",
        type: "Info",
      });
    }
  } else {
    return response.render("auth/password-recovery.pug", {
      page: "Recovery Password",
      errors: result.array(),
      user: {
        email: request.body.email,
      },
    });
  }
};

const changePassword = async (request, response) => {
  const { tokenPassword } = request.params;
  let userToken = await User.findOne({ where: { token: tokenPassword }});
  if (!userToken) {
    console.log(`This token is invalid`);
    response.render('templates/message.pug', {
      page: "Error in Validation Process",
      notificationTitle: "The token is invalid",
      notificationMessage: "The token is invalid",
      type: "Warning",
    });
  } else {
    response.render("auth/password-change.pug", {
      page: "Change Password",
      tokenPassword: tokenPassword,
    });
  }
};

const updatePassword = async (request, response) => {
  const { tokenPassword } = request.params;
  const { newPassword } = request.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  let userToken = await User.findOne({ where: { token: tokenPassword } });
  if (!userToken) {
    console.log(`This token is invalid`);
    response.render('templates/message.pug', {
      page: "Error in Validation Process",
      notificationTitle: "The token is invalid",
      notificationMessage: "The token is invalid",
      type: "Warning",
    });
  } else {
    console.log(`Intentando actualizar la contraseña en la bd`);
    userToken.token = null;
    userToken.password = hashedPassword;
    await userToken.save();
    response.render('templates/message.pug', {
      page: "Password Updated",
      notificationTitle: "Change Password Success",
      notificationMessage: "The password has been updated",
      type: "Info",
    });
  }
};

// Autenticar usuario
const authenticateUser = async (request, response) => {
  await check('email').notEmpty().withMessage('Email field is required').isEmail().withMessage('The Email field should be an Email (user@domain.ext) and not empty').run(request);
  await check('password').notEmpty().withMessage('Password field is required').isLength({
    min: 8,
    max: 20
  }).withMessage('The password is formed between 8 and 20 characters').run(request);
  const { email, password } = request.body;
  let result = validationResult(request);
  console.log(`El usuario: ${email} está intentando autenticarse`);

  if (result.isEmpty()) {
    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      response.render('templates/message.pug', {
        page: "Error in Login",
        notificationTitle: `Error Email not Found`,
        notificationMessage: `The user with email: ${email} does not exist.`,
        type: "Error",
      });
    } else {
      if (!userExists.verified) {
        console.log(`El usuario con correo ${email}`);
        response.render('templates/message.pug', {
          page: "Error in login",
          notificationTitle: `Account is not validated`,
          notificationMessage: `The user associated with the email: ${email} is not verified, please check your email.`,
          type: "Warning",
        });
      } else {
        const isPasswordValid = await bcrypt.compare(password, userExists.password);

        if (isPasswordValid) {
          const token = jwttoken(userExists.id);
          console.log(`JWT generado es ${token}`);

          response.cookie('_token', token,{
            httpOnly: true,

          }).redirect('/home');


        } else {
          response.render("auth/login.pug", {
            page: "Login",
            errors: [{
              msg: "The email or password doesn't match.",
            }],
            user: {
              email: request.body.email,
            },
          });
        }
      }
    }
  } else {
    return response.render("auth/login.pug", {
      page: "Login",
      errors: result.array(),
      user: {
        email: request.body.email,
      },
    });
  }
};

const homePage=(request, response)=>{
  response.render('user/home',{
    showHeader: true,
    user:{
      page:"My Properties",
      name:"Edgar"
    }
  })};



export {
  formLogin,
  formRegister,
  formPasswordRecovery,
  message,
  insertUser,
  authenticateUser,
  changePassword,
  resetPassword,
  updatePassword,
  confirmAccount,
  homePage
};
