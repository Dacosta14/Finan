import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Sparkles } from "lucide-react";
import {
  Home,
  CreditCard,
  Calendar,
  PiggyBank,
  TrendingUp,
  Compass,
  FileText,
  Target,
  GraduationCap,
  Sparkle,
} from "lucide-react";

import { Repeat } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Visão geral", path: "/" },
  { icon: CreditCard, label: "Dívidas", path: "/dividas" },
  { icon: Calendar, label: "Parcelas", path: "/parcelas" },
  { icon: PiggyBank, label: "Guardar", path: "/guardar" },
  { icon: Repeat, label: "Assinaturas", path: "/assinaturas" },
  { icon: TrendingUp, label: "Investir", path: "/investir" },
  { icon: Compass, label: "Planejar", path: "/planejar" },
  { icon: FileText, label: "Relatórios", path: "/relatorios" },
  { icon: Target, label: "Metas", path: "/metas" },
  { icon: GraduationCap, label: "Educação", path: "/educacao" },
  { icon: Home, label: "Visão geral", path: "/" },
  { icon: Sparkles, label: "Assistente", path: "/assistente" },
  { icon: CreditCard, label: "Dívidas", path: "/dividas" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}"); // move pra cá

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Sparkle size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "15px" }}>Finan</div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            Seu futuro, planejado.
          </div>
        </div>
      </div>

      <nav style={{ marginTop: "32px" }}>
        {menuItems.map((item) => {
          const ativo = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <div style={ativo ? styles.menuItemActive : styles.menuItem}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={styles.userCard}>
        <div style={styles.avatar} />
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600 }}>
            {usuario.nome || "Usuário"}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {usuario.email || ""}
          </div>
        </div>
        <button
          onClick={sair}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <LogOut size={16} color="var(--text-secondary)" />
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    background: "var(--card)",
    height: "100vh",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "4px",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "14px",
  },
  menuItemActive: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "4px",
    background: "rgba(139, 92, 246, 0.15)",
    color: "var(--purple)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "auto",
    padding: "8px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "var(--purple)",
  },
};

export default Sidebar;
