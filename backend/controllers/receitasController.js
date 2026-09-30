const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT r.id, r.valor, r.data, r.descricao, c.nome AS categoria
    FROM receitas r
    LEFT JOIN categorias c ON r.categoria_id = c.id
    WHERE r.usuario_id = ?
    ORDER BY r.data DESC
  `,
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { categoria_id, valor, data, descricao } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO receitas (usuario_id, categoria_id, valor, data, descricao) VALUES (?, ?, ?, ?, ?)",
      [req.usuarioId, categoria_id, valor, data, descricao],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        usuario_id: req.usuarioId,
        categoria_id,
        valor,
        data,
        descricao,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { valor, data, descricao, categoria_id } = req.body;
  try {
    await pool.query(
      "UPDATE receitas SET valor = ?, data = ?, descricao = ?, categoria_id = ? WHERE id = ?",
      [valor, data, descricao, categoria_id, id],
    );
    res.json({ mensagem: "Receita atualizada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM receitas WHERE id = ?", [id]);
    res.json({ mensagem: "Receita deletada" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
