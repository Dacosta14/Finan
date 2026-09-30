import { useEffect, useState } from "react";
import { Repeat, Ban } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";


function Assinaturas() {
  const [assinaturas, setAssinaturas] = useState([]);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [ciclo, setCiclo] = useState("mensal");
  const [diaCobranca, setDiaCobranca] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/assinaturas").then((res) => setAssinaturas(res.data));
  }

  async function criar(e) {
    e.preventDefault();
    await api.post("/assinaturas", {
      nome,
      valor: Number(valor),
      ciclo,
      dia_cobranca: Number(diaCobranca),
    });
    setNome("");
    setValor("");
    setDiaCobranca("");
    carregar();
  }

  async function cancelar(id) {
    if (!confirm("Cancelar essa assinatura?")) return;
    await api.put(`/assinaturas/${id}/cancelar`);
    carregar();
  }

  const totalMensal = assinaturas
    .filter((a) => a.ativa && a.ciclo === "mensal")
    .reduce((s, a) => s + Number(a.valor), 0);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <h1 style={{ fontSize: "24px", letterSpacing: "-0.4px" }}>
          Assinaturas
        </h1>
        {totalMensal > 0 && (
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Gasto mensal com assinaturas ativas:{" "}
            <span style={{ color: "var(--red)" }}>
              R$ {totalMensal.toFixed(2)}
            </span>
          </p>
        )}

        <form onSubmit={criar} style={formStyle}>
          <input
            type="text"
            placeholder="Nome (ex: Netflix)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={inputStyle}
            required
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
          <select
            value={ciclo}
            onChange={(e) => setCiclo(e.target.value)}
            style={inputStyle}
          >
            <option value="mensal">Mensal</option>
            <option value="anual">Anual</option>
          </select>
          <input
            type="number"
            min="1"
            max="31"
            placeholder="Dia da cobrança"
            value={diaCobranca}
            onChange={(e) => setDiaCobranca(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            Adicionar
          </button>
        </form>

        <div style={{ marginTop: "24px" }}>
          {assinaturas.length === 0 && (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhuma assinatura cadastrada.
            </p>
          )}
          {assinaturas.map((a) => (
            <div
              key={a.id}
              style={{ ...cardStyle, opacity: a.ativa ? 1 : 0.5 }}
            >
              <div style={iconBox}>
                <Repeat size={18} color="var(--gold)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {a.nome}{" "}
                  {!a.ativa && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      (cancelada)
                    </span>
                  )}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  R$ {Number(a.valor).toFixed(2)} /{" "}
                  {a.ciclo === "mensal" ? "mês" : "ano"} — dia {a.dia_cobranca}
                </p>
              </div>
              {a.ativa && (
                <button
                  onClick={() => cancelar(a.id)}
                  style={iconAction}
                  title="Cancelar assinatura"
                >
                  <Ban size={16} color="var(--red)" />
                </button>
              )}
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
  background: "rgba(250, 204, 21, 0.15)",
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

export default Assinaturas;
