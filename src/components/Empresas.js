import { useEffect, useState } from "react";
import ApiFetch from "../utils/ApiFetch";
import NavbarReplyAI from "./NavbarReplyAI";
import { Container } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";

function Empresas(){
    const apiFetch = new ApiFetch();
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const buscarEmpresas = async () => {
            var dados = await apiFetch.obterTodasEmpresas();
            if(dados){
                setEmpresas(dados);
            }
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
                <Row className="g-4">
                    {empresas.map((empresa) => (
                        <Col key={empresa.slug} xs={12} sm={6} md={4} lg={3}>
                            <Card style={{ width: '100%' }}>
                                <Card.Header style={{ fontSize: '0.92em' }}>{empresa.nome}</Card.Header>
                                <Card.Body>
                                    <Card.Subtitle>{empresa.slug}</Card.Subtitle>
                                    <Button variant="primary" className="mt-2" onClick={() => acessarEmpresa(empresa.slug)}>Ver empresa</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default Empresas;