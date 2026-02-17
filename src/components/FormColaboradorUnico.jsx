import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import { EmpresaContext } from "../contexts/EmpresaContext";
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function FormColaboradorUnico({ colaborador, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [nome, setNome] = useState("");
    const [apelido, setApelido] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        if(colaborador){
            setNome(colaborador.nome || "");
            setApelido(colaborador.apelido || "");
            setDepartamento(colaborador.departamento || "");
        }else{
            setNome("");
            setApelido("");
            setDepartamento("");
        }
    }, [colaborador])

    const addColaborador = (novoColab) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                colaboradores: [...(prevEmpresa?.colaboradores || []), novoColab]
            }
        });

        selecionar(novoColab);
    }

    const updColaborador = (id, colabAtualizado) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                colaboradores: prevEmpresa.colaboradores.map((colaborador) => 
                    colaborador.id === id
                        ? { ...colaborador, ...colabAtualizado }
                        : colaborador
                )
            };
        });
    }

    const delColaborador = (id) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                colaboradores: prevEmpresa.colaboradores.filter(
                    (colaborador) => colaborador.id !== id
                )
            };
        });

       selecionar("+");
    }

    const enviar = async () => {
        setEnviado(true);
        
        if(colaborador === "+"){
            var resposta = await apiFetch.adicionarColaborador(empresa.slug, nome, apelido, departamento);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addColaborador(resposta);
                alert("Colaborador adicionado com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }else{
            var resposta = await apiFetch.alterarColaborador(empresa.slug, colaborador.id, nome, apelido, departamento);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updColaborador(colaborador.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }

        setEnviado(false);
    }

    const excluir = async () => {
        setExcluido(true);
        
        var resposta = await apiFetch.removerColaborador(empresa.slug, colaborador.id);
        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            if(resposta === true){
                delColaborador(colaborador.id);
                alert("Colaborador excluído com sucesso");
            }else{
                alert("Não foi possível excluir o colaborador. Tente novamente");
            }
        }

        setExcluido(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Nome do colaborador</Form.Label>
                <Form.Control type="text" placeholder="Nome do colaborador" value={nome} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Apelido do colaborador (opcional)</Form.Label>
                <p className="fst-italic opacity-75">Preencha esse campo caso os seus clientes se refiram a esse colaborador por algum apelido.</p>
                <Form.Control type="text" placeholder="Apelido do colaborador (opcional)" value={apelido} onChange={(e) => setApelido(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Departamento</Form.Label>
                <p className="fst-italic opacity-75">Nome do departamento em texto plano.</p>
                <Form.Control type="text" placeholder="Departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
            </Form.Group>
            <div className="d-flex gap-2">
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : "Salvar"}
                </Button>
                {colaborador !== "+" ?
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

export default FormColaboradorUnico;