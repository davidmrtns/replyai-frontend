import { useEffect, useState } from 'react';
import ApiFetch from '../utils/ApiFetch';
import NavbarReplyAI from '../components/NavbarReplyAI';
import { Container, Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import type { Company } from '../types/types';

const Companies = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const apiFetch = new ApiFetch();

    const fetchCompanies = async () => {
      const companies = await apiFetch.obterTodasEmpresas();
      if (companies) {
        setCompanies(companies);
      }

      setIsLoading(false);
    };

    fetchCompanies();
  }, []);

  const accessCompany = (slug: string) => {
    navigate(slug);
  };

  return (
    <>
      <NavbarReplyAI />
      <Container className="p-4">
        {!isLoading ? (
          <Row className="g-4">
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <Col key={company.id} xs={12} sm={6} md={4} lg={3}>
                  <Card style={{ width: '100%' }}>
                    <Card.Header style={{ fontSize: '0.92em' }}>{company.name}</Card.Header>
                    <Card.Body>
                      <Card.Subtitle>{company.slug}</Card.Subtitle>
                      <Button
                        variant="primary"
                        className="mt-2"
                        onClick={() => accessCompany(company.slug)}
                      >
                        Access company
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <h3 className="text-center">No active companies found.</h3>
            )}
          </Row>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
      </Container>
    </>
  );
};

export default Companies;
