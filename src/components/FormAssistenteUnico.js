import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import MarkdownEditor from "./MarkdownEditor";

function FormAssistenteUnico({ assistente, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [assistantId, setAssistantId] = useState("");
    const [nome, setNome] = useState("");
    const [proposito, setProposito] = useState("");
    const [atalho, setAtalho] = useState("");
    const [idVoz, setIdVoz] = useState("");
    const [instrucoes, setInstrucoes] = useState("");
    const [carregandoInstrucoes, setCarregandoInstrucoes] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        const obterInstrucoes = async () => {
            setCarregandoInstrucoes(true);

            if(assistente?.id){
                var dados = await apiFetch.obterInstrucoes(empresa.slug, assistente.id);
                if(dados){
                    setInstrucoes(dados);
                }
            }else{
                setInstrucoes("");
            }

            setCarregandoInstrucoes(false);
        }
        
        if(assistente){
            setAssistantId(assistente.assistantId || "");
            setNome(assistente.nome || "");
            setProposito(assistente.proposito || "");
            setAtalho(assistente.atalho || "");
            setIdVoz(assistente.voz ? assistente.voz.id : "" || "");

            obterInstrucoes();
        }
    }, [assistente])

    const addAssistente = (novoAssistente) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                assistentes: [...(prevEmpresa?.assistentes || []), novoAssistente]
            }
        });

        selecionar(novoAssistente);
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

    const delAssistente = (id) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                assistentes: prevEmpresa.assistentes.filter(
                    (assistente) => assistente.id !== id
                )
            };
        });

       selecionar("+");
    }

    const enviar = async () => {
        setEnviado(true);
        
        if(assistente === "+"){
            var resposta = await apiFetch.adicionarAssistente(empresa.slug, nome, instrucoes, proposito, atalho, idVoz);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addAssistente(resposta);
                alert("Assistente adicionado com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }else{
            var resposta = await apiFetch.editarAssistente(empresa.slug, assistente.id, nome, instrucoes, proposito, atalho, idVoz);
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

    const excluir = async () => {
        setExcluido(true);
        
        var resposta = await apiFetch.removerAssistente(empresa.slug, assistente.id);
        if(resposta){
            if(resposta.status === 200){
                resposta = await resposta.json();
                if(resposta === true){
                    delAssistente(assistente.id);
                    alert("Assistente excluído com sucesso");
                }else{
                    alert("Não foi possível excluir o assistente. Tente novamente");
                }
            }else if(resposta.status === 403){
                resposta = await resposta.json();
                alert(resposta.detail);
            }
        }

        setExcluido(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Nome do assistente</Form.Label>
                <Form.Control type="text" placeholder="Nome do assistente" value={nome} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>
            {assistente?.assistantId ?
                <Form.Group className="mb-3">
                    <Form.Label>ID do assistente</Form.Label>
                    <Form.Control type="text" placeholder="ID do assistente" value={assistantId} disabled />
                </Form.Group>
            : ""}
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
                <Form.Control type="text" placeholder="Atalho do assistente" value={atalho} onChange={(e) => setAtalho(e.target.value.toUpperCase().trim())} />
            </Form.Group>
            <Form.Group className="mb-3">
            {carregandoInstrucoes ? 
                <div>
                    <p className="mb-0">Carregando instruções</p>
                    <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                </div>
            : 
                <MarkdownEditor instrucoes={instrucoes} setInstrucoes={setInstrucoes} />
            }
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Voz do assistente</Form.Label>
                <Form.Select value={idVoz} onChange={(opcao) => setIdVoz(opcao.target.value)}>
                    <option>--</option>
                    {empresa.vozes ? empresa.vozes.map((voz) => (
                        <option value={voz.id}>{voz.nome}</option>
                    )) : ""}
                </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : "Salvar"}
                </Button>
                {assistente !== "+" ? 
                    <Button onClick={() => excluir()} className="btn-danger">
                        {excluido ?
                            <Spinner animation="border" role="status" size="sm">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner>
                        :
                            <FontAwesomeIcon icon={faTrash} />
                        }
                    </Button>
                : ""}
            </div>
        </Form>
    );
}

export default FormAssistenteUnico;