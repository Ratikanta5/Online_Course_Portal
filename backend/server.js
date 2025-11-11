if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const connectDB = require('./config/db/connectDB');
const authRoutes = require('./routes/authRoutes');

connectDB();



app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);


app.get("/",(req,res)=>{
    res.send("home page");
});


//error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;

  return res
    .status(statusCode)
    .json({ success: false, message });
});



app.listen("8080",()=>{
    console.log('server started');
})





