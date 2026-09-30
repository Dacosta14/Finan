const pool = require("../db");

exports.listar = async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT a.id, a.nome, a.tipo, a.quantidade, a.preco_medio, c.nome AS carteira
    FROM ativos a
    JOIN carteiras c ON a.carteira_id = c.id
    WHERE c.usuario_id = ?
  `,
    [req.usuarioId],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { nome, tipo, quantidade, preco_medio } = req.body;
  try {
    // busca a carteira do usuário logado (em vez de confiar no que o front manda)
    const [carteiras] = await pool.query(
      "SELECT id FROM carteiras WHERE usuario_id = ? LIMIT 1",
      [req.usuarioId],
    );

    if (carteiras.length === 0) {
      return res
        .status(400)
        .json({ erro: "Usuário não possui carteira cadastrada" });
    }

    const carteiraId = carteiras[0].id;

    const [result] = await pool.query(
      "INSERT INTO ativos (carteira_id, nome, tipo, quantidade, preco_medio) VALUES (?, ?, ?, ?, ?)",
      [carteiraId, nome, tipo, quantidade, preco_medio],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        carteira_id: carteiraId,
        nome,
        tipo,
        quantidade,
        preco_medio,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, quantidade, preco_medio } = req.body;
  try {
    await pool.query(
      "UPDATE ativos SET nome = ?, tipo = ?, quantidade = ?, preco_medio = ? WHERE id = ?",
      [nome, tipo, quantidade, preco_medio, id],
    );
    res.json({ mensagem: "Ativo atualizado" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM ativos WHERE id = ?", [id]);
    res.json({ mensagem: "Ativo deletado" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
