import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

function FormAsaas(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [asaasClient, setAsaasClient] = useState("");
    const [token, setToken] = useState("");
    const [rotulo, setRotulo] = useState("");
    const [clientNumber, setClientNumer] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [webhookAgradecer, setWebhookAgradecer] = useState("");
    const [webhookNotaFiscal, setWebhookNotaFiscal] = useState("");

    useEffect(() => {
        if(empresa){
            setAsaasClient(empresa.asaas_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(asaasClient){
            setToken(asaasClient.token);
            setRotulo(asaasClient.rotulo);
            setClientNumer(asaasClient.client_number);
            setWebhookAgradecer(`${apiFetch.urlBase}/trabalho/agradecer_pagamento/asaas/${empresa.slug}/${empresa.token}/${asaasClient.client_number}`);
            setWebhookNotaFiscal(`${apiFetch.urlBase}/trabalho/enviar_nf/asaas/${empresa.slug}/${empresa.token}/${asaasClient.client_number}`);
        }
    }, [asaasClient])

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
        var resposta = null;
        
        if(asaasClient){
            resposta = await apiFetch.editarInformacoesAsaas(empresa.slug, token, rotulo, clientNumber);
        }else{
            resposta = await apiFetch.adicionarClienteAsaas(empresa.slug, token, rotulo, clientNumber);
        }

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    asaas_client: [resposta]
                }
            });
            alert("Dados atualizados com sucesso");
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Token do Asaas</Form.Label>
                <Form.Control type="text" placeholder="Token do Asaas" value={token} onChange={(e) => setToken(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Rótulo da conta</Form.Label>
                <Form.Control type="text" placeholder="Rótulo da conta" value={rotulo} onChange={(e) => setRotulo(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Número do cliente</Form.Label>
                <Form.Control type="number" placeholder="0" value={clientNumber} onChange={(e) => setClientNumer(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Webhook - Agradecer pagamentos</Form.Label>
                <InputGroup>
                    <Form.Control type="text" placeholder="**********" readOnly value={webhookAgradecer} />
                    <Button variant="outline-primary" onClick={() => copiarTexto(webhookAgradecer)}>
                        <FontAwesomeIcon icon={faCopy} />
                    </Button>
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Webhook - Enviar NF</Form.Label>
                <InputGroup>
                    <Form.Control type="text" placeholder="**********" readOnly value={webhookNotaFiscal} />
                    <Button variant="outline-primary" onClick={() => copiarTexto(webhookNotaFiscal)}>
                        <FontAwesomeIcon icon={faCopy} />
                    </Button>
                </InputGroup>
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

export default FormAsaas;