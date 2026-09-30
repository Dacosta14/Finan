import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [focoNome, setFocoNome] = useState(false);
  const [focoEmail, setFocoEmail] = useState(false);
  const [focoSenha, setFocoSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-6, 6]), {
    stiffness: 150,
    damping: 20,
  });

  function moverMouse(e) {
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }

  async function cadastrar(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await api.post("/usuarios", { nome, email, senha });
      const res = await api.post("/usuarios/login", { email, senha });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      navigate("/");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao criar conta");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div ref={containerRef} style={containerStyle} onMouseMove={moverMouse}>
      <div style={gridOverlay} />
      <motion.div
        style={{
          ...spotlight,
          left: useTransform(mouseX, (v) => `calc(50% + ${v}px)`),
          top: useTransform(mouseY, (v) => `calc(50% + ${v}px)`),
        }}
      />

      <motion.div
        style={{ ...blob, background: "#8B5CF6", top: "-15%", left: "-10%" }}
        animate={{
          x: [0, 60, -20, 0],
          y: [0, 40, -10, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          ...blob,
          background: "#A855F7",
          bottom: "-20%",
          right: "-15%",
        }}
        animate={{
          x: [0, -50, 20, 0],
          y: [0, -30, 10, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          ...blob,
          background: "#C084FC",
          top: "30%",
          right: "10%",
          width: "300px",
          height: "300px",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 20, 0],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          ...blob,
          background: "#A855F7",
          top: "60%",
          left: "15%",
          width: "260px",
          height: "260px",
        }}
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 30, -20, 0],
          opacity: [0.12, 0.3, 0.12],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            ...particula,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -30, -60] }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        style={{ ...statusBadge }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          style={statusDot}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        Sistema online
      </motion.div>

      <motion.div
        style={{ ...cardStyle, rotateX, rotateY, transformPerspective: 1000 }}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          style={{ textAlign: "center", marginBottom: "32px" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <motion.div
            style={logoGlow}
            animate={{
              boxShadow: [
                "0 0 30px rgba(139,92,246,0.4)",
                "0 0 45px rgba(139,92,246,0.6)",
                "0 0 30px rgba(139,92,246,0.4)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            F
          </motion.div>
          <h1
            style={{
              fontSize: "24px",
              margin: "16px 0 4px",
              letterSpacing: "-0.4px",
            }}
          >
            Criar conta
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Comece a planejar seu futuro hoje
          </p>
        </motion.div>

        <form onSubmit={cadastrar}>
          <motion.div
            style={{ ...inputWrapper, ...(focoNome ? inputWrapperFoco : {}) }}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            <User size={17} color="#8B5CF6" />
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onFocus={() => setFocoNome(true)}
              onBlur={() => setFocoNome(false)}
              style={inputStyle}
              required
            />
          </motion.div>

          <motion.div
            style={{ ...inputWrapper, ...(focoEmail ? inputWrapperFoco : {}) }}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.29, duration: 0.4 }}
          >
            <Mail size={17} color="#8B5CF6" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocoEmail(true)}
              onBlur={() => setFocoEmail(false)}
              style={inputStyle}
              required
            />
          </motion.div>

          <motion.div
            style={{ ...inputWrapper, ...(focoSenha ? inputWrapperFoco : {}) }}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.36, duration: 0.4 }}
          >
            <Lock size={17} color="#8B5CF6" />
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => setFocoSenha(true)}
              onBlur={() => setFocoSenha(false)}
              style={inputStyle}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={olhoButton}
            >
              {mostrarSenha ? (
                <EyeOff size={16} color="var(--text-secondary)" />
              ) : (
                <Eye size={16} color="var(--text-secondary)" />
              )}
            </button>
          </motion.div>

          {erro && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: "var(--red)",
                fontSize: "13px",
                margin: "0 0 16px",
              }}
            >
              {erro}
            </motion.p>
          )}

          <motion.button
            type="submit"
            style={buttonStyle}
            disabled={carregando}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            {carregando ? (
              <motion.div
                style={spinner}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                Criar conta
                <ArrowRight size={17} />
              </>
            )}
          </motion.button>
        </form>

        <motion.p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginTop: "24px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          Já tem conta?{" "}
          <Link
            to="/login"
            style={{ color: "#8B5CF6", textDecoration: "none" }}
          >
            Entrar
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#050508",
  position: "fixed",
  top: 0,
  left: 0,
  overflow: "hidden",
};
const gridOverlay = {
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)`,
  backgroundSize: "50px 50px",
  maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
};
const spotlight = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};
const blob = {
  position: "absolute",
  width: "420px",
  height: "420px",
  borderRadius: "50%",
  filter: "blur(120px)",
};
const particula = {
  position: "absolute",
  width: "3px",
  height: "3px",
  borderRadius: "50%",
  background: "#8B5CF6",
  boxShadow: "0 0 6px #8B5CF6",
};
const statusBadge = {
  position: "absolute",
  top: "28px",
  right: "32px",
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(15, 15, 18, 0.6)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(139, 92, 246, 0.15)",
  borderRadius: "999px",
  padding: "7px 14px",
  fontSize: "12px",
  color: "var(--text-secondary)",
};
const statusDot = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#00FFA3",
  boxShadow: "0 0 8px #00FFA3",
};
const cardStyle = {
  background: "rgba(24, 24, 27, 0.7)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(139, 92, 246, 0.15)",
  borderRadius: "24px",
  padding: "40px",
  width: "380px",
  position: "relative",
  zIndex: 1,
  boxShadow: "0 0 60px rgba(139, 92, 246, 0.08)",
};
const logoGlow = {
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  margin: "0 auto",
  background: "linear-gradient(135deg, #8B5CF6, #A855F7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "22px",
  color: "#050508",
};
const inputWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "#0F0F12",
  border: "1px solid #27272A",
  borderRadius: "12px",
  padding: "13px 16px",
  marginBottom: "14px",
  transition: "border-color 0.2s ease",
};
const inputWrapperFoco = {
  borderColor: "#8B5CF6",
  boxShadow: "0 0 12px rgba(139, 92, 246, 0.25)",
};
const inputStyle = {
  background: "transparent",
  border: "none",
  outline: "none",
  color: "var(--text)",
  fontSize: "14px",
  flex: 1,
};
const olhoButton = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
};
const buttonStyle = {
  width: "100%",
  background: "linear-gradient(135deg, #8B5CF6, #A855F7)",
  color: "#050508",
  border: "none",
  borderRadius: "12px",
  padding: "14px",
  fontWeight: 700,
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minHeight: "48px",
};
const spinner = {
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  border: "2px solid rgba(5, 5, 8, 0.3)",
  borderTopColor: "#050508",
};

export default Cadastro;
