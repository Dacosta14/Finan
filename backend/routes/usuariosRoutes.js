const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

router.get("/", usuariosController.listar);
router.post("/", usuariosController.criar);
router.post("/login", usuariosController.login);
router.get("/perfil", usuariosController.meuPerfil);
router.put("/saldo", usuariosController.atualizarSaldo);

module.exports = router;
