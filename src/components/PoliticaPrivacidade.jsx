import React from "react";
import { Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";

const PoliticaPrivacidade = () => {
    return (
        <Container className="p-5">
            <Card className="shadow-lg border-0 p-4 politica">
                <Card.Body>
                    <h1 className="text-center mb-4">
                        <FontAwesomeIcon icon={faShieldAlt} className="me-2" /> Política de Privacidade
                    </h1>
                    <p>
                        Bem-vindo à <strong>ReplyAI</strong>. Nossa missão é conectar o WhatsApp da sua empresa a assistentes de IA para
                        oferecer um atendimento rápido e eficiente aos seus clientes. Esta Política de Privacidade explica como coletamos,
                        usamos e protegemos suas informações.
                    </p>
                    <h3>1. Informações Coletadas</h3>
                    <p>
                        O ReplyAI coleta e armazena apenas as chaves de API dos sistemas integrados e os números de telefone dos clientes.
                        Quaisquer outros dados de conversas (threads) ficam armazenados diretamente na conta da OpenAI da empresa, sem
                        qualquer acesso ou armazenamento por parte do ReplyAI.
                    </p>
                    <h3>2. Como Coletamos seus Dados?</h3>
                    <p>
                        A coleta de dados ocorre quando:
                        <ul>
                            <li>A empresa cadastra suas chaves de API para integrar com OpenAI, ElevenLabs, Google Calendar, Outlook, RD Station CRM ou Asaas.</li>
                            <li>Um cliente envia uma mensagem via WhatsApp, registrando apenas seu número de telefone (para fins de envio de mensagem).</li>
                        </ul>
                    </p>
                    <h3>3. Direitos do Usuário</h3>
                    <p>
                        Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito de:
                        <ul>
                            <li>Acessar seus dados e solicitar uma cópia.</li>
                            <li>Corrigir informações imprecisas.</li>
                            <li>Solicitar a exclusão de seus dados armazenados.</li>
                            <li>Revogar o consentimento para uso de seus dados.</li>
                        </ul>
                    </p>
                    <h3>4. Como seus Dados são Armazenados e Protegidos?</h3>
                    <p>
                        Implementamos medidas de segurança para proteger as informações armazenadas. Todas as chaves de API são criptografadas e
                        os números de telefone são armazenados com acesso restrito. A OpenAI armazena as conversas de acordo com as configurações
                        da conta de cada empresa.
                    </p>
                    <h3>5. Compartilhamento de Dados</h3>
                    <p>
                        O ReplyAI <strong>não compartilha, vende ou negocia dados de usuários</strong> com terceiros. Os dados são usados exclusivamente
                        para permitir a comunicação entre clientes e assistentes de IA. No entanto, podemos compartilhar informações se exigido por
                        lei ou ordem judicial.
                    </p>
                    <h3>6. Uso de Cookies</h3>
                    <p>
                        O ReplyAI utiliza apenas cookies de autenticação para permitir o acesso seguro ao painel de administração da ferramenta. Esses cookies 
                        são essenciais para garantir a segurança da conta do usuário e a continuidade da sessão. Nenhum outro tipo de cookie, como rastreamento ou 
                        publicidade, é utilizado.
                    </p>
                    <h3>7. Alterações nesta Política</h3>
                    <p>
                        Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos os usuários sobre alterações significativas
                        por meio do nosso site ou e-mail cadastrado.
                    </p>
                    <h3>8. Contato</h3>
                    <p>
                        Para dúvidas ou solicitações relacionadas à sua privacidade, entre em contato conosco pelo e-mail: <a href="mailto:suporte@lmradvogados.com.br">suporte@lmradvogados.com.br</a>.
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PoliticaPrivacidade;