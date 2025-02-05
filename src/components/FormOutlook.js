import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormOutlook(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [outlookClient, setOutlookClient] = useState("");
    const [clientId, setClientId] = useState("");
    const [tenantId, setTenantId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [duracaoEvento, setDuracaoEvento] = useState("");
    const [usuarioPadrao, setUsuarioPadrao] = useState("");
    const [horaInicioAgenda, setHoraInicioAgenda] = useState("");
    const [horaFinalAgenda, setHoraFinalAgenda] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setOutlookClient(empresa.outlook_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(outlookClient){
            setClientId(outlookClient.clientId);
            setTenantId(outlookClient.tenantId);
            setClientSecret(outlookClient.clientSecret);
            setDuracaoEvento(outlookClient.duracaoEvento);
            setUsuarioPadrao(outlookClient.usuarioPadrao);
            setHoraInicioAgenda(outlookClient.horaInicioAgenda);
            setHoraFinalAgenda(outlookClient.horaFinalAgenda);
            setTimeZone(outlookClient.timeZone);
        }
    }, [outlookClient])

    const enviar = async () => {
        setEnviado(true);
        var resposta = null;
        
        if(outlookClient){
            resposta = await apiFetch.editarInformacoesOutlook(empresa.slug, clientId, tenantId, clientSecret, duracaoEvento, usuarioPadrao, horaInicioAgenda, horaFinalAgenda, timeZone);
        }else{
            resposta = await apiFetch.adicionarClienteOutlook(empresa.slug, clientId, tenantId, clientSecret, duracaoEvento, usuarioPadrao, horaInicioAgenda, horaFinalAgenda, timeZone);
        }

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    outlook_client: [resposta]
                }
            });
            alert("Dados atualizados com sucesso");
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>ID do cliente do Outlook</Form.Label>
                <Form.Control type="text" placeholder="ID do cliente do Outlook" value={clientId} onChange={(e) => setClientId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID do locatário</Form.Label>
                <Form.Control type="text" placeholder="ID do locatário" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Chave-segredo do cliente</Form.Label>
                <Form.Control type="text" placeholder="Chave-segredo do cliente" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Usuário padrão</Form.Label>
                <Form.Control type="email" placeholder="Usuário padrão" value={usuarioPadrao} onChange={(e) => setUsuarioPadrao(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Duração do evento (em minutos)</Form.Label>
                <Form.Control type="number" placeholder="0" value={duracaoEvento} onChange={(e) => setDuracaoEvento(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hora inicial da agenda</Form.Label>
                <Form.Control type="text" placeholder="00:00:00" value={horaInicioAgenda} onChange={(e) => setHoraInicioAgenda(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hora final da agenda</Form.Label>
                <Form.Control type="text" placeholder="00:00:00" value={horaFinalAgenda} onChange={(e) => setHoraFinalAgenda(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Fuso-horário da agenda</Form.Label>
                <Form.Control type="text" placeholder="Fuso-horário da agenda" value={timeZone} onChange={(e) => setTimeZone(e.target.value)} />
            </Form.Group>
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

export default FormOutlook;