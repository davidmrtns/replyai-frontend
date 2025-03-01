import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function FormGoogleCalendar(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [googleCalendarClient, setGoogleCalendarClient] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [timezone, setTimezone] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [carregandoLogin, setCarregandoLogin] = useState(false);
    const [timezones, setTimezones] = useState([]);

    useEffect(() => {
        if(empresa){
            setGoogleCalendarClient(empresa.googlecalendar_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(googleCalendarClient){
            setClientEmail(googleCalendarClient.client_email);
            setTimezone(googleCalendarClient.timezone);
            listarFusos();
        }
    }, [googleCalendarClient])

    const listarFusos = async () => {
        var dados = await apiFetch.listarFusosPytz();
        if(dados){
            setTimezones(dados.timezones);
        }else{
            setTimezones([]);
        }
    }

    const enviar = async () => {
        setEnviado(true);
        var resposta = await apiFetch.editarInformacoesGoogleCalendar(empresa.slug, timezone);

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

    const autenticar = async () => {
        setCarregandoLogin(true);

        var link = await apiFetch.obterLinkGoogle(empresa.slug);
        if(link){
            window.open(link, "_blank", "noopener,noreferrer")
        }else{
            alert("Ocorreu um erro com o login do Google");
        }

        setCarregandoLogin(false);
    }

    return(
        <Form>
            {googleCalendarClient ? 
                <p className="mb-2">Conectado como <span className="fst-italic text-decoration-underline">{clientEmail}</span></p>
            : ""}
            <Button onClick={() => autenticar()}>
                {carregandoLogin ? 
                    <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                : 
                    <>
                        <FontAwesomeIcon icon={faGoogle} /> {googleCalendarClient ? "Conectar com outra conta" : "Conectar ao Google"}
                    </>
                }
            </Button>
            {googleCalendarClient ? 
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Fuso-horário da agenda {timezone}</Form.Label>
                        <Form.Select onChange={(opcao) => setTimezone(opcao.target.value)} value={timezone}>
                            <option>--</option>
                            {timezones ? timezones.map((timezone) => (
                                <option value={timezone}>{timezone}</option>
                            )) : ""}
                        </Form.Select>
                    </Form.Group>
                    <Button onClick={() => enviar()} disabled={enviado}>
                        {enviado ?
                            <Spinner animation="border" role="status" size="sm">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner>
                        : "Salvar"}
                    </Button>
                </>
            : ""}
        </Form>
    );
}

export default FormGoogleCalendar;