const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const bookController = require("./controller/bookController");

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
  
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("serviceAccountKey.json no encontrado. Por favor, configura Firebase Admin SDK.");
  }

  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  
  // Rutas
  app.use("/", bookController(db));

  // Ruta de salud
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
  });

  // Manejo de rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({
      status: "Error",
      message: "Ruta no encontrada",
      error: null,
    });
  });

  // Manejo de errores global
  app.use((err, req, res, next) => {
    console.error("Error no manejado:", err);
    res.status(500).json({
      status: "Error",
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error al inicializar la aplicación:", error.message);
  process.exit(1);
}
