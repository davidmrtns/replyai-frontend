import { useEffect, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import FormAsaas from "./FormAsaas";
import Accordion from 'react-bootstrap/Accordion';
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormFinanceiro(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [tipoFinancialClient, setTipoFinancialClient] = useState("");
    const [lembrarVencimento, setLembrarVencimento] = useState(false);
    const [enviarBoletoVencimentos, setEnviarBoletoVencimentos] = useState(false);
    const [cobrarInadimplentes, setCobrarInadimplentes] = useState(false);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setTipoFinancialClient(empresa.financial_client_type || "");
            setLembrarVencimento(empresa.lembrar_vencimentos_ativo || false);
            setEnviarBoletoVencimentos(empresa.enviar_boleto_lembrar_vencimento || false);
            setCobrarInadimplentes(empresa.cobrar_inadimplentes_ativo || false);
        }
    }, [empresa])

    const enviar = async () => {
        setEnviado(true);
        
        var resposta = await apiFetch.editarInformacoesFinanceiras(empresa.slug, tipoFinancialClient, lembrarVencimento, enviarBoletoVencimentos, cobrarInadimplentes);
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
            <h1>Financeiro</h1>
            <Form.Group className="mb-3">
                <Form.Label>Tipo do cliente financeiro</Form.Label>
                <Form.Select value={tipoFinancialClient} onChange={(opcao) => setTipoFinancialClient(opcao.target.value)}>
                    <option value="">--</option>
                    <option value="asaas">Asaas</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Lembrar clientes dos vencimentos de cobranças"
                    checked={lembrarVencimento}
                    onChange={() => setLembrarVencimento(!lembrarVencimento)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Enviar boletos ao lembrar do vencimento"
                    checked={enviarBoletoVencimentos}
                    onChange={() => setEnviarBoletoVencimentos(!enviarBoletoVencimentos)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Cobrar clientes com cobranças atrasadas"
                    checked={cobrarInadimplentes}
                    onChange={() => setCobrarInadimplentes(!cobrarInadimplentes)}
                />
            </Form.Group>
            {tipoFinancialClient ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {tipoFinancialClient == "asaas" ? "Configurações do Asaas" : ""}
                        </Accordion.Header>
                        <Accordion.Body>
                            {tipoFinancialClient == "asaas" ? <FormAsaas /> : ""}
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

export default FormFinanceiro;