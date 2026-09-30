import { useEffect, useState } from "react";
import { Target, Trash2, Pencil, X } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { formatarMoeda } from "../utils/formatarMoeda";

function Metas() {
  const [metas, setMetas] = useState([]);
  const [nome, setNome] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [previsao, setPrevisao] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/metas").then((res) => setMetas(res.data));
  }

  async function salvar(e) {
    e.preventDefault();
    if (editandoId) {
      await api.put(`/metas/${editandoId}`, {
        nome,
        valor_alvo: Number(valorAlvo),
        valor_atual: Number(valorAtual || 0),
        previsao_conclusao: previsao,
      });
    } else {
      await api.post("/metas", {
        usuario_id: 1,
        nome,
        valor_alvo: Number(valorAlvo),
        previsao_conclusao: previsao,
      });
    }
    limparForm();
    carregar();
  }

  function iniciarEdicao(m) {
    setEditandoId(m.id);
    setNome(m.nome);
    setValorAlvo(m.valor_alvo);
    setValorAtual(m.valor_atual);
    setPrevisao(m.previsao_conclusao ? m.previsao_conclusao.slice(0, 10) : "");
  }

  async function deletar(id) {
    if (!confirm("Tem certeza que quer excluir essa meta?")) return;
    await api.delete(`/metas/${id}`);
    carregar();
  }

  function limparForm() {
    setNome("");
    setValorAlvo("");
    setValorAtual("");
    setPrevisao("");
    setEditandoId(null);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <h1 style={{ fontSize: "24px", letterSpacing: "-0.4px" }}>Metas</h1>

        <form onSubmit={salvar} style={formStyle}>
          <input
            type="text"
            placeholder="Nome da meta"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor alvo"
            value={valorAlvo}
            onChange={(e) => setValorAlvo(e.target.value)}
            style={inputStyle}
            required
          />
          {editandoId && (
            <input
              type="number"
              step="0.01"
              placeholder="Valor atual"
              value={valorAtual}
              onChange={(e) => setValorAtual(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="date"
            value={previsao}
            onChange={(e) => setPrevisao(e.target.value)}
            style={inputStyle}
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
          {metas.length === 0 && (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhuma meta cadastrada.
            </p>
          )}
          {metas.map((m) => {
            const progresso = Math.min(
              (Number(m.valor_atual) / Number(m.valor_alvo)) * 100,
              100,
            );
            return (
              <div key={m.id} style={cardStyle}>
                <div style={iconBox}>
                  <Target size={18} color="var(--purple)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{m.nome}</p>
                  <p
                    style={{
                      margin: "0 0 8px",
                      color: "var(--text-secondary)",
                      fontSize: "13px",
                    }}
                  >
                    {formatarMoeda(m.valor_atual)} de{" "}
                    {formatarMoeda(m.valor_alvo)}
                  </p>
                  <div style={progressoTrack}>
                    <div style={{ ...progressoBar, width: `${progresso}%` }} />
                  </div>
                </div>
                <span
                  style={{ color: "var(--text-secondary)", fontSize: "13px" }}
                >
                  {progresso.toFixed(0)}%
                </span>
                <button
                  onClick={() => iniciarEdicao(m)}
                  style={iconAction}
                  title="Editar"
                >
                  <Pencil size={16} color="var(--text-secondary)" />
                </button>
                <button
                  onClick={() => deletar(m.id)}
                  style={iconAction}
                  title="Excluir"
                >
                  <Trash2 size={16} color="var(--red)" />
                </button>
              </div>
            );
          })}
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
  background: "rgba(139, 92, 246, 0.15)",
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

const progressoTrack = {
  background: "#27272A",
  height: "6px",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressoBar = {
  background: "var(--purple)",
  height: "100%",
  borderRadius: "999px",
};

export default Metas;
