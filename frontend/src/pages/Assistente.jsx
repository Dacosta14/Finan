import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";

function Assistente() {
  const [mensagens, setMensagens] = useState([
    {
      autor: "ia",
      texto:
        "Oi! Sou o assistente financeiro do Finan. Pode perguntar sobre seus gastos, dívidas ou metas.",
    },
  ]);
  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimRef = useRef(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar(e) {
    e.preventDefault();
    if (!pergunta.trim()) return;

    const perguntaAtual = pergunta;
    setMensagens((prev) => [
      ...prev,
      { autor: "usuario", texto: perguntaAtual },
    ]);
    setPergunta("");
    setCarregando(true);

    try {
      const res = await api.post("/ia/perguntar", { pergunta: perguntaAtual });
      setMensagens((prev) => [
        ...prev,
        { autor: "ia", texto: res.data.resposta },
      ]);
    } catch (err) {
      setMensagens((prev) => [
        ...prev,
        {
          autor: "ia",
          texto: "Desculpa, tive um problema para responder. Tenta de novo?",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            letterSpacing: "-0.4px",
            marginBottom: "24px",
          }}
        >
          Assistente Financeiro
        </h1>

        <div style={chatContainer}>
          {mensagens.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  m.autor === "usuario" ? "flex-end" : "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  maxWidth: "70%",
                  flexDirection: m.autor === "usuario" ? "row-reverse" : "row",
                }}
              >
                <div style={m.autor === "ia" ? avatarIA : avatarUsuario}>
                  {m.autor === "ia" ? (
                    <Sparkles size={14} color="#fff" />
                  ) : (
                    <User size={14} color="#fff" />
                  )}
                </div>
                <div style={m.autor === "usuario" ? bolhaUsuario : bolhaIA}>
                  {m.texto}
                </div>
              </div>
            </div>
          ))}
          {carregando && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <div style={avatarIA}>
                <Sparkles size={14} color="#fff" />
              </div>
              <div style={bolhaIA}>Pensando...</div>
            </div>
          )}
          <div ref={fimRef} />
        </div>

        <form onSubmit={enviar} style={formStyle}>
          <input
            type="text"
            placeholder="Pergunte algo sobre suas finanças..."
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            style={inputStyle}
            disabled={carregando}
          />
          <button type="submit" style={buttonStyle} disabled={carregando}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

const chatContainer = {
  flex: 1,
  overflowY: "auto",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
};

const avatarIA = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  flexShrink: 0,
  background: "linear-gradient(135deg, #8B5CF6, #A855F7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const avatarUsuario = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  flexShrink: 0,
  background: "#3F3F46",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const bolhaIA = {
  background: "var(--card)",
  padding: "12px 16px",
  borderRadius: "14px",
  borderTopLeftRadius: "4px",
  fontSize: "14px",
  lineHeight: 1.5,
};

const bolhaUsuario = {
  background: "var(--purple)",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: "14px",
  borderTopRightRadius: "4px",
  fontSize: "14px",
  lineHeight: 1.5,
};

const formStyle = {
  display: "flex",
  gap: "12px",
  marginTop: "16px",
};

const inputStyle = {
  flex: 1,
  background: "var(--card)",
  border: "1px solid #27272A",
  borderRadius: "12px",
  padding: "14px 18px",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle = {
  background: "var(--purple)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  width: "48px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Assistente;
