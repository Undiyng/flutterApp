const express = require("express");
var admin = require("firebase-admin");
//var serviceAccount = require("./llave.json");
//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const firebaseKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const body_parser = require("body-parser");
const mongoose = require('mongoose');
const PORT = 3000;
const mongoURI = "mongodb+srv://admin:1234@datacluster.8uusbnx.mongodb.net/?appName=DataCluster";
const Router = require("./components/routes/routes");
const cors = require('cors');




mongoose.connect(mongoURI)
  .then(() => console.log('¡Conexión a MongoDB exitosa!'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

var app = express();
app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/
if (firebaseKeyString) {
    try {
        const serviceAccount = JSON.parse(firebaseKeyString);
        
        // Inicialización de Firebase SÓLO si el parseo fue exitoso
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // ... otras configuraciones si las tienes
        });
        console.log("🔥 Firebase Admin SDK inicializado.");

    } catch (e) {
        console.error("❌ Error al PARSEAR la llave JSON de Firebase. Revisa el formato de la variable en Vercel.");
        console.error("Detalle del Error:", e);
        // Si no puedes inicializar Firebase, lanza un error fatal para ver el log.
        throw new Error("Configuración de Firebase JSON Inválida."); 
    }
} else {
    // Si la variable está undefined, ¡LANZA UN ERROR CLARO!
    console.error("🛑 ERROR CRÍTICO: La variable FIREBASE_SERVICE_ACCOUNT_KEY no está definida en Vercel.");
    throw new Error("Falta la Variable de Entorno de Firebase.");
}

const options = {
  definition: {
    openapi: '3.0.0', // Especificación OpenAPI (Swagger)
    info: {
      title: 'API de mi App Flutter (Express)',
      version: '1.0.0',
      description: 'Documentación de los endpoints del backend.',
    },
    servers: [
      {
        url: 'https://flutter-app-self.vercel.app/', // URL base de tu API
        description: 'Servidor Local de Desarrollo',
      },
      // Puedes añadir la URL de Vercel aquí después del despliegue
    ],
  },
  // Especifica la ruta a los archivos que contienen los comentarios JSDoc
  apis: [
    './app.js',       // Para las rutas definidas en el archivo principal
    './components/routes/*.js',  // SI TUS ARCHIVOS DE RUTA ESTÁN DENTRO DE UNA CARPETA 'routes'
    './controllers/*.js' // Si documentas esquemas de datos allí
  ], // Ajusta esto a la estructura de tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

Router(app);




app.listen(PORT, () => {
  console.log(`escuchando en el puerto ${PORT}`);
});

