const express = require("express");
const router = express.Router();
const contasController = require("../controllers/contasController");

router.get("/", contasController.listar);
router.post("/", contasController.criar);
router.delete("/:id", contasController.deletar);

module.exports = router;
