import { useEffect, useState } from "react";
import { PiggyBank, Trash2, Pencil, X } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { formatarMoeda } from "../utils/formatarMoeda";

const nomesTipos = {
  emergencia: "Emergência",
  viagem: "Viagem",
  casa: "Casa",
  carro: "Carro",
  estudos: "Estudos",
  aposentadoria: "Aposentadoria",
  outro: "Outro",
};

function Guardar() {
  const [reservas, setReservas] = useState([]);
  const [tipo, setTipo] = useState("emergencia");
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/reservas").then((res) => setReservas(res.data));
  }

  async function salvar(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/reservas/${editandoId}`, { valor: Number(valor) });
      } else {
        await api.post("/reservas", { tipo, nome, valor: Number(valor) });
      }
      limparForm();
      carregar();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  }

  function iniciarEdicao(r) {
    setEditandoId(r.id);
    setTipo(r.tipo);
    setNome(r.nome);
    setValor(r.valor);
  }

  async function deletar(id) {
    if (!confirm("Tem certeza que quer excluir essa reserva?")) return;
    await api.delete(`/reservas/${id}`);
    carregar();
  }

  function limparForm() {
    setTipo("emergencia");
    setNome("");
    setValor("");
    setEditandoId(null);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <h1 style={{ fontSize: "24px", letterSpacing: "-0.4px" }}>Guardar</h1>

        <form onSubmit={salvar} style={formStyle}>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={inputStyle}
            disabled={!!editandoId}
          >
            {Object.entries(nomesTipos).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome da reserva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={inputStyle}
            required
            disabled={!!editandoId}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
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
          {reservas.length === 0 && (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhuma reserva cadastrada.
            </p>
          )}
          {reservas.map((r) => (
            <div key={r.id} style={cardStyle}>
              <div style={iconBox}>
                <PiggyBank size={18} color="#3B82F6" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{r.nome}</p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  {nomesTipos[r.tipo] || r.tipo} — {formatarMoeda(r.valor)}
                </p>
              </div>
              <button
                onClick={() => iniciarEdicao(r)}
                style={iconAction}
                title="Editar"
              >
                <Pencil size={16} color="var(--text-secondary)" />
              </button>
              <button
                onClick={() => deletar(r.id)}
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
  flexWrap: "wrap",
};

const inputStyle = {
  background: "#27272A",
  border: "1px solid #3F3F46",
  borderRadius: "8px",
  padding: "10px 12px",
  color: "var(--text)",
  fontSize: "14px",
  flex: 1,
  minWidth: "140px",
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
  background: "rgba(59, 130, 246, 0.15)",
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

export default Guardar;
