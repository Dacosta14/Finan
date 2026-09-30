const pool = require("../db");

exports.listar = async (req, res) => {
  const { despesa_id } = req.query;
  const [rows] = await pool.query(
    "SELECT id, numero_parcela, total_parcelas, valor_parcela, vencimento, pago FROM parcelamentos WHERE despesa_id = ?",
    [despesa_id],
  );
  res.json(rows);
};

exports.criar = async (req, res) => {
  const {
    despesa_id,
    numero_parcela,
    total_parcelas,
    valor_parcela,
    vencimento,
  } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO parcelamentos (despesa_id, numero_parcela, total_parcelas, valor_parcela, vencimento) VALUES (?, ?, ?, ?, ?)",
      [despesa_id, numero_parcela, total_parcelas, valor_parcela, vencimento],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        despesa_id,
        numero_parcela,
        total_parcelas,
        valor_parcela,
        vencimento,
      });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
