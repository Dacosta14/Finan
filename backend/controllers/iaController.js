const pool = require("../db");

exports.perguntar = async (req, res) => {
  const { pergunta } = req.body;

  try {
    const [receitas] = await pool.query(
      "SELECT SUM(valor) as total FROM receitas WHERE usuario_id = ?",
      [req.usuarioId],
    );
    const [despesas] = await pool.query(
      "SELECT SUM(valor) as total FROM despesas WHERE usuario_id = ?",
      [req.usuarioId],
    );
    const [dividas] = await pool.query(
      "SELECT SUM(valor_total) as total FROM dividas WHERE usuario_id = ?",
      [req.usuarioId],
    );

    const contexto = `
      Dados financeiros do usuário:
      - Receitas totais: R$ ${receitas[0].total || 0}
      - Despesas totais: R$ ${despesas[0].total || 0}
      - Dívidas totais: R$ ${dividas[0].total || 0}
    `;

    const respostaOllama = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: `${contexto}\n\nPergunta do usuário: ${pergunta}\n\nResponda como um consultor financeiro, de forma direta e prática, baseando-se apenas nos dados acima. Responda em português.`,
        stream: false,
      }),
    });

    const dados = await respostaOllama.json();
    res.json({ resposta: dados.response });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
