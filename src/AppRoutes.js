import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ConfigEmpresa from './components/ConfigEmpresa';
import RotaPrivada from './components/RotaPrivada';
import Empresas from './components/Empresas';
import FormInformacoesEmpresa from './components/FormInformacoesEmpresa';
import NovaEmpresa from './components/NovaEmpresa';

export async function loader({ params }) {
    return params;
}

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RotaPrivada />}>
                <Route index element={<Navigate to="empresas" replace />} />
                <Route path="empresas">
                    <Route path="" element={<Empresas />} />
                    <Route path=":slug" loader={loader} element={<ConfigEmpresa />} />
                </Route>
                <Route path="nova-empresa" element={<NovaEmpresa />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;