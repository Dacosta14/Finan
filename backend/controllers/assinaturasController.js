const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, nome, valor, ciclo, dia_cobranca, ativa FROM assinaturas WHERE usuario_id = ?",
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { nome, valor, ciclo, dia_cobranca } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO assinaturas (usuario_id, nome, valor, ciclo, dia_cobranca) VALUES (?, ?, ?, ?, ?)",
      [req.usuarioId, nome, valor, ciclo, dia_cobranca],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        usuario_id: req.usuarioId,
        nome,
        valor,
        ciclo,
        dia_cobranca,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.cancelar = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE assinaturas SET ativa = FALSE WHERE id = ?", [id]);
    res.json({ mensagem: "Assinatura cancelada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
