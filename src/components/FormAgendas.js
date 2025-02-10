import { useEffect, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import FormOutlook from "./FormOutlook";
import FormGoogleCalendar from "./FormGoogleCalendar";
import FormAgendaUnica from "./FormAgendaUnica";
import Spinner from 'react-bootstrap/Spinner';
import ApiFetch from "../utils/ApiFetch";
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormAgenda(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [agendas, setAgendas] = useState([]);
    const [agendaSelecionada, setAgendaSelecionada] = useState(null);
    const [tipoAgendaClient, setTipoAgendaClient] = useState("");
    const [tipoCancelamento, setTipoCancelamento] = useState("");
    const [ativarConfirmacao, setAtivarConfirmacao] = useState(false);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setTipoAgendaClient(empresa.agenda_client_type || "");
            setTipoCancelamento(empresa.tipo_cancelamento_evento || "");
            setAtivarConfirmacao(empresa.confirmar_agendamentos_ativo || false);
            setAgendas(empresa.agenda || []);
        }
    }, [empresa])

    const enviar = async () => {
        setEnviado(true);
        
        var resposta = await apiFetch.editarInformacoesAgenda(empresa.slug, tipoAgendaClient, tipoCancelamento, ativarConfirmacao);
        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa(resposta);
            alert("Dados atualizados com sucesso");
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    const alterarAgendaSelecionada = (id) => {
        if(id === "+"){
            setAgendaSelecionada("+");
        }else{
            var agenda = agendas.find(ag => ag.id === parseInt(id));
            setAgendaSelecionada(agenda);
        }
    }

    return(
        <Form>
            <h1>Agenda</h1>
            <Form.Group className="mb-3">
                <Form.Label>Tipo do cliente de agenda</Form.Label>
                <Form.Select value={tipoAgendaClient} onChange={(opcao) => setTipoAgendaClient(opcao.target.value)}>
                    <option value="">--</option>
                    <option value="outlook">Outlook</option>
                    <option value="google_calendar">Google Agenda</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tipo do cancelamento do evento</Form.Label>
                <Form.Select value={tipoCancelamento} onChange={(e) => setTipoCancelamento(e.target.value)}>
                    <option>--</option>
                    <option value="manter">Manter na agenda</option>
                    <option value="excluir">Remover da agenda</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Ativar confirmação de agendamentos"
                    checked={ativarConfirmacao}
                    onChange={() => setAtivarConfirmacao(!ativarConfirmacao)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Agendas (selecione uma agenda para modificá-la)</Form.Label>
                <Form.Select onChange={(opcao) => alterarAgendaSelecionada(opcao.target.value)}>
                    <option>--</option>
                    {agendas ? agendas.map((agenda) => (
                        <option value={agenda.id}>{agenda.endereco}</option>
                    )) : ""}
                    <option value="+">Adicionar agenda</option>
                </Form.Select>
            </Form.Group>
            {agendaSelecionada ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {agendaSelecionada !== "+" ? 
                                (`Agenda ${agendaSelecionada.endereco}`)
                            : "Nova agenda"}
                        </Accordion.Header>
                        <Accordion.Body>
                            <FormAgendaUnica agenda={agendaSelecionada} selecionar={(ag) => setAgendaSelecionada(ag)} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            : ""}
            {tipoAgendaClient ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {tipoAgendaClient == "outlook" ? "Configurações do Outlook" : 
                            "Configurações do Google Agenda"}
                        </Accordion.Header>
                        <Accordion.Body>
                            {tipoAgendaClient == "outlook" ? <FormOutlook /> 
                            : <FormGoogleCalendar />}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            : ""}
            <Button onClick={() => enviar()} disabled={enviado}>
                {enviado ?
                    <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                : "Salvar"}
            </Button>
        </Form>
    );
}

export default FormAgenda;