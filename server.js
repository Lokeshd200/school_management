const express = require ('express');
const mySql = require ('mysql2');
const bodyParser = require ('body-parser');
const dotEnv = require ('dotenv');
const db = require('./db')
const schoolRoutes = require ('./routes/school')

dotEnv.config();
const app=express();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use('/api',schoolRoutes)
app.use(express.json())

app.listen(PORT,(err)=>{
    if (err){
        console.log(err.message)
    }
    console.log("listening....")
})
