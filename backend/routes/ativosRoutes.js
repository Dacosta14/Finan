const express = require("express");
const router = express.Router();
const ativosController = require("../controllers/ativosController");

router.get("/", ativosController.listar);
router.post("/", ativosController.criar);
router.delete("/:id", ativosController.deletar);
router.put("/:id", ativosController.atualizar);

module.exports = router;
