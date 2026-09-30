const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.listar = async (req, res) => {
  const [rows] = await pool.query("SELECT id, nome, email FROM usuarios");
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
      [nome, email, senhaHash],
    );

    await pool.query("INSERT INTO carteiras (usuario_id, nome) VALUES (?, ?)", [
      result.insertId,
      "Carteira Principal",
    ]);

    res.status(201).json({ id: result.insertId, nome, email });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.meuPerfil = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, nome, email, saldo_inicial FROM usuarios WHERE id = ?",
    [req.usuarioId],
  );
  res.json(rows[0]);
};

exports.atualizarSaldo = async (req, res) => {
  const { saldo_inicial } = req.body;
  try {
    await pool.query("UPDATE usuarios SET saldo_inicial = ? WHERE id = ?", [
      saldo_inicial,
      req.usuarioId,
    ]);
    res.json({ mensagem: "Saldo inicial atualizado" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
