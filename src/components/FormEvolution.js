import { useContext, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faClock, faMobileScreenButton, faPowerOff, faRotate, faRotateRight, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import imagemSemConexao from "../replyai-no-connection.png";

function FormEvolution(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [evolutionAPIClient, setEvolutionAPIClient] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [instanceName, setInstanceName] = useState("");
    const [instancia, setInstancia] = useState(null);
    const [qrCode, setQrCode] = useState("");
    const [webhook, setWebhook] = useState("");
    const [webhookInstancia, setWebhookInstancia] = useState("");
    const [carregandoInstancia, setCarregandoInstancia] = useState(false);
    const [carregandoWebhook, setCarregandoWebhook] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [mensagem, setMensagem] = useState("Carregando instância");

    useEffect(() => {
        if(empresa){
            setEvolutionAPIClient(empresa.evolutionapi_client[0]);
            setWebhook(`${apiFetch.urlBase}/resposta/${empresa.slug}/${empresa.token}`);
        }
    }, [empresa])

    useEffect(() => {
        if(evolutionAPIClient){
            setApiKey(evolutionAPIClient.apiKey);
            setInstanceName(evolutionAPIClient.instanceName);
        }
    }, [evolutionAPIClient])

    useEffect(() => {
        const obterInstancia = async () => {
            setCarregandoInstancia(true);
            await carregarInstancia();
            setCarregandoInstancia(false);
        }

        obterInstancia();
    }, [apiKey])

    useEffect(() => {
        const obterWebhookInstancia = async () => {
            setCarregandoWebhook(true);

            if(apiKey !== ""){
                var dados = await apiFetch.listarWebhooksEvolutionAPI(empresa.slug, apiKey);
                if(dados){
                    setWebhookInstancia(dados.url);
                }
            }

            setCarregandoWebhook(false);
        }

        obterWebhookInstancia();
    }, [instancia])

    const enviar = async () => {
        setEnviado(true);

        var resposta = await apiFetch.adicionarClienteEvolutionAPI(empresa.slug, instanceName);

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    evolutionapi_client: [resposta]
                }
            });
            alert("Dados atualizados com sucesso");
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    const definirWebhook = async (habilitado) => {
        setCarregandoWebhook(true);

        if(apiKey !== "" && webhook !== ""){
            var dados = await apiFetch.adicionarWebhookEvolutionAPI(empresa.slug, apiKey, webhook, habilitado);
            if(dados){
                setWebhookInstancia(dados?.webhook?.webhook?.url);
            }
        }

        setCarregandoWebhook(false);
    }

    const carregarInstancia = async () => {
        if(apiKey !== ""){
            var dados = await apiFetch.obterInstanciaEvolution(empresa.slug, apiKey);
            if(dados){
                setInstancia(dados[0]);
            }
        }

        setQrCode("");
    }

    const recarregarInstancia = async () =>{
        setMensagem("Carregando instância");
        setCarregandoInstancia(true);
        await carregarInstancia();
        setCarregandoInstancia(false);
    }

    const reiniciarInstancia = async () =>{
        setMensagem("Reiniciando instância");
        setCarregandoInstancia(true);

        if(apiKey !== ""){
            await apiFetch.reiniciarInstanciaEvolution(empresa.slug, apiKey);
            await carregarInstancia();
        }

        setCarregandoInstancia(false);
    }

    const ligarDesligarInstancia = async () => {
        setCarregandoInstancia(true);

        if(instancia){
            if(instancia.instance.status === "open"){
                setMensagem("Desligando instância");
                await apiFetch.desligarInstanciaEvolution(empresa.slug, apiKey);
                await carregarInstancia();
            }else if(instancia.instance.status === "close" || instancia.instance.status === "connecting"){
                setMensagem("Gerando QR Code");
                var dados = await apiFetch.conectarInstanciaEvolution(empresa.slug, apiKey);
                if(dados){
                    setQrCode(dados.base64);
                }
            }
        }

        setCarregandoInstancia(false);
    }

    return(
        <>
            {!evolutionAPIClient ? 
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome da instância</Form.Label>
                        <Form.Control type="text" placeholder="Nome da instância" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} />
                    </Form.Group>
                    <Button onClick={() => enviar()} disabled={enviado} className="btn-success">
                        {enviado ?
                            <Spinner animation="border" role="status" size="sm">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner>
                        : 
                            <>
                                <FontAwesomeIcon icon={faWhatsapp} /> Criar conexão
                            </>
                        }
                    </Button>
                </Form>
            : 
                instancia && instancia.instance ?
                    <Card className="mb-2">
                        <Card.Body>
                            <div className="d-flex gap-3">
                                <img className="rounded border border-1" src={instancia.instance.profilePictureUrl || qrCode || imagemSemConexao} width={200} />
                                <div>
                                    <h1>{instancia.instance.instanceName}</h1>
                                    {instancia.instance.status === "close" ? 
                                        <>
                                            <p className="text-danger"><FontAwesomeIcon icon={faCircleXmark} /> Inativo</p>
                                            <p className="fst-italic opacity-75 mb-0">Ative a conexão clicando no botão "Ligar" abaixo</p>
                                        </>
                                    : instancia.instance.status === "connecting" ? 
                                        <p className="text-warning"><FontAwesomeIcon icon={faClock} /> Conectando</p>
                                    : 
                                        <>
                                            <p>
                                                <FontAwesomeIcon icon={faMobileScreenButton} /> {instancia.instance.owner.split("@")[0]}
                                            </p>
                                            <p>
                                                <FontAwesomeIcon icon={faUser} /> {instancia.instance.profileName}
                                            </p>
                                            <p className="text-success"><FontAwesomeIcon icon={faCircleCheck} /> Ativo</p>
                                            {!carregandoWebhook ? 
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="Ativar respostas da IA"
                                                    checked={webhookInstancia && webhookInstancia == webhook}
                                                    onChange={() => definirWebhook(!(webhookInstancia == webhook))}
                                                />
                                            : 
                                                <p className="mb-0">
                                                    <Spinner animation="border" role="status" size="sm">
                                                        <span className="visually-hidden">Carregando...</span>
                                                    </Spinner> Carregando
                                                </p>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="d-flex mt-2 gap-2">
                                <Button onClick={() => recarregarInstancia()} disabled={carregandoInstancia}>
                                    <FontAwesomeIcon icon={faRotate} />
                                </Button>
                                {instancia.instance.status === "open" ? 
                                    <Button className="btn-warning" onClick={() => reiniciarInstancia()} disabled={carregandoInstancia}>
                                        <FontAwesomeIcon icon={faRotateRight} />
                                    </Button>
                                : ""}
                                <Button className={instancia.instance.status === "close" ? "btn-success" : "btn-danger"} onClick={() => ligarDesligarInstancia()} disabled={carregandoInstancia}>
                                    <FontAwesomeIcon icon={faPowerOff} />
                                </Button>
                            </div>
                            {carregandoInstancia ?
                                <p className="mb-0">
                                    <Spinner animation="border" role="status" size="sm">
                                        <span className="visually-hidden">Carregando...</span>
                                    </Spinner> {mensagem}
                                </p>
                            : ""}
                        </Card.Body>
                    </Card>
                : 
                    <p className="mb-0">
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner> {mensagem}
                    </p>  
                }
        </>
    );
}

export default FormEvolution;