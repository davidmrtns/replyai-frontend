import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';

function FormAsaasUnico({ asaasClient, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [token, setToken] = useState("");
    const [rotulo, setRotulo] = useState("");
    const [clientNumber, setClientNumer] = useState(0);
    const [webhookAgradecer, setWebhookAgradecer] = useState("");
    const [webhookNotaFiscal, setWebhookNotaFiscal] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        if(asaasClient){
            setToken(asaasClient.token || "");
            setRotulo(asaasClient.rotulo || "");
            setClientNumer(asaasClient.client_number || 0);
            
            if(asaasClient.client_number !== null){
                setWebhookAgradecer(`${apiFetch.urlBase}/trabalho/agradecer_pagamento/asaas/${empresa.slug}/${empresa.token}/${asaasClient.client_number}`);
                setWebhookNotaFiscal(`${apiFetch.urlBase}/trabalho/enviar_nf/asaas/${empresa.slug}/${empresa.token}/${asaasClient.client_number}`);
            }
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

    const addCliente = (novoCliente) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                asaas_client: [...(prevEmpresa?.asaas_client || []), novoCliente]
            }
        });

        selecionar(novoCliente);
    }

    const updCliente = (id, clienteAtualizado) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                asaas_client: prevEmpresa.asaas_client.map((cliente) => 
                    cliente.id === id
                        ? { ...cliente, ...clienteAtualizado }
                        : cliente
                )
            };
        });
    }

    const delCliente = (id) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                asaas_client: prevEmpresa.asaas_client.filter(
                    (cliente) => cliente.id !== id
                )
            };
        });

       selecionar("+");
    }

    const enviar = async () => {
        setEnviado(true);

        if(asaasClient === "+"){
            var resposta = await apiFetch.adicionarClienteAsaas(empresa.slug, token, rotulo, clientNumber);
            if(resposta){
                if(resposta.status === 200){
                    resposta = await resposta.json();
                    addCliente(resposta);
                    alert("Cliente adicionado com sucesso");
                }else if(resposta.status === 409){
                    resposta = await resposta.json();
                    alert(resposta.detail);
                }else{
                    alert("Ocorreu um erro");
                }
            }
        }else{
            var resposta = await apiFetch.editarInformacoesClienteAsaas(empresa.slug, token, rotulo, clientNumber);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updCliente(asaasClient.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }

        setEnviado(false);
    }

    const excluir = async () => {
        setExcluido(true);
        
        var resposta = await apiFetch.removerClienteAsaas(empresa.slug, asaasClient.id);
        if(resposta){
            if(resposta.status === 200){
                resposta = await resposta.json();
                if(resposta === true){
                    delCliente(asaasClient.id);
                    alert("Cliente excluído com sucesso");
                }else{
                    alert("Não foi possível excluir o cliente. Tente novamente");
                }
            }
        }

        setExcluido(false);
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
            {asaasClient !== "+" ? 
                <>
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
                </>
            : ""}
            <div className="d-flex gap-2">
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : "Salvar"}
                </Button>
                {asaasClient !== "+" ? 
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

export default FormAsaasUnico;