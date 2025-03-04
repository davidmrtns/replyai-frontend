import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ApiFetch from "../utils/ApiFetch";
import NavbarReplyAI from "./NavbarReplyAI";
import Spinner from 'react-bootstrap/Spinner';
import MarkdownEditor from "./MarkdownEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function EditorExemplosPrompt(){
    const [tipoSelecionado, setTipoSelecionado] = useState("");
    const [exemploPrompt, setExemploPrompt] = useState("");
    const [acao, setAcao] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const apiFetch = new ApiFetch();

    useEffect(() => {
        const obterExemplo = async () => {
            setCarregando(true);

            var resposta = await apiFetch.obterExemploPrompt(tipoSelecionado)
            if(resposta){
                setExemploPrompt(resposta.prompt);
                setAcao("editar");
            }else{
                setExemploPrompt("");
                setAcao("criar");
            }

            setCarregando(false);
        }
        
        if(tipoSelecionado){
            obterExemplo();
        }
    }, [tipoSelecionado])

    const criarEditarExemploPrompt = async () => {
        setEnviado(true);

        if(acao === "criar"){
            var resposta = await apiFetch.criarExemploPrompt(tipoSelecionado, exemploPrompt);
            if(resposta?.prompt){
                alert("Exemplo de prompt criado com sucesso!");
                setAcao("editar");
            }else{
                alert("Ocorreu um erro ao criar o exemplo de prompt...");
            }
        }else if(acao === "editar"){
            var resposta = await apiFetch.editarExemploPrompt(tipoSelecionado, exemploPrompt);
            if(resposta?.prompt){
                alert("Exemplo de prompt editado com sucesso!");
            }else{
                alert("Ocorreu um erro ao editar o exemplo de prompt...");
            }
        }

        setEnviado(false);
    }

    const excluirExemplo = async () => {
        setEnviado(true);

        var resposta = await apiFetch.excluirExemploPrompt(tipoSelecionado);
        if(resposta === true){
            alert("Exemplo de prompt excluído com sucesso");
            setAcao("criar");
            setExemploPrompt("");
        }else{
            alert("Ocorreu um erro ao excluir o exemplo de prompt");
        }

        setEnviado(false);
    }

    return(
        <>
            <NavbarReplyAI />
            <Container className="p-4">
                <h2>Exemplos de prompt</h2>
                <p className="fst-italic opacity-75">Adicione exemplos de prompt para cada propósito de assistente, para que os 
                    usuários consigam criar os prompts dos seus próprios assistentes.</p>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo do assistente</Form.Label>
                        <Form.Select value={tipoSelecionado} onChange={(opcao) => setTipoSelecionado(opcao.target.value)}>
                            <option value="">--</option>
                            <option value="responder">Responder</option>
                            <option value="agendar">Agendar</option>
                            <option value="retomar">Retomar</option>
                            <option value="confirmar">Confirmar</option>
                            <option value="reescrever">Reescrever</option>
                            <option value="cobrar">Cobrar</option>
                        </Form.Select>
                    </Form.Group>
                    {!tipoSelecionado ?
                        ""
                    : carregando ? 
                        <p className="mb-0">
                            <Spinner animation="border" role="status" size="sm">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner> Carregando prompt de exemplo
                        </p>
                    : 
                        <>
                            <MarkdownEditor instrucoes={exemploPrompt} setInstrucoes={setExemploPrompt} />
                            <div className="d-flex gap-2">
                                <Button 
                                    onClick={() => criarEditarExemploPrompt()} 
                                    disabled={!tipoSelecionado && !enviado}
                                >
                                    {enviado ? 
                                        <Spinner animation="border" role="status" size="sm">
                                            <span className="visually-hidden">Carregando...</span>
                                        </Spinner>
                                    : acao === "criar" ? "Adicionar" : "Editar"}
                                </Button>
                                {acao === "editar" ? 
                                    <Button className="btn-danger" onClick={() => excluirExemplo()} disabled={enviado}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                : ""}
                            </div>
                        </>
                    }
                </Form>
            </Container>
        </>
    );
}

export default EditorExemplosPrompt;