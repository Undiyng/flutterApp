const express = require("express");
const Router = express.Router();
const promotionController = require("../controllers/promotionController");
const response = require("../response/response");

Router.post("/", (req, res) => {
  promotionController
    .addPromotion(req.body)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch((error) => {
      response.failure(req, res, error, 500);
    });
});
module.exports = Router;
