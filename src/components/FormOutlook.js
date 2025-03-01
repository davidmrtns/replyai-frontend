import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";

function FormOutlook(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [outlookClient, setOutlookClient] = useState("");
    const [usuarioPadrao, setUsuarioPadrao] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [timeZones, setTimeZones] = useState([]);
    const [enviado, setEnviado] = useState(false);
    const [carregandoLogin, setCarregandoLogin] = useState(false);

    useEffect(() => {
        if(empresa){
            setOutlookClient(empresa.outlook_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(outlookClient){
            setUsuarioPadrao(outlookClient.usuarioPadrao);
            setTimeZone(outlookClient.timeZone);
            listarFusos();
        }
    }, [outlookClient])

    const listarFusos = async () => {
        var dados = await apiFetch.listarFusosOutlook(empresa.slug);
        if(dados){
            setTimeZones(dados);
        }else{
            setTimeZones([]);
        }
    }

    const enviar = async () => {
        setEnviado(true);
        var resposta = await apiFetch.editarFusoHorarioOutlook(empresa.slug, timeZone);

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

    const autenticar = async () => {
        setCarregandoLogin(true);

        var link = await apiFetch.obterLinkMicrosoft(empresa.slug);
        if(link){
            window.open(link, "_blank", "noopener,noreferrer")
        }else{
            alert("Ocorreu um erro com o login da Microsoft");
        }

        setCarregandoLogin(false);
    }

    return(
        <Form>
            {outlookClient ? 
                <p className="mb-2">Conectado como <span className="fst-italic text-decoration-underline">{usuarioPadrao}</span></p>
            : ""}
            <Button onClick={() => autenticar()}>
                {carregandoLogin ? 
                    <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                : 
                    <>
                        <FontAwesomeIcon icon={faMicrosoft} /> {outlookClient ? "Conectar com outra conta" : "Conectar ao Outlook"}
                    </>
                }
            </Button>
            {outlookClient ? 
                <>
                    <Form.Group className="mb-3 mt-3">
                        <Form.Label>Fuso-horário da agenda</Form.Label>
                        <Form.Select onChange={(opcao) => setTimeZone(opcao.target.value)} value={timeZone}>
                            <option>--</option>
                            {timeZones ? timeZones.map((timezone) => (
                                <option value={timezone.alias}>{timezone.display_name}</option>
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

export default FormOutlook;