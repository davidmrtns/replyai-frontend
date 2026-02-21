import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ConfigEmpresa from './components/ConfigEmpresa';
import RotaPrivada from './components/RotaPrivada';
import Companies from './pages/Companies';
import NovaEmpresa from './components/NovaEmpresa';
import UsuarioUnico from './components/UsuarioUnico';
import Usuarios from './components/Usuarios';
import AuthFeedback from './components/AuthFeedback';
import EditorExemplosPrompt from './components/EditorExemplosPrompt';
import PoliticaPrivacidade from './components/PoliticaPrivacidade';

export async function loader({ params }) {
  return params;
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RotaPrivada />}>
        <Route index element={<Navigate to="empresas" replace />} />
        <Route path="companies">
          <Route path="" element={<Companies />} />
          <Route path=":slug" loader={loader} element={<ConfigEmpresa />} />
        </Route>
        <Route path="nova-empresa" element={<NovaEmpresa />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="usuario" element={<UsuarioUnico novoUsuario={false} />} />
        <Route path="novo-usuario" element={<UsuarioUnico novoUsuario={true} />} />
        <Route path="/prompts" element={<EditorExemplosPrompt />} />
      </Route>
      <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
      <Route path="/auth-success" element={<AuthFeedback status="success" />} />
      <Route path="/auth-failed" element={<AuthFeedback status="failed" />} />
    </Routes>
  );
};

export default AppRoutes;
