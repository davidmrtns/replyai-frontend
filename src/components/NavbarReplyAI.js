import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import ApiFetch from '../utils/ApiFetch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactComponent as ReplyAILogo } from '../replyai-logo.svg';

function NavbarReplyAI(){
    const apiFetch = new ApiFetch();
    const navigate = useNavigate();
    const { usuarioLogado } = useAuth() || {};

    const deslogar = async () => {
        var resposta = await apiFetch.logout();
        if(resposta){
            navigate("/login");
        }
    }
    
    return(
        <Navbar expand="lg" className="navbar-replyai fixed-top" variant="dark">
            <Container fluid>
                <Navbar.Brand href="/" className="titulo"><ReplyAILogo className="logo" /> ReplyAI</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
                        <Nav.Link href="/empresas">Todas empresas</Nav.Link>
                        {!usuarioLogado?.id_empresa ? <Nav.Link href="/nova-empresa">Nova empresa</Nav.Link> : ""}
                        {usuarioLogado?.admin ? 
                            <>
                                <Nav.Link href="/usuarios">Todos usuários</Nav.Link> 
                                <Nav.Link href="/novo-usuario">Novo usuário</Nav.Link> 
                            </>
                        : ""}
                    </Nav>
                    <div className="d-flex gap-2">
                        <Button variant="outline-light" onClick={() => navigate("/usuario")}>
                            <FontAwesomeIcon icon={faUser} />
                        </Button>
                        <Button variant="outline-light" onClick={() => deslogar()}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarReplyAI;