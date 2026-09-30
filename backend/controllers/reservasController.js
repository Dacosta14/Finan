const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, tipo, nome, valor, criado_em FROM reservas WHERE usuario_id = ?",
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { tipo, nome, valor } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO reservas (usuario_id, tipo, nome, valor) VALUES (?, ?, ?, ?)",
      [req.usuarioId, tipo, nome, valor],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        usuario_id: req.usuarioId,
        tipo,
        nome,
        valor,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;
  try {
    await pool.query("UPDATE reservas SET valor = ? WHERE id = ?", [valor, id]);
    res.json({ mensagem: "Reserva atualizada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM reservas WHERE id = ?", [id]);
    res.json({ mensagem: "Reserva deletada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
