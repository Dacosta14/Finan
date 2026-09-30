const pool = require("../db");

exports.listar = async (req, res) => {
  const { conta_id } = req.query;
  const [rows] = await pool.query(
    "SELECT id, tipo, valor, data, descricao FROM movimentacoes WHERE conta_id = ? ORDER BY data DESC",
    [conta_id],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { conta_id, tipo, valor, data, descricao } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO movimentacoes (conta_id, tipo, valor, data, descricao) VALUES (?, ?, ?, ?, ?)",
      [conta_id, tipo, valor, data, descricao],
    );
    res
      .status(201)
      .json({ id: result.insertId, conta_id, tipo, valor, data, descricao });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
