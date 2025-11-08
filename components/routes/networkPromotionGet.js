const express = require("express");
const Router = express.Router();
const promotionController = require("../controllers/promotionController");
const response = require("../response/response");

Router.get("/", (req,res)=>{
res.send("hola mundo")
}
);



module.exports = Router;
