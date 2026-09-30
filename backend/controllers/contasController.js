const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, instituicao, saldo FROM contas_bancarias WHERE usuario_id = ?",
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { instituicao, saldo } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO contas_bancarias (usuario_id, instituicao, saldo) VALUES (?, ?, ?)",
      [req.usuarioId, instituicao, saldo],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        usuario_id: req.usuarioId,
        instituicao,
        saldo,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM contas_bancarias WHERE id = ?", [id]);
    res.json({ mensagem: "Conta deletada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
