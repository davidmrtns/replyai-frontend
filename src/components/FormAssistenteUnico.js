import { useContext, useEffect, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import MarkdownEditor from "./MarkdownEditor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    const [carregandoPromptExemplo, setCarregandoPromptExemplo] = useState(false);
    const [promptExemplo, setPromptExemplo] = useState("");
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

    useEffect(() => {
        const obterExemplo = async () => {
            setCarregandoPromptExemplo(true);

            var resposta = await apiFetch.obterExemploPrompt(proposito)
            if(resposta){
                setPromptExemplo(resposta.prompt);
            }else{
                setPromptExemplo("");
            }

            setCarregandoPromptExemplo(false);
        }
        
        if(proposito){
            obterExemplo();
        }
    }, [proposito])

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
                {proposito ? 
                    <p className="fst-italic opacity-75">
                        {proposito === "responder" ? 
                            "Assistentes de propósito responder são assistentes conversacionais - os seus clientes falarão diretamente com esses assistentes e poderão ser direcionados para outros assistentes ou departamentos por eles."
                        : proposito === "agendar" ?
                            "Assistentes de propósito agendar são chamados durante o agendamento, confirmação, cancelamento ou reagendamento de um atendimento. Os clientes não conversam diretamente com eles, uma vez que servem majoritariamente para verificar a disponibildiade da agenda."
                        : proposito === "retomar" ?
                            "Assistentes de propósito retomar são ativados quando é preciso retomar uma conversa com um cliente por inatividade. Eles apenas geram uma mensagem perguntando se o cliente quer continuar o atendimento - posteriores interações do cliente voltam a ser com o assistente de propósito responder com quem ele estava falando antes."
                        : proposito === "confirmar" ?
                            "Assistentes de propósito confirmar são ativados durante o fluxo de confirmação de agendamento. Seu objetivo é receber do cliente a informação se ele quer confirmar, cancelar ou reagendar o atendimento e redirecioná-lo conforme a ação escolhida. É também um assistente conversacional."
                        : proposito === "reescrever" ?
                            "Assistentes de propósito reescrever são ativados quando um cliente envia uma mensagem de áudio. Eles servem apenas para reescrever as mensagens geradas por outros assistentes conversacionais. As mensagens são reescritas removendo abreviações e pontuações desnecessárias, para que em seguida seja gerado uma resposta em áudio totalmente entendível."
                        : proposito === "cobrar" ?
                            "Assistentes de propósito cobrar são chamados nos fluxos financeiros, e seu objetivo é criar mensagens de cobrança, lembrete de pagamentos e agradecimento de pagamentos, que são enviados durante o disparo desses fluxos financeiros. Após o envio da mensagem, caso o cliente responda, ele irá falar com um assistente conversacional da sua empresa - e não com o assistente de cobrança."
                        : ""}
                    </p>
                : ""}
                <Form.Select value={proposito} onChange={(e) => setProposito(e.target.value)}>
                    <option value="">--</option>
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
                <>
                    <MarkdownEditor instrucoes={instrucoes} setInstrucoes={setInstrucoes} />
                    {proposito ? 
                        <>
                            <p className="fst-italic opacity-75">
                                Abaixo, você encontrará um exemplo de prompt adequado ao propósito escolhido para o assistente. 
                                Cada assistente segue um formato específico de prompt e resposta, conforme seu propósito – você 
                                pode conferir esses padrões no menu abaixo. Se desejar, copie o prompt para a caixa de instruções 
                                clicando no botão abaixo e, em seguida, personalize os campos necessários para atender às necessidades do 
                                seu assistente. Se você não tiver muita experiência com a criação de prompts, experimente utilizar os exemplos
                                substituindo apenas os valores dentro dos colchetes [ ].
                            </p>
                            <Button className="mb-2" onClick={() => setInstrucoes(promptExemplo)}>
                                <FontAwesomeIcon icon={faCopy} /> Copiar exemplo para a caixa de instruções
                            </Button>
                            <Accordion className="pb-3">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        Exemplo de prompt - {proposito}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {carregandoPromptExemplo ? 
                                            <p className="mb-0">
                                                <Spinner animation="border" role="status" size="sm">
                                                    <span className="visually-hidden">Carregando...</span>
                                                </Spinner> Carregando prompt de exemplo
                                            </p>
                                        : 
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{promptExemplo || "Nenhum exemplo de prompt encontrado..."}</ReactMarkdown>
                                        }
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </>
                    : ""}
                </>
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