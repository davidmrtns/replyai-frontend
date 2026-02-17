import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from '../contexts/EmpresaContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AsyncSelect from "react-select/async";

function FormDeptDigisac({ departamento, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [atalho, setAtalho] = useState("");
    const [comentario, setComentario] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [userId, setUserId] = useState("");
    const [dptConfirmacao, setDptConfirmacao] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        if(departamento){
            setAtalho(departamento.atalho || "");
            setComentario(departamento.comentario || "");
            setDepartmentId(departamento.departmentId || "");
            setUserId(departamento.userId || "");
            setDptConfirmacao(departamento.departamento_confirmacao || false);
            carregarDepartamentoInicial(departamento?.departmentId || "");
            carregarUsuarioInicial(departamento?.userId);
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

    const loadDebounce = (carregar) => (input, callback) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(async () => {
            const options = await carregar(input);
            callback(options);
        }, 500);

        setDebounceTimeout(timeout);
    }

    const carregarDepartamentoInicial = async (id) => {
        if (!id) {
            setSelectedDepartment(null);
            return;
        };

        try{
            var dados = await apiFetch.listarDepartamentosDigisac(empresa.slug, 1, "", id);
            if(dados){
                var departamento = dados.data[0];

                setSelectedDepartment({
                    value: departamento.id,
                    label: departamento.name
                });
            }
        }catch (error){
            console.error("Erro ao buscar departamentos:", error);
        }
    }

    const carregarUsuarioInicial = async (id) => {
        if (!id) return;

        try{
            var dados = await apiFetch.listarUsuariosDigisac(empresa.slug, 1, "", id);
            if(dados){
                var usuario = dados.data[0];

                setSelectedUser({
                    value: usuario.id,
                    label: usuario.name
                });
            }
        }catch (error){
            console.error("Erro ao buscar usuarios:", error);
        }
    }

    const carregarDepartamentos = async (input) => {
        if(input.length < 1){
            return [];
        }

        try{
            var dados = await apiFetch.listarDepartamentosDigisac(empresa.slug, 1, input, "");
            if(dados){
                const opcoesFormatadas = dados.data.map((departamento) => ({
                    value: departamento.id,
                    label: departamento.name
                }));

                return opcoesFormatadas;
            }else{
                return [];
            }
        }catch (error){
            console.error("Erro ao buscar departamentos:", error);
            return [];
        }
    }

    const carregarUsuarios = async (input) => {
        if(input.length < 1){
            return [];
        }

        try{
            var dados = await apiFetch.listarUsuariosDigisac(empresa.slug, 1, input, "");
            if(dados){
                const opcoesFormatadas = dados.data.map((usuario) => ({
                    value: usuario.id,
                    label: usuario.name
                }));

                return opcoesFormatadas;
            }else{
                return [];
            }
        }catch (error){
            console.error("Erro ao buscar usuários:", error);
            return [];
        }
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Atalho do departamento</Form.Label>
                <p className="fst-italic opacity-75">As IAs usarão este atalho para transferir os clientes para o departamento.</p>
                <Form.Control type="text" placeholder="Atalho do departamento" value={atalho} onChange={(e) => setAtalho(e.target.value.toUpperCase().trim())} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Comentário de transferência (opcional)</Form.Label>
                <Form.Control type="text" placeholder="Comentário de transferência (opcional)" value={comentario} onChange={(e) => setComentario(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Departamento do Digisac</Form.Label>
                <AsyncSelect 
                    cacheOptions
                    defaultOptions
                    value={selectedDepartment}
                    loadOptions={loadDebounce(carregarDepartamentos)}
                    onChange={(e) => {
                        setDepartmentId(e?.value)
                        setSelectedDepartment(e)
                    }}
                    placeholder="Digite para buscar..."
                    noOptionsMessage={() => "Nenhum resultado encontrado. Digite para fazer uma pesquisa."}
                    loadingMessage={() => "Carregando..."}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Usuário para transferência direta (opcional)</Form.Label>
                <p className="fst-italic opacity-75">Se informado, as IAs transferirão o cliente para este usuário diretamente.</p>
                <AsyncSelect 
                    cacheOptions
                    defaultOptions
                    isClearable
                    value={selectedUser}
                    loadOptions={loadDebounce(carregarUsuarios)}
                    onChange={(e) => {
                        setUserId(e?.value)
                        setSelectedUser(e)
                    }}
                    placeholder="Digite para buscar..."
                    noOptionsMessage={() => "Nenhum resultado encontrado. Digite para fazer uma pesquisa."}
                    loadingMessage={() => "Carregando..."}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Departamento de confirmação de agendamento"
                    checked={dptConfirmacao}
                    onChange={() => setDptConfirmacao(!dptConfirmacao)}
                />
                <p className="fst-italic opacity-75">Se ativado, os clientes que iniciarem o fluxo de confirmação de agendamento serão direcionados para este departamento até finalizarem o fluxo.</p>
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