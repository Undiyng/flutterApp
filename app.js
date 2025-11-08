const express = require("express");
var admin = require("firebase-admin");
const firebaseKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const body_parser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3000;
const mongoURI = "mongodb+srv://admin:1234@datacluster.8uusbnx.mongodb.net/?appName=DataCluster";
const Router = require("./components/routes/routes");

mongoose.connect(mongoURI)
  .then(() => console.log('¡Conexión a MongoDB exitosa!'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

const app = express();
app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

if (firebaseKeyString) {
    try {
        const serviceAccount = JSON.parse(firebaseKeyString);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("🔥 Firebase Admin SDK inicializado.");
    } catch (e) {
        console.error("❌ Error al inicializar Firebase:", e);
        throw new Error("Configuración de Firebase inválida.");
    }
} else {
    console.error("🛑 ERROR CRÍTICO: La variable FIREBASE_SERVICE_ACCOUNT_KEY no está definida.");
    throw new Error("Falta la Variable de Entorno de Firebase.");
}

// ✅ Configuración MEJORADA para Vercel
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
const baseURL = isVercel 
  ? 'https://flutter-app-self.vercel.app' 
  : `http://localhost:${PORT}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de mi App Flutter (Express)',
      version: '1.0.0',
      description: 'Documentación de los endpoints del backend.',
    },
    servers: [
      {
        url: baseURL,
        description: isVercel ? 'Servidor de Producción' : 'Servidor Local',
      },
    ],
  },
  apis: [
    path.join(__dirname, 'components/routes/*.js'), // ✅ Rutas absolutas
    path.join(__dirname, 'components/routes/networkPromotionPost.js'),
    path.join(__dirname, 'app.js')
  ],
};

// ✅ MONTAR RUTAS PRIMERO para que Swagger las detecte
Router(app);

const swaggerSpec = swaggerJsdoc(options);

// ✅ DEBUG: Verificar qué encontró Swagger
console.log('🔍 Swagger Paths encontrados:', Object.keys(swaggerSpec.paths || {}));

// ✅ Configuración robusta de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// ✅ Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    environment: isVercel ? 'production' : 'development'
  });
});

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    docs: `${baseURL}/api-docs`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📚 Swagger UI: ${baseURL}/api-docs`);
});

// ✅ EXPORT para Vercel (CRÍTICO)
module.exports = app;