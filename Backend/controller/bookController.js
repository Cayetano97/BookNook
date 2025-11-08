const express = require("express");
const router = express.Router();

// Función helper para respuestas de error
const sendErrorResponse = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({
    status: "Error",
    message: message,
    data: null,
    error: process.env.NODE_ENV === "development" ? error?.message : null,
  });
};

// Función helper para respuestas exitosas
const sendSuccessResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: "Success",
    data: data,
    error: null,
  });
};

// Validación de datos del libro
const validateBookData = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
      errors.push("El nombre del libro es requerido");
    }
  }
  
  if (!isUpdate || data.author !== undefined) {
    if (!data.author || typeof data.author !== "string" || data.author.trim().length === 0) {
      errors.push("El autor es requerido");
    }
  }
  
  if (data.publication_year !== undefined) {
    const year = Number(data.publication_year);
    if (isNaN(year) || year < 0 || year > new Date().getFullYear() + 1) {
      errors.push("El año de publicación debe ser un número válido");
    }
  }
  
  if (data.cover !== undefined && data.cover !== null && data.cover.trim().length > 0) {
    try {
      new URL(data.cover);
    } catch {
      errors.push("La URL de la portada no es válida");
    }
  }
  
  return errors;
};

module.exports = (db) => {
  // Obtener todos los libros
  router.get("/books/", async (req, res) => {
    try {
      const snapshot = await db
        .collection("library")
        .orderBy("name", "asc")
        .get();
      
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        author: doc.data().author || "",
        cover: doc.data().cover || "",
        name: doc.data().name || "",
      }));
      
      sendSuccessResponse(res, data);
    } catch (error) {
      console.error("Error obteniendo libros:", error);
      sendErrorResponse(res, 500, "Error al obtener los libros", error);
    }
  });

  // Obtener un libro por su ID
  router.get("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || id.trim().length === 0) {
        return sendErrorResponse(res, 400, "ID de libro inválido");
      }
      
      const doc = await db.collection("library").doc(id).get();
      
      if (!doc.exists) {
        return sendErrorResponse(res, 404, "Libro no encontrado");
      }
      
      sendSuccessResponse(res, { id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("Error obteniendo libro:", error);
      sendErrorResponse(res, 500, "Error al obtener el libro", error);
    }
  });

  // Crear un nuevo libro
  router.post("/books/", async (req, res) => {
    try {
      const data = {
        name: req.body.name?.trim() || "",
        author: req.body.author?.trim() || "",
        description: req.body.description?.trim() || "",
        publication_year: req.body.publication_year ? Number(req.body.publication_year) : undefined,
        cover: req.body.cover?.trim() || "",
      };
      
      // Validar datos
      const validationErrors = validateBookData(data, false);
      if (validationErrors.length > 0) {
        return sendErrorResponse(res, 400, validationErrors.join(", "));
      }
      
      const docRef = await db.collection("library").add(data);
      const dataSaved = { id: docRef.id, ...data };

      sendSuccessResponse(res, dataSaved, 201);
    } catch (error) {
      console.error("Error creando libro:", error);
      sendErrorResponse(res, 500, "Error al crear el libro", error);
    }
  });

  // Actualizar un libro
  router.put("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || id.trim().length === 0) {
        return sendErrorResponse(res, 400, "ID de libro inválido");
      }
      
      // Verificar que el libro existe
      const docRef = db.collection("library").doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return sendErrorResponse(res, 404, "Libro no encontrado");
      }
      
      // Preparar datos para actualización (solo campos proporcionados)
      const updateData = {};
      if (req.body.name !== undefined) updateData.name = req.body.name.trim();
      if (req.body.author !== undefined) updateData.author = req.body.author.trim();
      if (req.body.description !== undefined) updateData.description = req.body.description.trim();
      if (req.body.publication_year !== undefined) {
        updateData.publication_year = Number(req.body.publication_year);
      }
      if (req.body.cover !== undefined) updateData.cover = req.body.cover.trim();
      
      // Validar datos
      const validationErrors = validateBookData(updateData, true);
      if (validationErrors.length > 0) {
        return sendErrorResponse(res, 400, validationErrors.join(", "));
      }
      
      await docRef.update(updateData);
      
      // Obtener el documento actualizado
      const updatedDoc = await docRef.get();
      const dataSaved = { id: updatedDoc.id, ...updatedDoc.data() };
      
      sendSuccessResponse(res, dataSaved);
    } catch (error) {
      console.error("Error actualizando libro:", error);
      
      if (error.code === "not-found") {
        return sendErrorResponse(res, 404, "Libro no encontrado");
      }
      
      sendErrorResponse(res, 500, "Error al actualizar el libro", error);
    }
  });

  // Eliminar un libro
  router.delete("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || id.trim().length === 0) {
        return sendErrorResponse(res, 400, "ID de libro inválido");
      }
      
      // Verificar que el libro existe antes de eliminarlo
      const docRef = db.collection("library").doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return sendErrorResponse(res, 404, "Libro no encontrado");
      }
      
      await docRef.delete();
      
      sendSuccessResponse(res, { id: id, message: "Libro eliminado correctamente" });
    } catch (error) {
      console.error("Error eliminando libro:", error);
      sendErrorResponse(res, 500, "Error al eliminar el libro", error);
    }
  });

  return router;
};
