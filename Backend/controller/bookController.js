const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Obtener todos los libros
  router.get("/books/", async (req, res) => {
    try {
      const snapshot = await db
        .collection("library")
        .orderBy("name", "asc")
        .get();
      const data = [];
      snapshot.forEach((doc) => {
        let book = {
          id: doc.id,
          author: doc.data().author,
          cover: doc.data().cover,
          name: doc.data().name,
        };
        data.push(book);
      });
      res.status(200).json({
        status: "Success",
        data: data,
        error: null,
      });
    } catch (error) {
      res.status(404).json({
        status: "Error",
        data: null,
        error: error,
      });
    }
  });

  // Obtener un libro por su ID
  router.get("/books/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const doc = await db.collection("library").doc(id).get();
      if (!doc.exists) {
        res.status(404).json({
          status: "Error",
          data: null,
          error: { message: "Book not found" },
        });
      } else {
        res.status(200).json({
          status: "Success",
          data: { id: doc.id, ...doc.data() },
          error: null,
        });
      }
    } catch (error) {
      res.status(404).json({
        status: "Error",
        data: null,
        error: error,
      });
    }
  });

  // Crear un nuevo libro
  router.post("/books/", async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        author: req.body.author,
        description: req.body.description,
        publication_year: req.body.publication_year,
        cover: req.body.cover,
      };
      const docRef = await db.collection("library").add(data);
      const datasaved = { id: docRef.id, ...data };

      res.status(200).json({
        status: "Success",
        data: datasaved,
        error: null,
      });
    } catch (error) {
      res.status(404).json({
        Status: "Error",
        data: null,
        error,
      });
    }
  });

  // Actualizar un libro

  router.put("/books/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = {
        name: req.body.name,
        author: req.body.author,
        description: req.body.description,
        publication_year: req.body.publication_year,
        cover: req.body.cover,
      };
      const docRef = await db.collection("library").doc(id).update(data);
      const datasaved = { id: docRef.id, ...data };
      res.status(200).json({
        status: "Success",
        data: datasaved,
        error: null,
      });
    } catch (error) {
      res.status(404).json({
        status: "Error",
        data: null,
        error: error,
      });
    }
  });

  // Eliminar un libro
  router.delete("/books/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = await db.collection("library").doc(id).delete();
      res.status(200).json({
        status: "Success",
        data: { id: id },
        error: null,
      });
    } catch (error) {
      res.status(404).json({
        status: "Error",
        data: null,
        error: error,
      });
    }
  });

  return router;
};
