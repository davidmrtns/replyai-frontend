import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import FormInformacoesEmpresa from "./FormInformacoesEmpresa";
import FormAssistentes from "./FormAssistentes";
import FormMensagens from "./FormMensagens";
import FormAgendas from "./FormAgendas";
import FormCRM from "./FormCRM";
import FormFinanceiro from "./FormFinanceiro";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import NavbarReplyAI from "./NavbarReplyAI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { EmpresaContext } from '../contexts/EmpresaContext';

function ConfigEmpresa(){
    var { slug } = useParams();
    const apiFetch = new ApiFetch();
    const [carregando, setCarregando] = useState(true);
    const [tabAtiva, setTabAtiva] = useState('informacoesBasicas');
    const [empresa, setEmpresa] = useState(null);

    useEffect(() => {
        const buscarEmpresa = async () => {
            var resposta = await apiFetch.obterEmpresa(slug);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                setEmpresa(resposta)
            }

            setCarregando(false);
        }

        buscarEmpresa();
    }, [slug])

    const renderizarConteudo = () => {
        switch(tabAtiva){
            case 'informacoesBasicas':
                return <FormInformacoesEmpresa novaEmpresa={false} />;
            case 'assistentes':
                return <FormAssistentes />;
            case 'mensagens':
                return <FormMensagens />;
            case 'agenda':
                return <FormAgendas />;
            case 'crm':
                return <FormCRM />;
            case 'financeiro':
                return <FormFinanceiro />;
            default:
                return <FormInformacoesEmpresa novaEmpresa={false} />;
        }
    };

    return(
        <>
            <NavbarReplyAI />
            {empresa === null ? 
                !carregando ? 
                    <Container className="p-4">
                        <h3 className="text-center">Parece que você não tem acesso a essa empresa.</h3>
                    </Container>
                : 
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 p-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    </div>
            :
                <Container className="p-4">
                    <h3 className="text-center pb-1"><FontAwesomeIcon icon={faBuilding} /> {empresa.nome}</h3>
                    <Card>
                        <Card.Header>
                            <Nav variant="pills" activeKey={tabAtiva} onSelect={(tabSelecionada) => setTabAtiva(tabSelecionada)}>
                                <Nav.Item>
                                    <Nav.Link eventKey="informacoesBasicas">Informações básicas</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="assistentes">Assistentes</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="mensagens">Mensagens</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="agenda">Agenda</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="crm">CRM</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="financeiro">Financeiro</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            <EmpresaContext.Provider value={{ empresa, setEmpresa }}>
                                {renderizarConteudo()}
                            </EmpresaContext.Provider>
                        </Card.Body>
                    </Card>
                </Container>
            }
        </>
    );
}

export default ConfigEmpresa;