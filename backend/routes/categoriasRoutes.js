const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");

router.get("/", categoriasController.listar);
router.post("/", categoriasController.criar);

module.exports = router;
