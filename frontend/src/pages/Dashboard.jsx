import { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard as CardIcon,
  TrendingUp,
  Target,
  Bell,
  Moon,
  Calendar as CalendarIcon,
  Pencil,
  Check,
} from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import GraficoFinanceiro from "../components/GraficoFinanceiro";

function Dashboard() {
  const [despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [metas, setMetas] = useState([]);
  const [dividas, setDividas] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [editandoSaldo, setEditandoSaldo] = useState(false);
  const [novoSaldoInicial, setNovoSaldoInicial] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const [d, r, m, dv, at, perfil] = await Promise.all([
          api.get("/despesas"),
          api.get("/receitas"),
          api.get("/metas"),
          api.get("/dividas"),
          api.get("/ativos"),
          api.get("/usuarios/perfil"),
        ]);
        setDespesas(d.data);
        setReceitas(r.data);
        setMetas(m.data);
        setDividas(dv.data);
        setAtivos(at.data);
        setSaldoInicial(Number(perfil.data.saldo_inicial) || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  async function salvarSaldoInicial() {
    const valor = Number(novoSaldoInicial);
    await api.put("/usuarios/saldo", { saldo_inicial: valor });
    setSaldoInicial(valor);
    setEditandoSaldo(false);
  }

  const totalDespesas = despesas.reduce((s, d) => s + Number(d.valor), 0);
  const totalReceitas = receitas.reduce((s, r) => s + Number(r.valor), 0);
  const saldo = saldoInicial + totalReceitas - totalDespesas;
  const totalDividas = dividas.reduce((s, d) => s + Number(d.valor_total), 0);
  const totalInvestido = ativos.reduce(
    (s, a) => s + Number(a.quantidade) * Number(a.preco_medio),
    0,
  );
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  if (carregando)
    return (
      <p style={{ color: "var(--text-secondary)", padding: "32px" }}>
        Carregando...
      </p>
    );

  const atalhos = [
    {
      icon: CardIcon,
      label: "Dívidas",
      desc: "Organize e quite suas dívidas",
      color: "var(--red)",
    },
    {
      icon: CalendarIcon,
      label: "Parcelas",
      desc: "Simule e controle suas parcelas",
      color: "var(--gold)",
    },
    {
      icon: Wallet,
      label: "Guardar",
      desc: "Guarde dinheiro com objetivos",
      color: "#3B82F6",
    },
    {
      icon: TrendingUp,
      label: "Investir",
      desc: "Faça seu dinheiro render mais",
      color: "var(--green)",
    },
    {
      icon: Target,
      label: "Planejar",
      desc: "Planeje seus sonhos e conquistas",
      color: "var(--purple)",
    },
  ];

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 48px", maxWidth: "1400px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
          }}
        >
          <div>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Visão geral
            </p>
            <h1
              style={{
                fontSize: "24px",
                margin: "4px 0 0",
                letterSpacing: "-0.4px",
              }}
            >
              Olá, {usuario.nome?.split(" ")[0] || "Usuário"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={dateChip}>
              <CalendarIcon size={15} />
              {dataAtual}
            </div>
            <div style={iconButtonStyle}>
              <Bell size={17} />
            </div>
            <div style={iconButtonStyle}>
              <Moon size={17} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  color: "var(--text-secondary)",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Saldo disponível
              </p>
              <div
                style={{
                  background: "rgba(139, 92, 246, 0.12)",
                  padding: "8px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Wallet size={15} color="var(--purple)" />
              </div>
            </div>

            {editandoSaldo ? (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginTop: "12px",
                  alignItems: "center",
                }}
              >
                <input
                  type="number"
                  step="0.01"
                  placeholder="Saldo inicial"
                  value={novoSaldoInicial}
                  onChange={(e) => setNovoSaldoInicial(e.target.value)}
                  style={{
                    background: "#27272A",
                    border: "1px solid #3F3F46",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    color: "var(--text)",
                    fontSize: "16px",
                    width: "100px",
                  }}
                  autoFocus
                />
                <button
                  onClick={salvarSaldoInicial}
                  style={{
                    background: "var(--purple)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  <Check size={16} color="#fff" />
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "14px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "26px",
                    letterSpacing: "-0.5px",
                    color: saldo < 0 ? "var(--red)" : "var(--text)",
                    fontWeight: 700,
                  }}
                >
                  R$ {saldo.toFixed(2)}
                </h2>
                <button
                  onClick={() => {
                    setNovoSaldoInicial(saldoInicial);
                    setEditandoSaldo(true);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                  }}
                  title="Definir saldo inicial"
                >
                  <Pencil size={13} color="var(--text-secondary)" />
                </button>
              </div>
            )}
          </div>

          <TopCard
            icon={CardIcon}
            label="Total de dívidas"
            value={totalDividas}
            color="var(--red)"
          />
          <TopCard
            icon={TrendingUp}
            label="Investimentos"
            value={totalInvestido}
            color="var(--green)"
          />
          <TopCard
            icon={Target}
            label="Metas concluídas"
            value={`${metas.length} metas`}
            color="var(--gold)"
            isText
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={sectionTitle}>Visão geral financeira</h3>
              <div style={{ display: "flex", gap: "20px" }}>
                <Legenda
                  cor="var(--green)"
                  label={`Receitas · R$ ${totalReceitas.toFixed(2)}`}
                />
                <Legenda
                  cor="var(--red)"
                  label={`Despesas · R$ ${totalDespesas.toFixed(2)}`}
                />
              </div>
            </div>
            <GraficoFinanceiro receitas={receitas} despesas={despesas} />
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={sectionTitle}>Metas e objetivos</h3>
              <span
                style={{
                  color: "var(--purple)",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Ver todas
              </span>
            </div>
            {metas.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <Target
                  size={28}
                  color="var(--text-secondary)"
                  style={{ opacity: 0.4, marginBottom: "8px" }}
                />
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    margin: 0,
                  }}
                >
                  Nenhuma meta cadastrada ainda.
                </p>
              </div>
            )}
            {metas.map((meta) => {
              const progresso = Math.min(
                (Number(meta.valor_atual) / Number(meta.valor_alvo)) * 100,
                100,
              );
              return (
                <div key={meta.id} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>
                      {meta.nome}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {progresso.toFixed(0)}%
                    </p>
                  </div>
                  <div style={progressoTrack}>
                    <div style={{ ...progressoBar, width: `${progresso}%` }} />
                  </div>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    R$ {Number(meta.valor_atual).toFixed(2)} de R${" "}
                    {Number(meta.valor_alvo).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {atalhos.map((item) => (
            <div
              key={item.label}
              style={atalhoCard}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = item.color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div
                style={{
                  background: `${item.color}1F`,
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <item.icon size={18} color={item.color} />
              </div>
              <p
                style={{ fontWeight: 600, margin: "0 0 4px", fontSize: "14px" }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            ...cardStyle,
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(24,24,27,1))",
          }}
        >
          <div>
            <p style={{ fontWeight: 600, margin: "0 0 4px", fontSize: "14px" }}>
              ✨ Dica do dia
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "13px",
              }}
            >
              Pequenas economias hoje, grandes conquistas amanhã. Que tal
              guardar R$ 20,00 hoje?
            </p>
          </div>
          <button style={buttonStyle}>Guardar agora</button>
        </div>
      </div>
    </div>
  );
}

function Legenda({ cor, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: cor,
        }}
      />
      {label}
    </div>
  );
}

function TopCard({ icon: Icon, label, value, color, isText }) {
  const valorNegativo = !isText && Number(value) < 0;
  const corValor = valorNegativo ? "var(--red)" : "var(--text)";

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <p
          style={{
            color: "var(--text-secondary)",
            margin: 0,
            fontSize: "13px",
          }}
        >
          {label}
        </p>
        <div
          style={{
            background: `${color}1F`,
            padding: "8px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={15} color={color} />
        </div>
      </div>
      <h2
        style={{
          margin: "14px 0 0",
          fontSize: "26px",
          letterSpacing: "-0.5px",
          color: corValor,
          fontWeight: 700,
        }}
      >
        {isText ? value : `R$ ${Number(value).toFixed(2)}`}
      </h2>
    </div>
  );
}

const sectionTitle = { fontSize: "15px", fontWeight: 600, margin: 0 };

const dateChip = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "var(--card)",
  padding: "9px 16px",
  borderRadius: "10px",
  fontSize: "13px",
  color: "var(--text-secondary)",
  border: "1px solid #27272A",
};

const iconButtonStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "var(--card)",
  border: "1px solid #27272A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const cardStyle = {
  background: "var(--card)",
  padding: "24px",
  borderRadius: "20px",
  border: "1px solid #202023",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
};

const atalhoCard = {
  ...cardStyle,
  cursor: "pointer",
  transition: "border-color 0.15s ease",
  borderColor: "transparent",
};

const buttonStyle = {
  background: "var(--purple)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "11px 22px",
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
  fontSize: "13px",
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

export default Dashboard;
