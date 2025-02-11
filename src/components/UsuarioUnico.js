import { useEffect, useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarReplyAI from "./NavbarReplyAI";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ApiFetch from "../utils/ApiFetch";
import { useLocation, useNavigate } from "react-router-dom";

function UsuarioUnico({ novoUsuario }){
    const apiFetch = new ApiFetch();
    const navigate = useNavigate();
    const location = useLocation();
    const { usuarioLogado } = useAuth();
    const [idUsuario, setIdUsuario] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [ativo, setAtivo] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [idEmpresa, setIdEmpresa] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [empresas, setEmpresas] = useState([]);
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);
    const [exibirCampoSenha, setExibirCampoSenha] = useState(false);
    const [exibirSenha, setExibirSenha] = useState(false);

    useEffect(() => {
        var dadosUsuario = location.state?.usuario;

        if(!dadosUsuario){
            if(usuarioLogado && !novoUsuario){
                dadosUsuario = usuarioLogado;
            }else{
                dadosUsuario = {}
            }
        }
        
        setIdUsuario(dadosUsuario.id || "");
        setNome(dadosUsuario.nome || "");
        setEmail(dadosUsuario.email || "");
        setAtivo(dadosUsuario.ativo || false);
        setAdmin(dadosUsuario.admin || false);
        setIdEmpresa(dadosUsuario.id_empresa || "");

        if(novoUsuario){
            setExibirCampoSenha(true);
        }else{
            setExibirCampoSenha(false);
        }
    
        setSenha("");
        setConfirmacao("");
    }, [usuarioLogado, novoUsuario, location])

    useEffect(() => {
        const buscarEmpresas = async () => {
            var dados = await apiFetch.obterTodasEmpresas();
            if(dados){
                setEmpresas(dados);
            }
        }

        buscarEmpresas();
    }, [])

    const enviar = async () => {
        setEnviado(true);
        
        if(novoUsuario){
            var resposta = await apiFetch.adicionarUsuario(nome, email, senha, confirmacao, ativo, admin, idEmpresa);
            if(resposta){
                if(resposta.status === 200){
                    alert("Usuário adicionado com sucesso");
                }else{
                    resposta = await resposta.json();
                    alert(resposta.detail);
                }
            }else{
                alert("Ocorreu um erro ao adicionar o usuário. Tente novamente")
            }
        }else{
            var resposta = await apiFetch.alterarUsuario(idUsuario, nome, email, senha, confirmacao, ativo, admin, idEmpresa);
            if(resposta){
                if(resposta.status === 200){
                    alert("Dados atualizados com sucesso");
                }else{
                    resposta = await resposta.json();
                    alert(resposta.detail);
                }
            }else{
                alert("Ocorreu um erro ao alterar os dados do usuário. Tente novamente")
            }
        }

        setEnviado(false);
    }

    const excluir = async () => {
        setExcluido(true);

        var resposta = await apiFetch.removerUsuario(idUsuario);
        if(resposta){
            if(resposta.status === 200){
                resposta = await resposta.json();
                if(resposta === true){
                    alert("Usuário excluído com sucesso");
                    navigate("/usuarios");
                }else{
                    alert("Não foi possível excluir o usuário. Tente novamente");
                }
            }else if(resposta.status === 401){
                resposta = await resposta.json();
                alert(resposta.detail);
            }
        }

        setExcluido(false);
    }

    return(
        <>
            <NavbarReplyAI />
            <Container className="p-4">
                {(novoUsuario && usuarioLogado.admin) || !novoUsuario ?
                    <Card>
                        <Card.Header>
                            <h2><FontAwesomeIcon icon={faUser} /> {novoUsuario ? "Novo usuário" : nome}</h2>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Ativar usuário"
                                        checked={ativo}
                                        onChange={() => setAtivo(!ativo)}
                                    />
                                </Form.Group>
                                {usuarioLogado.admin || novoUsuario ? 
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Usuário administrador"
                                            checked={admin}
                                            onChange={() => setAdmin(!admin)}
                                        />
                                    </Form.Group>
                                : ""}
                                {!novoUsuario ? 
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Alterar senha"
                                            checked={exibirCampoSenha}
                                            onChange={() => setExibirCampoSenha(!exibirCampoSenha)}
                                        />
                                    </Form.Group>
                                : ""}
                                {exibirCampoSenha ? 
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Senha</Form.Label>
                                            <InputGroup>
                                                <Form.Control type={exibirSenha ? "text" : "password"} placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                                                <Button variant="outline-primary" onClick={() => setExibirSenha(!exibirSenha)}>
                                                    <FontAwesomeIcon icon={exibirSenha ? faEyeSlash : faEye} />
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirmção de senha</Form.Label>
                                            <InputGroup>
                                                <Form.Control type={exibirSenha ? "text" : "password"} placeholder="Confirmação de senha" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
                                                <Button variant="outline-primary" onClick={() => setExibirSenha(!exibirSenha)}>
                                                    <FontAwesomeIcon icon={exibirSenha ? faEyeSlash : faEye} />
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                    </>
                                : ""}
                                <Form.Group className="mb-3">
                                    <Form.Label>Empresa</Form.Label>
                                    <Form.Select value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)}>
                                        {!usuarioLogado.id_empresa ? <option value="">--</option> : ""}
                                        {empresas ? empresas.map((empresa) => (
                                            <option value={empresa.id}>{empresa.nome} - {empresa.slug}</option>
                                        )) : ""}
                                    </Form.Select>
                                </Form.Group>
                                <div className="d-flex gap-2">
                                    <Button onClick={() => enviar()} disabled={enviado}>
                                        {enviado ?
                                            <Spinner animation="border" role="status" size="sm">
                                                <span className="visually-hidden">Carregando...</span>
                                            </Spinner>
                                        : "Salvar"}
                                    </Button>
                                    {!novoUsuario && idUsuario !== usuarioLogado.id ? 
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
                        </Card.Body>
                    </Card>
                :
                    <h3 className="text-center">Você não tem permissão para adicionar usuários</h3>
                }
            </Container>
        </>
    );
}

export default UsuarioUnico;