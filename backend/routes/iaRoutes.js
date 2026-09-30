const express = require("express");
const router = express.Router();
const iaController = require("../controllers/iaController");

router.post("/perguntar", iaController.perguntar);

module.exports = router;
