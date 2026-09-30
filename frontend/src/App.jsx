import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Dividas from "./pages/Dividas";
import Metas from "./pages/Metas";
import Investir from "./pages/Investir";
import Login from "./pages/Login";
import RotaProtegida from "./components/RotaProtegida";
import Cadastro from "./pages/Cadastro";
import Guardar from "./pages/Guardar";
import Assinaturas from "./pages/Assinaturas";
import Parcelas from "./pages/Parcelas";
import Contas from "./pages/Contas";
import Assistente from "./pages/Assistente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/dividas"
          element={
            <RotaProtegida>
              <Dividas />
            </RotaProtegida>
          }
        />
        <Route
          path="/metas"
          element={
            <RotaProtegida>
              <Metas />
            </RotaProtegida>
          }
        />
        <Route
          path="/investir"
          element={
            <RotaProtegida>
              <Investir />
            </RotaProtegida>
          }
        />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          path="/guardar"
          element={
            <RotaProtegida>
              <Guardar />
            </RotaProtegida>
          }
        />
        <Route
          path="/assinaturas"
          element={
            <RotaProtegida>
              <Assinaturas />
            </RotaProtegida>
          }
        />
        <Route
          path="/parcelas"
          element={
            <RotaProtegida>
              <Parcelas />
            </RotaProtegida>
          }
        />
        <Route
          path="/contas"
          element={
            <RotaProtegida>
              <Contas />
            </RotaProtegida>
          }
        />
        <Route
          path="/assistente"
          element={
            <RotaProtegida>
              <Assistente />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
