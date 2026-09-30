const express = require("express");
const router = express.Router();
const parcelasDividaController = require("../controllers/parcelasDividaController");

router.get("/", parcelasDividaController.listar);
router.post("/", parcelasDividaController.criar);
router.put("/:id/pagar", parcelasDividaController.marcarPago);

module.exports = router;
