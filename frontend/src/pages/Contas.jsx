import { useEffect, useState } from "react";
import { Landmark, Trash2 } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";

function Contas() {
  const [contas, setContas] = useState([]);
  const [instituicao, setInstituicao] = useState("");
  const [saldo, setSaldo] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/contas").then((res) => setContas(res.data));
  }

  async function criar(e) {
    e.preventDefault();
    await api.post("/contas", { instituicao, saldo: Number(saldo) });
    setInstituicao("");
    setSaldo("");
    carregar();
  }

  async function deletar(id) {
    if (!confirm("Tem certeza que quer excluir essa conta?")) return;
    await api.delete(`/contas/${id}`);
    carregar();
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <h1 style={{ fontSize: "24px", letterSpacing: "-0.4px" }}>Contas</h1>

        <form onSubmit={criar} style={formStyle}>
          <input
            type="text"
            placeholder="Instituição (ex: Nubank)"
            value={instituicao}
            onChange={(e) => setInstituicao(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Saldo inicial"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            Adicionar
          </button>
        </form>

        <div style={{ marginTop: "24px" }}>
          {contas.length === 0 && (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhuma conta cadastrada.
            </p>
          )}
          {contas.map((c) => (
            <div key={c.id} style={cardStyle}>
              <div style={iconBox}>
                <Landmark size={18} color="#3B82F6" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{c.instituicao}</p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  Saldo: R$ {Number(c.saldo).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => deletar(c.id)}
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

export default Contas;
