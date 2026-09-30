const pool = require("../db");

exports.listar = async (req, res) => {
  const { divida_id } = req.query;
  const [rows] = await pool.query(
    "SELECT id, numero_parcela, valor, vencimento, pago FROM parcelas_divida WHERE divida_id = ?",
    [divida_id],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const { divida_id, numero_parcela, valor, vencimento } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO parcelas_divida (divida_id, numero_parcela, valor, vencimento) VALUES (?, ?, ?, ?)",
      [divida_id, numero_parcela, valor, vencimento],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        divida_id,
        numero_parcela,
        valor,
        vencimento,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.marcarPago = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE parcelas_divida SET pago = TRUE WHERE id = ?", [
      id,
    ]);
    res.json({ mensagem: "Parcela marcada como paga" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
