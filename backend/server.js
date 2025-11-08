if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const connectDB = require('./config/db/connectDB');
const authRoutes = require('./routes/authRoutes');

connectDB();



app.use("/api/auth", authRoutes);


app.get("/",(req,res)=>{
    res.send("home page");
});

app.listen("8080",()=>{
    console.log('server started');
})