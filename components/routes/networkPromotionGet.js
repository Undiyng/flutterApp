const express = require("express");
const Router = express.Router();
const promotionController = require("../controllers/promotionController");
const response = require("../response/response");

Router.get("/", async (req, res) => {
  promotionController
    .listPromotions()
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((error) => {
      response.failure(req, res, error, 400);
    });
});



module.exports = Router;
