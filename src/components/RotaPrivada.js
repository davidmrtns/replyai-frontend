import { useEffect, useState } from "react";
import ApiFetch from "../utils/ApiFetch";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import { AuthContext } from "../contexts/AuthContext";

function RotaPrivada(){
    const apiFetch = new ApiFetch();
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const obterUsuario = async () => {
            try{
                const dados = await apiFetch.buscarUsuarioLogado();

                if(dados != "Não autenticado"){
                    setUsuarioLogado(dados);
                }
            }catch{
                setUsuarioLogado(null);
            }finally{
                setCarregando(false);
            }
        }
        obterUsuario();
    }, []);

    if(carregando){
        return <div className="d-flex flex-column justify-content-center align-items-center h-100 p-4">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Carregando...</span>
            </Spinner>
        </div>
    }

    if(!usuarioLogado){
        return <Navigate to="/login" />;
    }

    return (
        <AuthContext.Provider value={{ usuarioLogado, setUsuarioLogado }}>
            <Outlet />
        </AuthContext.Provider>
    );
}

export default RotaPrivada;