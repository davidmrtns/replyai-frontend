import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormAssistenteUnico({ assistente }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [assistantId, setAssistantId] = useState("");
    const [nome, setNome] = useState("");
    const [proposito, setProposito] = useState("");
    const [atalho, setAtalho] = useState("");
    const [idVoz, setIdVoz] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(assistente){
            setAssistantId(assistente.assistantId || "");
            setNome(assistente.nome || "");
            setProposito(assistente.proposito || "");
            setAtalho(assistente.atalho || "");
            setIdVoz(assistente.voz ? assistente.voz.id : "" || "");
        }
    }, [assistente])

    const addAssistente = (novoAssistente) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                assistentes: [...(prevEmpresa?.assistentes || []), novoAssistente]
            }
        });
    }

    const updAssistente = (id, assistenteAtualizado) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                assistentes: prevEmpresa.assistentes.map((assistente) => 
                    assistente.id === id
                        ? { ...assistente, ...assistenteAtualizado }
                        : assistente
                )
            };
        });
    }

    const enviar = async () => {
        setEnviado(true);
        if(assistente === "+"){
            var resposta = await apiFetch.adicionarAssistente(empresa.slug, nome, assistantId, proposito, atalho, idVoz);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addAssistente(resposta);
                alert("Assistente adicionado com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }else{
            var resposta = await apiFetch.editarAssistente(empresa.slug, assistente.id, nome, assistantId, proposito, atalho, idVoz);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updAssistente(assistente.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }

        setEnviado(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Nome do assistente</Form.Label>
                <Form.Control type="text" placeholder="Nome do assistente" value={nome} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID do assistente</Form.Label>
                <Form.Control type="text" placeholder="ID do assistente" value={assistantId} onChange={(e) => setAssistantId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Propósito do assistente</Form.Label>
                <Form.Select value={proposito} onChange={(e) => setProposito(e.target.value)}>
                    <option>--</option>
                    <option value="responder">Responder</option>
                    <option value="agendar">Agendar</option>
                    <option value="retomar">Retomar</option>
                    <option value="confirmar">Confirmar</option>
                    <option value="reescrever">Reescrever</option>
                    <option value="cobrar">Cobrar</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Atalho do assistente</Form.Label>
                <Form.Control type="text" placeholder="Atalho do assistente" value={atalho} onChange={(e) => setAtalho(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Voz do assistente</Form.Label>
                <Form.Select value={idVoz} onChange={(opcao) => setIdVoz(opcao.target.value)}>
                    <option>--</option>
                    {empresa.vozes ? empresa.vozes.map((voz) => (
                        <option value={voz.id}>{voz.voiceId}</option>
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
        </Form>
    );
}

export default FormAssistenteUnico;