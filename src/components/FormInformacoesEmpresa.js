import { Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from "react";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { useNavigate } from "react-router-dom";

function FormInformacoesEmpresa({ novaEmpresa }){
    const apiFetch = new ApiFetch();
    const navigate = useNavigate();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [nome, setNome] = useState("");
    const [slug, setSlug] = useState("");
    const [token, setToken] = useState("");
    const [fusoHorario, setFusoHorario] = useState("");
    const [empresaAtiva, setEmpresaAtiva] = useState(false);
    const [webhook, setWebhook] = useState("");
    const [openaiApiKey, setOpenaiApiKey] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setNome(empresa.nome || "");
            setSlug(empresa.slug || "");
            setToken(empresa.token || "");
            setEmpresaAtiva(empresa.empresa_ativa || false);
            setFusoHorario(empresa.fuso_horario || "");
            setWebhook(`${apiFetch.urlBase}/resposta/${empresa.slug}/${empresa.token}`);
        }
    }, [empresa])

    const copiarTexto = async (texto) => {
        try{
            await navigator.clipboard.writeText(texto);
            alert("Informação copiada com sucesso!");
        }catch{
            alert("Opa, não foi possível copiar essa informação...");
        }
    }

    const enviar = async () => {
        setEnviado(true);

        if(!novaEmpresa){
            var resposta = await apiFetch.editarInformacoesBasicas(slug, nome, fusoHorario, empresaAtiva);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                setEmpresa(resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }else{
            var resposta = await apiFetch.adicionarEmpresa(nome, slug, fusoHorario, empresaAtiva, openaiApiKey);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                alert("Empresa adicionada com sucesso");
                navigate("/empresas");
            }else{
                alert("Ocorreu um erro ao adicionar a empresa. Tente novamente");
            }
        }

        setEnviado(false);
    }
    
    return(
        <Form>
            <h1>{!novaEmpresa ? "Informações básicas" : "Adicionar empresa"}</h1>
            <Form.Group className="mb-3">
                <Form.Label>Nome da empresa</Form.Label>
                <Form.Control type="text" placeholder="Nome da empresa" value={nome} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Slug</Form.Label>
                <Form.Control type="text" placeholder="Slug da empresa" readOnly={!novaEmpresa} value={slug} onChange={(e) => setSlug(e.target.value)} />
            </Form.Group>
            {!novaEmpresa ?
                <Form.Group className="mb-3">
                    <Form.Label>Token</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="**********" readOnly value={token} />
                        <Button variant="outline-primary" onClick={() => copiarTexto(token)}>
                            <FontAwesomeIcon icon={faCopy} />
                        </Button>
                    </InputGroup>
                </Form.Group>
            : ""}
            <Form.Group className="mb-3">
                <Form.Label>Fuso-horário</Form.Label>
                <Form.Control type="text" placeholder="Fuso-horário" value={fusoHorario} onChange={(e) => setFusoHorario(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Ativar empresa"
                    checked={empresaAtiva}
                    onChange={() => setEmpresaAtiva(!empresaAtiva)}
                />
            </Form.Group>
            {!novaEmpresa ? 
                <Form.Group className="mb-3">
                    <Form.Label>Webhook</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="**********" readOnly value={webhook} />
                        <Button variant="outline-primary" onClick={() => copiarTexto(webhook)}>
                            <FontAwesomeIcon icon={faCopy} />
                        </Button>
                    </InputGroup>
                </Form.Group>
            : ""}
            {novaEmpresa ? 
                <Form.Group className="mb-3">
                    <Form.Label>Chave de API da OpenAI</Form.Label>
                    <Form.Control type="text" placeholder="Chave de API da OpenAI" value={openaiApiKey} onChange={(e) => setOpenaiApiKey(e.target.value)} />
                </Form.Group>
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

export default FormInformacoesEmpresa;