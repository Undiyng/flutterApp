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
    }
}

// Configuración para Vercel
const isVercel = process.env.VERCEL;
const baseURL = isVercel 
  ? 'https://flutter-app-self.vercel.app' 
  : `http://localhost:${PORT}`;

// ✅ SOLUCIÓN ALTERNATIVA: Generar spec estáticamente primero
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de mi App Flutter',
      version: '1.0.0',
      description: 'Documentación de endpoints',
    },
    servers: [{ url: baseURL }],
  },
  apis: [path.join(__dirname, 'components/routes/networkPromotionPost.js')],
};

// Montar rutas primero
Router(app);

// Generar spec
const swaggerSpec = swaggerJsdoc(options);

// ✅ DEBUG EXTENDIDO
console.log('=== SWAGGER DEBUG ===');
console.log('Número de paths:', Object.keys(swaggerSpec.paths || {}).length);
console.log('Paths:', Object.keys(swaggerSpec.paths || {}));
console.log('Base URL:', baseURL);
console.log('Es Vercel?:', isVercel);

// ✅ SOLUCIÓN: Si no hay paths, crear uno manual para testing
if (Object.keys(swaggerSpec.paths || {}).length === 0) {
  console.log('⚠️  No se encontraron paths, agregando uno manual...');
  swaggerSpec.paths = {
    '/health': {
      get: {
        summary: 'Health Check',
        description: 'Verificar estado del servidor',
        responses: {
          '200': {
            description: 'Servidor funcionando',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                    timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}

// ✅ SERVIR Swagger UI con configuración explícita
const swaggerOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-standalone-preset.min.js'
  ],
  customCssUrl: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui.min.css'
  ],
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// ✅ Ruta para ver el JSON de Swagger (para debug)
app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`📚 Swagger UI: ${baseURL}/api-docs`);
  console.log(`📄 Swagger JSON: ${baseURL}/swagger.json`);
});

module.exports = app;