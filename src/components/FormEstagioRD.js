import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormEstagioRD({ estagio }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [atalho, setAtalho] = useState("");
    const [dealStageId, setDealStageId] = useState("");
    const [userId, setUserId] = useState("");
    const [dealStageInicial, setDealStageInicial] = useState(false);
    const [enviado, setEnviado] = useState("");

    useEffect(() => {
        if(estagio){
            setAtalho(estagio.atalho || "");
            setDealStageId(estagio.deal_stage_id || "");
            setUserId(estagio.user_id || "");
            setDealStageInicial(estagio.deal_stage_inicial || false);
        }
    }, [estagio])

    const addEstagio = (novoEstagio) => {
        setEmpresa((prevEmpresa) => {
            const clientAtualizado = [
                {
                    ...prevEmpresa.rdstationcrm_client[0],
                    estagios: [
                        ...prevEmpresa.rdstationcrm_client[0].estagios,
                        novoEstagio,
                    ],
                },
                ...prevEmpresa.rdstationcrm_client.slice(1),
            ];

            return {
                ...prevEmpresa,
                rdstationcrm_client: clientAtualizado
            }
        });
    }

    const updEstagio = (id, estagioAtualizado) => {
        setEmpresa((prevEmpresa) => {
            const clientAtualizado = [
                {
                    ...prevEmpresa.rdstationcrm_client[0],
                    estagios: prevEmpresa.rdstationcrm_client[0].estagios.map((estagio) =>
                        estagio.id === id
                            ? { ...estagio, ...estagioAtualizado }
                            : estagio
                    ),
                },
                ...prevEmpresa.rdstationcrm_client.slice(1),
            ];
    
            return {
                ...prevEmpresa,
                rdstationcrm_client: clientAtualizado,
            };
        });
    }

    const enviar = async () => {
        setEnviado(true);
        
        if(estagio === "+"){
            var resposta = await apiFetch.adicionarEstagioRD(empresa.slug, atalho, dealStageId, userId, dealStageInicial)
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addEstagio(resposta);
                alert("Estágio do funil adicionado com sucesso");
            }else{
                alert("Não foi possível adicionar o estágio");
            }
        }else{
            var resposta = await apiFetch.editarInformacoesEstagioRD(empresa.slug, estagio.id, atalho, dealStageId, userId, dealStageInicial);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updEstagio(estagio.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }

        setEnviado(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Atalho do estágio</Form.Label>
                <Form.Control type="text" placeholder="Atalho do estágio" value={atalho} onChange={(e) => setAtalho(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID do estágio no RD Station CRM</Form.Label>
                <Form.Control type="text" placeholder="ID do estágio no RD Station CRM" value={dealStageId} onChange={(e) => setDealStageId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID do usuário do estágio</Form.Label>
                <Form.Control type="text" placeholder="ID do usuário do estágio" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Estágio padrão para novas leads criadas"
                    checked={dealStageInicial}
                    onChange={() => setDealStageInicial(!dealStageInicial)}
                />
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

export default FormEstagioRD;