const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, tipo, valor_total, juros, criado_em FROM dividas WHERE usuario_id = ?",
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { tipo, valor_total, juros } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO dividas (usuario_id, tipo, valor_total, juros) VALUES (?, ?, ?, ?)",
      [req.usuarioId, tipo, valor_total, juros],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        usuario_id: req.usuarioId,
        tipo,
        valor_total,
        juros,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { tipo, valor_total, juros } = req.body;
  try {
    await pool.query(
      "UPDATE dividas SET tipo = ?, valor_total = ?, juros = ? WHERE id = ?",
      [tipo, valor_total, juros, id],
    );
    res.json({ mensagem: "Dívida atualizada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM dividas WHERE id = ?", [id]);
    res.json({ mensagem: "Dívida deletada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
