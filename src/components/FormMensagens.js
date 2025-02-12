import { useEffect, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import FormDigisac from "./FormDigisac";
import FormEvolution from "./FormEvolution";
import Spinner from 'react-bootstrap/Spinner';
import ApiFetch from "../utils/ApiFetch";
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormMensagens(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [tipoMessageClient, setTipoMessageClient] = useState("");
    const [tempoRecall, setTempoRecall] = useState(0);
    const [tempoUltimoRecall, setTempoUltimoRecall] = useState(0);
    const [quantRecalls, setQuantRecalls] = useState(0);
    const [ativarRecall, setAtivarRecall] = useState(false);
    const [ativarRecallConfirmacao, setAtivarRecallConfirmacao] = useState(false);
    const [mensagemErroIa, setMensagemErroIa] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setTipoMessageClient(empresa.message_client_type || "");
            setTempoRecall(empresa.recall_timeout_minutes || 0);
            setTempoUltimoRecall(empresa.final_recall_timeout_minutes || 0);
            setQuantRecalls(empresa.recall_quant || 0);
            setAtivarRecall(empresa.recall_ativo || false);
            setAtivarRecallConfirmacao(empresa.recall_confirmacao_ativo || false);
            setMensagemErroIa(empresa.mensagem_erro_ia || "");
        }
    }, [empresa])

    const enviar = async () => {
        setEnviado(true);

        var resposta = await apiFetch.editarInformacoesMensagens(empresa.slug, tipoMessageClient, tempoRecall, tempoUltimoRecall, quantRecalls, ativarRecall, ativarRecallConfirmacao, mensagemErroIa);
        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa(resposta);
            alert("Dados atualizados com sucesso");
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    return(
        <Form>
            <h1>Mensagens</h1>
            <Form.Group className="mb-3">
                <Form.Label>Tipo do cliente de mensagens</Form.Label>
                <Form.Select value={tipoMessageClient} onChange={(opcao) => setTipoMessageClient(opcao.target.value)}>
                    <option value="">--</option>
                    <option value="digisac">Digisac</option>
                    <option value="evolution">Evolution API</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tempo de recall (em minutos)</Form.Label>
                <Form.Control type="number" placeholder="0" value={tempoRecall} onChange={(e) => setTempoRecall(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tempo de último recall (em minutos)</Form.Label>
                <Form.Control type="number" placeholder="0" value={tempoUltimoRecall} onChange={(e) => setTempoUltimoRecall(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Quantidade de recalls</Form.Label>
                <Form.Control type="number" placeholder="0" value={quantRecalls} onChange={(e) => setQuantRecalls(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Ativar recall"
                    checked={ativarRecall}
                    onChange={() => setAtivarRecall(!ativarRecall)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Enviar recall para contatos que estão em confirmação de consulta"
                    checked={ativarRecallConfirmacao}
                    onChange={() => setAtivarRecallConfirmacao(!ativarRecallConfirmacao)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Mensagem de erro da IA</Form.Label>
                <Form.Control type="text" placeholder="Mensagem de erro da IA" value={mensagemErroIa} onChange={(e) => setMensagemErroIa(e.target.value)} />
            </Form.Group>
            {tipoMessageClient ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {tipoMessageClient == "digisac" ? "Configurações do Digisac" : 
                            "Configurações do EvolutionAPI"}
                        </Accordion.Header>
                        <Accordion.Body>
                            {tipoMessageClient == "digisac" ? <FormDigisac /> 
                            : <FormEvolution />}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
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

export default FormMensagens;