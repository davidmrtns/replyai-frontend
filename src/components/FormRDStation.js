import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import FormEstagioRD from "./FormEstagioRD";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormRDStation(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [rdStationClient, setRdStationClient] = useState();
    const [token, setToken] = useState("");
    const [idFontePadrao, setIdFontePadrao] = useState("");
    const [estagios, setEstagios] = useState("");
    const [estagioSelecionado, setEstagioSelecionado] = useState(null);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setRdStationClient(empresa.rdstationcrm_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(rdStationClient){
            setToken(rdStationClient.token);
            setIdFontePadrao(rdStationClient.id_fonte_padrao);
            setEstagios(rdStationClient.estagios);
        }
    }, [rdStationClient])

    const enviar = async () => {
        setEnviado(true);
        var resposta = null;

        if(rdStationClient){
            resposta = await apiFetch.editarInformacoesRDStation(empresa.slug, token, idFontePadrao);
        }else{
            resposta = await apiFetch.adicionarClienteRDStation(empresa.slug, token, idFontePadrao);
        }

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    rdstationcrm_client: [resposta]
                }
            });
            alert("Dados atualizados com sucesso");
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    const alterarEstagioSelecionado = (id) => {
        if(id === "+"){
            setEstagioSelecionado("+");
        }else{
            var estagio = rdStationClient.estagios.find(est => est.id === parseInt(id));
            setEstagioSelecionado(estagio);
        }
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Token do RD Station CRM</Form.Label>
                <Form.Control type="text" placeholder="Token do RD Station CRM" value={token} onChange={(e) => setToken(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID da fonte padrão da lead</Form.Label>
                <Form.Control type="text" placeholder="ID da fonte padrão da lead" value={idFontePadrao} onChange={(e) => setIdFontePadrao(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Estágios do funil (selecione um estágio para modificá-lo)</Form.Label>
                <Form.Select onChange={(opcao) => alterarEstagioSelecionado(opcao.target.value)}>
                    <option>--</option>
                    {estagios ? estagios.map((estagio) => (
                        <option value={estagio.id}>{estagio.atalho}</option>
                    )) : ""}
                    <option value="+">Adicionar estágio</option>
                </Form.Select>
            </Form.Group>
            {estagioSelecionado ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            Estágio {estagioSelecionado.id}
                        </Accordion.Header>
                        <Accordion.Body>
                            <FormEstagioRD estagio={estagioSelecionado} />
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

export default FormRDStation;