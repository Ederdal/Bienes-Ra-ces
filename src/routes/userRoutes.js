import express, { request, response } from 'express'
import { formLogin, formRegister, formPasswordRecovery, insertUser, confirmAccount, authenticateUser,changePassword, resetPassword, updatePassword,homePage } from '../controllers/usercontroller.js';
const router = express.Router();

router.get("/", formLogin)
router.get("/register", formRegister)
router.get("/password-recovery", formPasswordRecovery)
router.post("/register", insertUser)
router.get("/register",confirmAccount)

// Reset Password
router.post("/login/password-recovery", resetPassword);
// Change Password
router.get("/login/change-password/", changePassword);
router.post("/login/update-password/", updatePassword);

router.get('/', homePage);

//Autenticacion
router.post("/", authenticateUser)

export default router