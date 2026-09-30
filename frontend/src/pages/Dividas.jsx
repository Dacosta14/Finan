import { useEffect, useState } from "react";
import { CreditCard, Trash2, Pencil, X } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { formatarMoeda } from "../utils/formatarMoeda";

const nomesTipos = {
  cartao: "Cartão",
  emprestimo: "Empréstimo",
  financiamento: "Financiamento",
  cheque_especial: "Cheque especial",
};

function Dividas() {
  const [dividas, setDividas] = useState([]);
  const [tipo, setTipo] = useState("cartao");
  const [valorTotal, setValorTotal] = useState("");
  const [juros, setJuros] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/dividas").then((res) => setDividas(res.data));
  }

  async function salvar(e) {
    e.preventDefault();
    const dados = {
      usuario_id: 1,
      tipo,
      valor_total: Number(valorTotal),
      juros: Number(juros),
    };

    if (editandoId) {
      await api.put(`/dividas/${editandoId}`, dados);
    } else {
      await api.post("/dividas", dados);
    }
    limparForm();
    carregar();
  }

  function iniciarEdicao(d) {
    setEditandoId(d.id);
    setTipo(d.tipo);
    setValorTotal(d.valor_total);
    setJuros(d.juros);
  }

  async function deletar(id) {
    if (!confirm("Tem certeza que quer excluir essa dívida?")) return;
    await api.delete(`/dividas/${id}`);
    carregar();
  }

  function limparForm() {
    setTipo("cartao");
    setValorTotal("");
    setJuros("");
    setEditandoId(null);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <h1 style={{ fontSize: "24px", letterSpacing: "-0.4px" }}>Dívidas</h1>

        <form onSubmit={salvar} style={formStyle}>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={inputStyle}
          >
            <option value="cartao">Cartão</option>
            <option value="emprestimo">Empréstimo</option>
            <option value="financiamento">Financiamento</option>
            <option value="cheque_especial">Cheque especial</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Valor total"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Juros (%)"
            value={juros}
            onChange={(e) => setJuros(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            {editandoId ? "Salvar" : "Adicionar"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={limparForm}
              style={cancelButtonStyle}
            >
              <X size={16} />
            </button>
          )}
        </form>

        <div style={{ marginTop: "24px" }}>
          {dividas.length === 0 && (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhuma dívida cadastrada.
            </p>
          )}
          {dividas.map((d) => (
            <div key={d.id} style={cardStyle}>
              <div style={iconBox}>
                <CreditCard size={18} color="var(--red)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {nomesTipos[d.tipo] || d.tipo}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  {formatarMoeda(d.valor_total)} — juros: {d.juros}%
                </p>
              </div>
              <button
                onClick={() => iniciarEdicao(d)}
                style={iconAction}
                title="Editar"
              >
                <Pencil size={16} color="var(--text-secondary)" />
              </button>
              <button
                onClick={() => deletar(d.id)}
                style={iconAction}
                title="Excluir"
              >
                <Trash2 size={16} color="var(--red)" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const formStyle = {
  display: "flex",
  gap: "12px",
  background: "var(--card)",
  padding: "16px",
  borderRadius: "12px",
  marginTop: "16px",
};

const inputStyle = {
  background: "#27272A",
  border: "1px solid #3F3F46",
  borderRadius: "8px",
  padding: "10px 12px",
  color: "var(--text)",
  fontSize: "14px",
  flex: 1,
};

const buttonStyle = {
  background: "var(--purple)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 20px",
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const cancelButtonStyle = {
  background: "#27272A",
  color: "var(--text)",
  border: "none",
  borderRadius: "8px",
  padding: "10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

const cardStyle = {
  background: "var(--card)",
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const iconBox = {
  background: "rgba(239, 68, 68, 0.15)",
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const iconAction = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "8px",
  display: "flex",
};

export default Dividas;
