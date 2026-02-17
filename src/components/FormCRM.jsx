import { useEffect, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import FormRDStation from "./FormRDStation";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormCRM(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [tipoCRMClient, setTipoCRMClient] = useState();
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setTipoCRMClient(empresa.crm_client_type);
        }
    }, [empresa])

    const enviar = async () => {
        setEnviado(true);
        
        var resposta = await apiFetch.editarInformacoesCRM(empresa.slug, tipoCRMClient);
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
            <h1>CRM</h1>
            <Form.Group className="mb-3">
                <Form.Label>Tipo do cliente de CRM</Form.Label>
                <Form.Select value={tipoCRMClient} onChange={(opcao) => setTipoCRMClient(opcao.target.value)}>
                    <option value="">--</option>
                    <option value="rdstation">RDStation</option>
                </Form.Select>
            </Form.Group>
            {tipoCRMClient ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {tipoCRMClient == "rdstation" ? "Configurações do RD Station CRM" : 
                            ""}
                        </Accordion.Header>
                        <Accordion.Body>
                            {tipoCRMClient == "rdstation" ? <FormRDStation /> : ""}
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

export default FormCRM;