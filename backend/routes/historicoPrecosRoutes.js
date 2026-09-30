const express = require("express");
const router = express.Router();
const historicoPrecosController = require("../controllers/historicoPrecosController");

router.get("/", historicoPrecosController.listar);
router.post("/", historicoPrecosController.criar);

module.exports = router;
