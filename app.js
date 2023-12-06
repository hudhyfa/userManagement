const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')

const app = express();

app.use(bodyParser.json());

app.use("/admin",adminRoute);
app.use("/",userRoute);

app.listen(3000,()=>{
    console.log("listening on port 3000")
});