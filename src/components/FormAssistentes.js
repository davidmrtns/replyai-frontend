import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import { useState, useContext, useEffect } from "react";
import FormAssistenteUnico from "./FormAssistenteUnico";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import FormVoz from "./FormVoz";

function FormAssistentes(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [assistentes, setAssistentes] = useState("");
    const [vozes, setVozes] = useState("");
    const [assSelecionado, setAssSelecionado] = useState(null);
    const [vozSelecionada, setVozSelecionada] = useState(null);
    const [assPadraoSelecionado, setAssPadraoSelecionado] = useState(null);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setAssistentes(empresa.assistentes);
            setVozes(empresa.vozes);
        }
    }, [empresa])

    const alterarAssSelecionado = (id) => {
        if(id === "+"){
            setAssSelecionado("+");
        }else{
            var assistente = assistentes.find(ass => ass.id === parseInt(id));
            setAssSelecionado(assistente);
        }
    }

    const alterarVozSelecionada = (id) => {
        if(id === "+"){
            setVozSelecionada("+");
        }else{
            var voz = vozes.find(voz => voz.id === parseInt(id));
            setVozSelecionada(voz);
        }
    }

    const enviar = async () => {
        setEnviado(true);
        
        var resposta = await apiFetch.editarInformacoesAssistentes(empresa.slug, assPadraoSelecionado);
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
            <h1>Assistentes</h1>
            <Form.Group className="mb-3">
                <Form.Label>Assistente padrão</Form.Label>
                <Form.Select onChange={(e) => setAssPadraoSelecionado(e.target.value)}>
                    <option>--</option>
                    {assistentes ? assistentes.map((assistente) => (
                        assistente.proposito === "responder" ?
                            <option value={assistente.id} 
                                selected={empresa.assistentePadrao === assistente.id ? true : false}>
                                    {assistente.nome} - {assistente.proposito}
                            </option>
                        : ""
                    )) : ""}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Assistentes (selecione um assistente para modificá-lo)</Form.Label>
                <Form.Select onChange={(opcao) => alterarAssSelecionado(opcao.target.value)}>
                    <option>--</option>
                    {assistentes ? assistentes.map((assistente) => (
                        <option value={assistente.id}>{assistente.nome} - {assistente.proposito}</option>
                    )) : ""}
                    <option value="+">Adicionar assistente</option>
                </Form.Select>
            </Form.Group>
            {assSelecionado ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {assSelecionado !== "+" ?
                                (`Assistente ${assSelecionado.nome} - ${assSelecionado.proposito}`)
                            : "Novo assistente"}
                        </Accordion.Header>
                        <Accordion.Body>
                            <FormAssistenteUnico assistente={assSelecionado} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            : ""}
            <Form.Group className="mb-3">
                <Form.Label>Vozes (selecione uma voz para modificá-la)</Form.Label>
                <Form.Select onChange={(opcao) => alterarVozSelecionada(opcao.target.value)}>
                    <option>--</option>
                    {vozes ? vozes.map((voz) => (
                        <option value={voz.id}>{voz.voiceId}</option>
                    )) : ""}
                    <option value="+">Adicionar voz</option>
                </Form.Select>
            </Form.Group>
            {vozSelecionada ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {vozSelecionada !== "+" ?
                                (`Voz ${vozSelecionada.voiceId}`)
                            : "Nova voz"}
                        </Accordion.Header>
                        <Accordion.Body>
                            <FormVoz voz={vozSelecionada} />
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

export default FormAssistentes;