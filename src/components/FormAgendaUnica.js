import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function FormAgendaUnica({ agenda, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [endereco, setEndereco] = useState("");
    const [atalho, setAtalho] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

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

        selecionar(novaAgenda);
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

    const delAgenda = (id) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                agenda: prevEmpresa.agenda.filter(
                    (agenda) => agenda.id !== id
                )
            };
        });

       selecionar("+");
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

    const excluir = async () => {
        setExcluido(true);
        
        var resposta = await apiFetch.removerAgenda(empresa.slug, agenda.id);
        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            if(resposta === true){
                delAgenda(agenda.id);
                alert("Agenda excluída com sucesso");
            }else{
                alert("Não foi possível excluir a agenda. Tente novamente");
            }
        }

        setExcluido(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Endereço de e-mail agenda</Form.Label>
                <p className="fst-italic opacity-75">Antes de cadastrar a agenda, verifique se ela foi compartilhada com você através do seu provedor de agenda (Google ou Outlook).</p>
                <Form.Control type="email" placeholder="Endereço de e-mail da agenda" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Atalho da agenda</Form.Label>
                <p className="fst-italic opacity-75">As IAs utilizarão este atalho para escolher a agenda correta para inserir o agendamento.</p>
                <Form.Control type="text" placeholder="Atalho da agenda" value={atalho} onChange={(e) => setAtalho(e.target.value.toUpperCase().trim())} />
            </Form.Group>
            <div className="d-flex gap-2">
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : "Salvar"}
                </Button>
                {agenda !== "+" ? 
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

export default FormAgendaUnica;