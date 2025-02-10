import { useEffect, useState } from "react";
import ApiFetch from "../utils/ApiFetch";
import NavbarReplyAI from "./NavbarReplyAI";
import { Container } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';

function Empresas(){
    const apiFetch = new ApiFetch();
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarEmpresas = async () => {
            var dados = await apiFetch.obterTodasEmpresas();
            if(dados){
                setEmpresas(dados);
            }

            setCarregando(false);
        }

        buscarEmpresas();
    }, [])

    const acessarEmpresa = (slug) => {
        navigate(slug);
    }

    return(
        <>
            <NavbarReplyAI />
            <Container className="p-4">
                {!carregando ? 
                    <Row className="g-4">
                        {empresas && empresas.length > 0 ?
                            empresas.map((empresa) => (
                                <Col key={empresa.slug} xs={12} sm={6} md={4} lg={3}>
                                    <Card style={{ width: '100%' }}>
                                        <Card.Header style={{ fontSize: '0.92em' }}>{empresa.nome}</Card.Header>
                                        <Card.Body>
                                            <Card.Subtitle>{empresa.slug}</Card.Subtitle>
                                            <Button variant="primary" className="mt-2" onClick={() => acessarEmpresa(empresa.slug)}>Ver empresa</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        : 
                            <h3 className="text-center">Nenhuma empresa ativa a qual você tenha acesso foi encontrada</h3>
                        }
                    </Row>
                :
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                        <Spinner animation="border" role="status" size="lg">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    </div>
                }
            </Container>
        </>
    );
}

export default Empresas;