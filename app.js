const express = require("express");
var admin = require("firebase-admin");
var serviceAccount = require("./llave.json");
const body_parser = require("body-parser");
const mongoose = require('mongoose');
const PORT = 3000;
const mongoURI = "mongodb+srv://admin:1234@datacluster.8uusbnx.mongodb.net/?appName=DataCluster";
const Router = require("./components/routes/routes");

mongoose.connect(mongoURI)
  .then(() => console.log('¡Conexión a MongoDB exitosa!'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));




var app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

Router(app);


app.listen(PORT, () => {
  console.log(`escuchando en el puerto ${PORT}`);
});

module.exports = {
  admin
}