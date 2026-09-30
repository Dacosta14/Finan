const express = require("express");
const router = express.Router();
const despesasController = require("../controllers/despesasController");

router.get("/", despesasController.listar);
router.post("/", despesasController.criar);
router.put("/:id", despesasController.atualizar);
router.delete("/:id", despesasController.deletar);

module.exports = router;
