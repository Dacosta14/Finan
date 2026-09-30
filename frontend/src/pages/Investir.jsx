import { useEffect, useState } from "react";
import { TrendingUp, Trash2, Pencil, X } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { formatarMoeda } from "../utils/formatarMoeda";

const nomesTipos = {
  tesouro_direto: "Tesouro Direto",
  cdb: "CDB",
  lci: "LCI",
  lca: "LCA",
  acao_br: "Ação BR",
  acao_us: "Ação US",
  etf: "ETF",
  fii: "FII",
  cripto: "Cripto",
  outro: "Outro",
};

function Investir() {
  const [ativos, setAtivos] = useState([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("tesouro_direto");
  const [quantidade, setQuantidade] = useState("");
  const [precoMedio, setPrecoMedio] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/ativos").then((res) => setAtivos(res.data));
  }

  async function salvar(e) {
    e.preventDefault();
    const dados = {
      nome,
      tipo,
      quantidade: Number(quantidade),
      preco_medio: Number(precoMedio),
    };

    if (editandoId) {
      await api.put(`/ativos/${editandoId}`, dados);
    } else {
      await api.post("/ativos", {
        nome,
        tipo,
        quantidade: Number(quantidade),
        preco_medio: Number(precoMedio),
      });
    }
    limparForm();
    carregar();
  }

  function iniciarEdicao(a) {
    setEditandoId(a.id);
    setNome(a.nome);
    setTipo(a.tipo);
    setQuantidade(a.quantidade);
    setPrecoMedio(a.preco_medio);
  }

  async function deletar(id) {
    if (!confirm("Tem certeza que quer excluir esse ativo?")) return;
    await api.delete(`/ativos/${id}`);
    carregar();
  }

  function limparForm() {
    setNome("");
    setTipo("tesouro_direto");
    setQuantidade("");
    setPrecoMedio("");
    setEditandoId(null);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <h1 style={{ fontSize: "24px", letterSpacing: "-0.4px" }}>Investir</h1>

        <form onSubmit={salvar} style={formStyle}>
          <input
            type="text"
            placeholder="Nome do ativo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={inputStyle}
            required
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={inputStyle}
          >
            {Object.entries(nomesTipos).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.00000001"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço médio"
            value={precoMedio}
            onChange={(e) => setPrecoMedio(e.target.value)}
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
          {ativos.length === 0 && (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhum ativo cadastrado.
            </p>
          )}
          {ativos.map((a) => (
            <div key={a.id} style={cardStyle}>
              <div style={iconBox}>
                <TrendingUp size={18} color="var(--green)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{a.nome}</p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  {nomesTipos[a.tipo] || a.tipo} — {a.quantidade} unidades a{" "}
                  {formatarMoeda(a.preco_medio)}
                </p>
              </div>
              <button
                onClick={() => iniciarEdicao(a)}
                style={iconAction}
                title="Editar"
              >
                <Pencil size={16} color="var(--text-secondary)" />
              </button>
              <button
                onClick={() => deletar(a.id)}
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
  background: "rgba(34, 197, 94, 0.15)",
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

export default Investir;
