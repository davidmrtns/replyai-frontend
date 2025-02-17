import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from '../contexts/EmpresaContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function FormDeptDigisac({ departamento, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [atalho, setAtalho] = useState("");
    const [comentario, setComentario] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [userId, setUserId] = useState("");
    const [dptConfirmacao, setDptConfirmacao] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        if(departamento){
            setAtalho(departamento.atalho || "");
            setComentario(departamento.comentario || "");
            setDepartmentId(departamento.departmentId || "");
            setUserId(departamento.userId || "");
            setDptConfirmacao(departamento.departamento_confirmacao || false);
        }
    }, [departamento])

    const addDepartamento = (novoDepartamento) => {
        setEmpresa((prevEmpresa) => {
            const clientAtualizado = [
                {
                    ...prevEmpresa.digisac_client[0],
                    departamentos: [
                        ...prevEmpresa.digisac_client[0].departamentos,
                        novoDepartamento,
                    ],
                },
                ...prevEmpresa.digisac_client.slice(1),
            ];

            return {
                ...prevEmpresa,
                digisac_client: clientAtualizado
            }
        });

        selecionar(novoDepartamento);
    }

    const updDepartamento = (id, departamentoAtualizado) => {
        setEmpresa((prevEmpresa) => {
            const clientAtualizado = [
                {
                    ...prevEmpresa.digisac_client[0],
                    departamentos: prevEmpresa.digisac_client[0].departamentos.map((departamento) =>
                        departamento.id === id
                            ? { ...departamento, ...departamentoAtualizado }
                            : departamento
                    ),
                },
                ...prevEmpresa.digisac_client.slice(1),
            ];
    
            return {
                ...prevEmpresa,
                digisac_client: clientAtualizado,
            };
        });
    }

    const delDepartamento = (id) => {
        setEmpresa((prevEmpresa) => {
            const clientAtualizado = [
                {
                    ...prevEmpresa.digisac_client[0],
                    departamentos: prevEmpresa.digisac_client[0].departamentos.filter(
                        (departamento) => departamento.id !== id
                    ),
                },
                ...prevEmpresa.digisac_client.slice(1),
            ];
    
            return {
                ...prevEmpresa,
                digisac_client: clientAtualizado,
            };
        });

       selecionar("+");
    }

    const enviar = async () => {
        setEnviado(true);

        if(departamento === "+"){
            var resposta = await apiFetch.adicionarDepartamento(empresa.slug, atalho, comentario, departmentId, userId, dptConfirmacao);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addDepartamento(resposta);
                alert("Departamento adicionado com sucesso");
            }else{
                alert("Não foi possível adicionar o departamento");
            }
        }else{
            var resposta = await apiFetch.editarDepartamento(empresa.slug, departamento.id, atalho, comentario, departmentId, userId, dptConfirmacao);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updDepartamento(departamento.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro ao atualizar os dados");
            }
        }

        setEnviado(false);
    }

    const excluir = async () => {
        setExcluido(true);
        
        var resposta = await apiFetch.removerDepartamento(empresa.slug, departamento.id);
        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            if(resposta === true){
                delDepartamento(departamento.id);
                alert("Departamento excluído com sucesso");
            }else{
                alert("Não foi possível excluir o departamento. Tente novamente");
            }
        }

        setExcluido(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Atalho do departamento</Form.Label>
                <Form.Control type="text" placeholder="Atalho do departamento" value={atalho} onChange={(e) => setAtalho(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Comentário de transferência</Form.Label>
                <Form.Control type="text" placeholder="Comentário de transferência" value={comentario} onChange={(e) => setComentario(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID do departamento no Digisac</Form.Label>
                <Form.Control type="text" placeholder="ID do departamento no Digisac" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>ID do usuário para transferência direta</Form.Label>
                <Form.Control type="text" placeholder="ID do usuário para transferência direta" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Departamento de confirmação de consulta"
                    checked={dptConfirmacao}
                    onChange={() => setDptConfirmacao(!dptConfirmacao)}
                />
            </Form.Group>
            <div className="d-flex gap-2">
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : "Salvar"}
                </Button>
                {departamento !== "+" ? 
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

export default FormDeptDigisac;