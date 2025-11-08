const express = require("express");
const Router = express.Router();
const promotionController = require("../controllers/promotionController");
const response = require("../response/response");

/**
 * @swagger
 * /postPromotion:
 *   post:
 *     summary: Crear una nueva promoción
 *     description: Endpoint para crear una nueva promoción en el sistema
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - start_date
 *               - end_date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la promoción
 *                 example: "Promoción de Verano 2024"
 *               body:
 *                 type: string
 *                 description: Descripción detallada de la promoción
 *                 example: "Descuento del 20% en todos los productos de temporada"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la promoción (YYYY-MM-DD)
 *                 example: "2024-06-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin de la promoción (YYYY-MM-DD)
 *                 example: "2024-06-30"
 *     responses:
 *       201:
 *         description: Promoción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Promoción creada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "Promoción de Verano 2024"
 *                     body:
 *                       type: string
 *                       example: "Descuento del 20% en todos los productos de temporada"
 *                     start_date:
 *                       type: string
 *                       example: "2024-06-01"
 *                     end_date:
 *                       type: string
 *                       example: "2024-06-30"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todos los campos son requeridos"
 *                 error:
 *                   type: string
 *                   example: "Faltan campos requeridos: title, body"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 error:
 *                   type: string
 *                   example: "Error al conectar con la base de datos"
 */
Router.post("/", (req, res) => {
 
  promotionController
    .addPromotion(req.body)
    .then((data) => {
      const responseData = {
        success: true,
        message: "Promoción creada exitosamente",
        data: data
      };
      // Usa response.success para enviar la respuesta envuelta
      response.success(req, res, responseData, 201);
    })
    .catch((error) => {
       const errorResponse = {
        success: false,
        message: "Error al crear la promoción",
        error: error.message
      };
      response.failure(req, res, errorResponse, 500);
    });
});


module.exports = Router;
