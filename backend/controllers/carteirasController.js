const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, nome, criado_em FROM carteiras WHERE usuario_id = ?",
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { nome } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO carteiras (usuario_id, nome) VALUES (?, ?)",
      [req.usuarioId, nome],
    );
    res
      .status(201)
      .json({ id: result.insertId, usuario_id: req.usuarioId, nome });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
