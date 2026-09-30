const express = require("express");
const router = express.Router();
const reservasController = require("../controllers/reservasController");

router.get("/", reservasController.listar);
router.post("/", reservasController.criar);
router.put("/:id", reservasController.atualizar);
router.delete("/:id", reservasController.deletar);

module.exports = router;
