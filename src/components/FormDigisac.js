import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import FormDeptDigisac from "./FormDeptDigisac";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormDigisac(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [digisacClient, setDigisacClient] = useState("");
    const [departamentos, setDepartamentos] = useState("");
    const [deptSelecionado, setDeptSelecionado] = useState(null);
    const [slugDigisac, setSlugDigisac] = useState("");
    const [tokenDigisac, setTokenDigisac] = useState("");
    const [defaultUserId, setDefaultUserId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setDigisacClient(empresa.digisac_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(digisacClient){
            setSlugDigisac(digisacClient.digisacSlug);
            setTokenDigisac(digisacClient.digisacToken);
            setDefaultUserId(digisacClient.digisacDefaultUser);
            setServiceId(digisacClient.service_id);
            setDepartamentos(digisacClient.departamentos);
        }
    }, [digisacClient])

    const enviar = async () => {
        setEnviado(true);
        var resposta = null;

        if(digisacClient){
            resposta = await apiFetch.editarInformacoesDigisac(empresa.slug, slugDigisac, tokenDigisac, defaultUserId, serviceId);
        }else{
            resposta = await apiFetch.adicionarClienteDigisac(empresa.slug, slugDigisac, tokenDigisac, defaultUserId, serviceId);
        }

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    digisac_client: [resposta]
                }
            });
            alert("Dados atualizados com sucesso");
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    const alterarDeptSelecionado = (id) => {
        if(id === "+"){
            setDeptSelecionado("+");
        }else{
            var departamento = departamentos.find(dpt => dpt.id === parseInt(id));
            setDeptSelecionado(departamento);
        }
    }
    
    return(
        <>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Slug do Digisac</Form.Label>
                    <Form.Control type="text" placeholder="Slug do Digisac" value={slugDigisac} onChange={(e) => setSlugDigisac(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Token do Digisac</Form.Label>
                    <Form.Control type="text" placeholder="Token do Digisac" value={tokenDigisac} onChange={(e) => setTokenDigisac(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>ID do usuário padrão</Form.Label>
                    <Form.Control type="text" placeholder="ID do usuário padrão" value={defaultUserId} onChange={(e) => setDefaultUserId(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>ID do serviço</Form.Label>
                    <Form.Control type="text" placeholder="ID do serviço" defaultValue={serviceId} onChange={(e) => setServiceId(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Departamentos (selecione um departamento para modificá-lo)</Form.Label>
                    <Form.Select onChange={(opcao) => alterarDeptSelecionado(opcao.target.value)}>
                        <option>--</option>
                        {departamentos ? departamentos.map((departamento) => (
                            <option value={departamento.id}>{departamento.id}</option>
                        )) : ""}
                        <option value="+">Adicionar departamento</option>
                    </Form.Select>
                </Form.Group>
                {deptSelecionado ?
                    <Accordion className="pb-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Departamento {deptSelecionado.id}
                            </Accordion.Header>
                            <Accordion.Body>
                                <FormDeptDigisac departamento={deptSelecionado} selecionar={(dpt) => setDeptSelecionado(dpt)} />
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
        </>
    );
}

export default FormDigisac;