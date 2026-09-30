const express = require("express");
const router = express.Router();
const receitasController = require("../controllers/receitasController");

router.get("/", receitasController.listar);
router.post("/", receitasController.criar);
router.put("/:id", receitasController.atualizar);
router.delete("/:id", receitasController.deletar);

module.exports = router;
