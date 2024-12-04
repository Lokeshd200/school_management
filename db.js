const mySql = require ('mysql2');
const dotEnv= require ('dotenv');


const db=mySql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"school_management"
})

db.connect((err)=>{
    if (err){
        console.log(err)
    }
    console.log("MySql connected successfully!")
})
module.exports=db;
