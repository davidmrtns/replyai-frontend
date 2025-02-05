import FormInformacoesEmpresa from "./FormInformacoesEmpresa";
import NavbarReplyAI from "./NavbarReplyAI";
import { Container } from "react-bootstrap";
import { EmpresaContext } from "../contexts/EmpresaContext";
import { useAuth } from "../contexts/AuthContext";

function NovaEmpresa(){
    const { usuarioLogado } = useAuth();

    return(
        <>
            <NavbarReplyAI />
            <Container className="p-4">
                {!usuarioLogado?.id_empresa ?
                    <EmpresaContext.Provider value={{ empresa: null, setEmpresa: () => {} }}>
                        <FormInformacoesEmpresa novaEmpresa={true} />
                    </EmpresaContext.Provider>
                :
                    <h3 className="text-center">Parece que você não tem permissão para criar empresas.</h3>
                }
            </Container>
        </>
    );
}

export default NovaEmpresa;