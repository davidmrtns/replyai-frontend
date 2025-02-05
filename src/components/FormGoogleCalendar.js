import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormGoogleCalendar(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [googleCalendarClient, setGoogleCalendarClient] = useState("");
    const [projectId, setProjectId] = useState("");
    const [privateKeyId, setPrivateKeyId] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientId, setClientId] = useState("");
    const [clientX509CertUrl, setClientX509CertUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [duracaoEvento, setDuracaoEvento] = useState("");
    const [horaInicioAgenda, setHoraInicioAgenda] = useState("");
    const [horaFinalAgenda, setHoraFinalAgenda] = useState("");
    const [timezone, setTimezone] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setGoogleCalendarClient(empresa.googlecalendar_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(googleCalendarClient){
            setProjectId(googleCalendarClient.project_id);
            setPrivateKeyId(googleCalendarClient.private_key_id);
            setPrivateKey(googleCalendarClient.private_key);
            setClientEmail(googleCalendarClient.client_email);
            setClientId(googleCalendarClient.client_id);
            setClientX509CertUrl(googleCalendarClient.client_x509_cert_url);
            setApiKey(googleCalendarClient.api_key);
            setDuracaoEvento(googleCalendarClient.duracao_evento);
            setHoraInicioAgenda(googleCalendarClient.hora_inicio_agenda);
            setHoraFinalAgenda(googleCalendarClient.hora_final_agenda);
            setTimezone(googleCalendarClient.timezone);
        }
    }, [googleCalendarClient])

    const enviar = async () => {
        setEnviado(true);
        var resposta = null;
        
        if(googleCalendarClient){
            resposta = await apiFetch.editarInformacoesGoogleCalendar(empresa.slug, projectId, privateKeyId, privateKey, clientEmail, clientId, clientX509CertUrl, apiKey, duracaoEvento, horaInicioAgenda, horaFinalAgenda, timezone);
        }else{
            resposta = await apiFetch.adicionarClienteGoogleCalendar(empresa.slug, projectId, privateKeyId, privateKey, clientEmail, clientId, clientX509CertUrl, apiKey, duracaoEvento, horaInicioAgenda, horaFinalAgenda, timezone);
        }

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    googlecalendar_client: [resposta]
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
                <Form.Label>ID do projeto</Form.Label>
                <Form.Control type="text" placeholder="ID do projeto" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID da chave privada</Form.Label>
                <Form.Control type="text" placeholder="ID da chave privada" value={privateKeyId} onChange={(e) => setPrivateKeyId(e.target.value)}  />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Chave privada</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Chave privada" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)}  />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>E-mail do cliente</Form.Label>
                <Form.Control type="email" placeholder="E-mail do cliente" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID do cliente</Form.Label>
                <Form.Control type="text" placeholder="ID do cliente" value={clientId} onChange={(e) => setClientId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>URL do certificado x509 do cliente</Form.Label>
                <Form.Control type="text" placeholder="URL do certificado x509 do cliente" value={clientX509CertUrl} onChange={(e) => setClientX509CertUrl(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Chave de API</Form.Label>
                <Form.Control type="text" placeholder="Chave de API" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
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
                <Form.Control type="text" placeholder="Fuso-horário da agenda" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
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

export default FormGoogleCalendar;