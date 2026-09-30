const express = require("express");
const router = express.Router();
const carteirasController = require("../controllers/carteirasController");

router.get("/", carteirasController.listar);
router.post("/", carteirasController.criar);

module.exports = router;
