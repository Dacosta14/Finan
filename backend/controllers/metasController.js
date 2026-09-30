const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, nome, valor_alvo, valor_atual, previsao_conclusao FROM metas WHERE usuario_id = ?",
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { nome, valor_alvo, previsao_conclusao } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO metas (usuario_id, nome, valor_alvo, previsao_conclusao) VALUES (?, ?, ?, ?)",
      [req.usuarioId, nome, valor_alvo, previsao_conclusao],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        usuario_id: req.usuarioId,
        nome,
        valor_alvo,
        previsao_conclusao,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, valor_alvo, valor_atual, previsao_conclusao } = req.body;
  try {
    await pool.query(
      "UPDATE metas SET nome = ?, valor_alvo = ?, valor_atual = ?, previsao_conclusao = ? WHERE id = ?",
      [nome, valor_alvo, valor_atual, previsao_conclusao, id],
    );
    res.json({ mensagem: "Meta atualizada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM metas WHERE id = ?", [id]);
    res.json({ mensagem: "Meta deletada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
