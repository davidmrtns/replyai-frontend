import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormEvolution(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [evolutionAPIClient, setEvolutionAPIClient] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [instanceName, setInstanceName] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setEvolutionAPIClient(empresa.evolutionapi_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(evolutionAPIClient){
            setApiKey(evolutionAPIClient.apiKey);
            setInstanceName(evolutionAPIClient.instanceName);
        }
    }, [evolutionAPIClient])

    const enviar = async () => {
        setEnviado(true);
        var resposta = null;
        
        if(evolutionAPIClient){
            resposta = await apiFetch.editarInformacoesEvolutionAPI(empresa.slug, apiKey, instanceName);
        }else{
            resposta = await apiFetch.adicionarClienteEvolutionAPI(empresa.slug, apiKey, instanceName);
        }

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    evolutionapi_client: [resposta]
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
                <Form.Label>Chave de API do EvolutionAPI</Form.Label>
                <Form.Control type="text" placeholder="Chave de API do EvolutionAPI" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Nome da instância</Form.Label>
                <Form.Control type="text" placeholder="Nome da instância" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} />
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

export default FormEvolution;