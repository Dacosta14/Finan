const pool = require("../db");

exports.listar = async (req, res) => {
  const { ativo_id } = req.query;
  const [rows] = await pool.query(
    "SELECT id, preco, data FROM historico_precos WHERE ativo_id = ? ORDER BY data DESC",
    [ativo_id],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { ativo_id, preco, data } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO historico_precos (ativo_id, preco, data) VALUES (?, ?, ?)",
      [ativo_id, preco, data],
    );
    res.status(201).json({ id: result.insertId, ativo_id, preco, data });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
