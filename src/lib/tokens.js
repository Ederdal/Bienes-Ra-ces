import  jwt  from "jsonwebtoken";
// ! Token ID propio para creacion de ususarios y restablecer pasword
const generateID = () => Date.now().toString(32) + Math.random().toString(32).substring(3)

//! JWT Auth
const jwttoken = (userID) => jwt.sign({
    domain: process.env.JWT_DOMAIN,
    author: process.env.JWT_AUTHOR,
    siganture:process.env.JWT_SIGNATURE,
    year: process.env.JWT_YEAR,
    userID
  },process.env.JWT_HASSTRING,{
    expiresIn:"1d"
  });

  export {
    generateID,
    jwttoken
};