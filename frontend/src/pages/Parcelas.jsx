import { useEffect, useState } from "react";
import { Calendar, Check } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";

function Parcelas() {
  const [dividas, setDividas] = useState([]);
  const [parcelasPorDivida, setParcelasPorDivida] = useState({});

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    const resDividas = await api.get("/dividas");
    setDividas(resDividas.data);

    const mapa = {};
    for (const d of resDividas.data) {
      const res = await api.get(`/parcelas-divida?divida_id=${d.id}`);
      mapa[d.id] = res.data;
    }
    setParcelasPorDivida(mapa);
  }

  async function marcarPaga(id) {
    await api.put(`/parcelas-divida/${id}/pagar`);
    carregarTudo();
  }

  const nomesTipos = {
    cartao: "Cartão",
    emprestimo: "Empréstimo",
    financiamento: "Financiamento",
    cheque_especial: "Cheque especial",
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px" }}>
        <h1 style={{ fontSize: "24px", letterSpacing: "-0.4px" }}>Parcelas</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Acompanhe as parcelas das suas dívidas
        </p>

        {dividas.length === 0 && (
          <p style={{ color: "var(--text-secondary)", marginTop: "24px" }}>
            Nenhuma dívida cadastrada.
          </p>
        )}

        {dividas.map((d) => {
          const parcelas = parcelasPorDivida[d.id] || [];
          if (parcelas.length === 0) return null;
          return (
            <div key={d.id} style={{ marginTop: "24px" }}>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                {nomesTipos[d.tipo] || d.tipo}
              </h3>
              {parcelas.map((p) => (
                <div
                  key={p.id}
                  style={{ ...cardStyle, opacity: p.pago ? 0.5 : 1 }}
                >
                  <div style={iconBox}>
                    <Calendar size={18} color="var(--gold)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      Parcela {p.numero_parcela}{" "}
                      {p.pago && (
                        <span
                          style={{ fontSize: "11px", color: "var(--green)" }}
                        >
                          (paga)
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
                      R$ {Number(p.valor).toFixed(2)} — vencimento:{" "}
                      {new Date(p.vencimento).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {!p.pago && (
                    <button
                      onClick={() => marcarPaga(p.id)}
                      style={iconAction}
                      title="Marcar como paga"
                    >
                      <Check size={16} color="var(--green)" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

export default Parcelas;
