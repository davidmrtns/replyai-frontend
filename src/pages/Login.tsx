import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState, type SubmitEvent } from 'react';
import { Button, Container, InputGroup } from 'react-bootstrap';
import ApiFetch from '../utils/ApiFetch';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const apiFetch = new ApiFetch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = await apiFetch.login(email, password);

    if (token !== null) {
      if (token.status === true) {
        navigate('/companies');
      } else {
        alert('Error when trying to login');
        setIsLoading(false);
      }
    }

    setIsLoading(false);
  };

  return (
    <Container className="pt-4">
      <Form onSubmit={handleSubmit}>
        <h1 className="titulo">ReplyAI</h1>
        <FloatingLabel label="E-mail">
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required={true}
            className="mb-3"
          />
        </FloatingLabel>
        <InputGroup className="mb-3">
          <FloatingLabel label="Password">
            <Form.Control
              type={showPassword === true ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required={true}
            />
          </FloatingLabel>
          <Button variant="outline-primary" onClick={() => setShowPassword(!showPassword)}>
            <FontAwesomeIcon icon={showPassword === true ? faEyeSlash : faEye} />
          </Button>
        </InputGroup>
        <Button type="submit" disabled={isLoading}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
