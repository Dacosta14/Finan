const express = require("express");
const router = express.Router();
const assinaturasController = require("../controllers/assinaturasController");

router.get("/", assinaturasController.listar);
router.post("/", assinaturasController.criar);
router.put("/:id/cancelar", assinaturasController.cancelar);

module.exports = router;
