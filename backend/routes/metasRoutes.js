const express = require("express");
const router = express.Router();
const metasController = require("../controllers/metasController");

router.get("/", metasController.listar);
router.post("/", metasController.criar);
router.put("/:id", metasController.atualizar);
router.delete("/:id", metasController.deletar);

module.exports = router;
