import { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { EmpresaContext } from "../contexts/EmpresaContext";
import FormAsaasUnico from "./FormAsaasUnico";
import Accordion from 'react-bootstrap/Accordion';

function FormAsaas(){
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [asaasClients, setAsaasClients] = useState("");
    const [clienteSelecionado, setClienteSelecionado] = useState(null);

    useEffect(() => {
        if(empresa){
            setAsaasClients(empresa.asaas_client);
        }
    }, [empresa])

    const alterarClienteSelecionado = (id) => {
        if(id === "+"){
            setClienteSelecionado("+");
        }else{
            var cliente = asaasClients.find(cli => cli.id === parseInt(id));
            setClienteSelecionado(cliente);
        }
    }

    return(
        <Form>
            <h1>Clientes do Asaas</h1>
            <Form.Group className="mb-3">
                <Form.Label>Clientes (selecione um cliente para modificá-lo)</Form.Label>
                <Form.Select onChange={(opcao) => alterarClienteSelecionado(opcao.target.value)}>
                    <option>--</option>
                    {asaasClients ? asaasClients.map((cliente) => (
                        <option value={cliente.id}>{cliente.rotulo}</option>
                    )) : ""}
                    <option value="+">Adicionar cliente</option>
                </Form.Select>
            </Form.Group>
            {clienteSelecionado ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {clienteSelecionado !== "+" ?
                                (`Cliente ${clienteSelecionado.rotulo}`)
                            : "Novo cliente"}
                        </Accordion.Header>
                        <Accordion.Body>
                            <FormAsaasUnico asaasClient={clienteSelecionado} selecionar={(cli) => setClienteSelecionado(cli)} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            : ""}
        </Form>
    );
}

export default FormAsaas;