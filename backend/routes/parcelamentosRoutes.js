const express = require("express");
const router = express.Router();
const parcelamentosController = require("../controllers/parcelamentosController");

router.get("/", parcelamentosController.listar);
router.post("/", parcelamentosController.criar);

module.exports = router;
