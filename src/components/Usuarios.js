import { Container, Row, Col} from "react-bootstrap";
import { Form } from "react-bootstrap";
import NavbarReplyAI from "./NavbarReplyAI";
import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ApiFetch from "../utils/ApiFetch";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faRotateLeft, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Usuarios(){
    const apiFetch = new ApiFetch();
    const navigate = useNavigate();
    const { usuarioLogado } = useAuth();
    const [usuarios, setUsuarios] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [limite, setLimite] = useState(10);
    const [cursor, setCursor] = useState(0);

    useEffect(() => {
        setCarregando(true);
        
        const buscarUsuarios = async () => {
            var resposta = await apiFetch.listarUsuarios(cursor, limite);
            if(resposta.status === 200){
                resposta = await resposta.json();
                setUsuarios(resposta);
            }

            setCarregando(false);
        }

        buscarUsuarios();
    }, [cursor, limite])

    const acessarUsuario = (usuario) => {
        navigate(`/usuario`, { state: { usuario } });
    }

    return(
        <>
            <NavbarReplyAI />
            <Container className="p-4">
            {usuarioLogado.admin ? 
                <>
                    <Form className="d-flex flex-row align-items-center justify-content-center w-100 gap-2 pb-4">
                        <Button onClick={() => setCursor("")}>
                            <FontAwesomeIcon icon={faRotateLeft} />
                        </Button>
                        <Form.Group>
                            <Form.Select value={limite} onChange={(e) => setLimite(parseInt(e.target.value))}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </Form.Select>
                        </Form.Group>
                        <Button disabled={!usuarios?.has_more} onClick={() => setCursor(usuarios?.next_cursor)}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </Button>
                    </Form>
                    {!carregando ? 
                        <>
                            <Row className="g-4">
                                {usuarios && usuarios.data?.length > 0 ?
                                    usuarios.data.map((usuario) => (
                                        <Col key={usuario.id} xs={12} sm={6} md={4} lg={3}>
                                            <Card style={{ width: '100%' }}>
                                                <Card.Header style={{ fontSize: '0.92em' }}>
                                                    {usuario.nome}
                                                </Card.Header>
                                                <Card.Body>
                                                    <Card.Subtitle>{usuario.email}</Card.Subtitle>
                                                    <p className="mb-0">{usuario.admin ? "Administrador" : "Usuário padrão"}</p>
                                                    <Button variant="primary" className="mt-2" onClick={() => acessarUsuario(usuario)}>Ver usuário</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                : 
                                    <h3 className="text-center">Nenhum usuário foi encontrado</h3>
                                }
                            </Row>
                        </>
                    : 
                        <div className="d-flex flex-column justify-content-center align-items-center h-100">
                            <Spinner animation="border" role="status" size="lg">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner>
                        </div>
                    }
                </>
            : 
                <h3 className="text-center">Você não tem permissão para acessar usuários</h3>
            }
            </Container>
        </>
    );
}

export default Usuarios;