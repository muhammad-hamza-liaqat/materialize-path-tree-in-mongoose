const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const materialRoute = require("./routes/materializepath.route");

// middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// require database connection
require("./database/database.connection")

// routes 
app.use("/api", materialRoute);


app.listen(process.env.PORT, ()=>{
    console.log(`server in running at localhost://${process.env.PORT}:`);
})