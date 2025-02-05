import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";

function FormAgendaUnica({ agenda }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [endereco, setEndereco] = useState("");
    const [atalho, setAtalho] = useState("");
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(agenda){
            setEndereco(agenda.endereco || "");
            setAtalho(agenda.atalho || "");
        }
    }, [agenda])

    const addAgenda = (novaAgenda) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                agenda: [...prevEmpresa.agenda, novaAgenda],
            };
        });
    }

    const updAgenda = (id, agendaAtualizada) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                agenda: prevEmpresa.agenda.map((agenda) =>
                    agenda.id === id
                    ? { ...agenda, ...agendaAtualizada }
                    : agenda
                )
            }
        })
    }

    const enviar = async () => {
        setEnviado(true);
        
        if(agenda === "+"){
            var resposta = await apiFetch.adicionarAgenda(empresa.slug, endereco, atalho);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addAgenda(resposta);
                alert("Agenda adicionada com sucesso");
            }
        }else{
            var resposta = await apiFetch.editarAgenda(empresa.slug, agenda.id, endereco, atalho);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updAgenda(agenda.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro ao atualizar os dados");
            }
        }

        setEnviado(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Endereço da agenda</Form.Label>
                <Form.Control type="email" placeholder="Endereço da agenda" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Atalho da agenda</Form.Label>
                <Form.Control type="text" placeholder="Atalho da agenda" value={atalho} onChange={(e) => setAtalho(e.target.value)} />
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

export default FormAgendaUnica;