const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query("SELECT id, nome, tipo FROM categorias");
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { nome, tipo } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO categorias (nome, tipo) VALUES (?, ?)",
      [nome, tipo],
    );
    res.status(201).json({ id: result.insertId, nome, tipo });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
