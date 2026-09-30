const express = require("express");
const router = express.Router();
const dividasController = require("../controllers/dividasController");

router.get("/", dividasController.listar);
router.post("/", dividasController.criar);
router.delete("/:id", dividasController.deletar);
router.put("/:id", dividasController.atualizar);

module.exports = router;
