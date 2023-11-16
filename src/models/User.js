import { DataTypes } from "sequelize"; // Elemento del ORM que permite definir los tipos de datos de las columnas del "OBJETO"
import db from '../config/db.js';
import bcrypt from "bcrypt";
const User= db.define("tbb_users",
{
    name:{
        type: DataTypes.STRING(255),
        // indica que es obligatorio 
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(255),
        allowNull:false,
        unique:true
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    token: {
        type: DataTypes.STRING,
         unique: true   
        },// token: al no definir el que es obligatorio, lo toma como opcional 
        verified: {
        type:DataTypes.BOOLEAN, 
        defaultValue: true
    }},
    {
        hooks:{
            beforeCreate: async(User)=>{
                const salt = await bcrypt.genSalt(10);
                User.password=await bcrypt.hash(User.password, salt) ;
                
            }

        }
    }
);
 // compara contraseñas por medio del hasing 
User.prototype.verifiedPassword=(password)=>{
return bcrypt.compareSync(password,this.password);
}
 
export default User
