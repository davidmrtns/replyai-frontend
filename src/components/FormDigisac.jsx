import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import FormDeptDigisac from "./FormDeptDigisac";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { EmpresaContext } from "../contexts/EmpresaContext";
import AsyncSelect from "react-select/async";

function FormDigisac(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [digisacClient, setDigisacClient] = useState("");
    const [departamentos, setDepartamentos] = useState("");
    const [deptSelecionado, setDeptSelecionado] = useState(null);
    const [slugDigisac, setSlugDigisac] = useState("");
    const [tokenDigisac, setTokenDigisac] = useState("");
    const [defaultUserId, setDefaultUserId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDefaultUser, setSelectedDefaultUser] = useState(null);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        if(empresa){
            setDigisacClient(empresa.digisac_client[0]);
        }
    }, [empresa])

    useEffect(() => {
        if(digisacClient){
            setSlugDigisac(digisacClient.digisacSlug);
            setTokenDigisac(digisacClient.digisacToken);
            setDefaultUserId(digisacClient.digisacDefaultUser);
            setServiceId(digisacClient.service_id);
            setDepartamentos(digisacClient.departamentos);
            carregarServicoInicial(digisacClient.service_id);
            carregarUsuarioPadraoInicial(digisacClient.digisacDefaultUser);
        }
    }, [digisacClient])

    const enviar = async () => {
        setEnviado(true);
        var resposta = null;

        if(digisacClient){
            resposta = await apiFetch.editarInformacoesDigisac(empresa.slug, slugDigisac, tokenDigisac, defaultUserId, serviceId);
        }else{
            resposta = await apiFetch.adicionarClienteDigisac(empresa.slug, slugDigisac, tokenDigisac);
        }

        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            setEmpresa((prevEmpresa) => {
                return {
                    ...prevEmpresa,
                    digisac_client: [resposta]
                }
            });
            
            if(digisacClient){
                alert("Dados atualizados com sucesso");
            }else{
                alert("Conexão com Digisac criada com sucesso");
            }
        }else{
            alert("Ocorreu um erro");
        }

        setEnviado(false);
    }

    const alterarDeptSelecionado = (id) => {
        if(id === "+"){
            setDeptSelecionado("+");
        }else{
            var departamento = departamentos.find(dpt => dpt.id === parseInt(id));
            setDeptSelecionado(departamento);
        }
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

    const carregarServicoInicial = async (id) => {
        if (!id) return;

        try{
            var dados = await apiFetch.listarServicosDigisac(empresa.slug, 1, "", id);
            if(dados){
                var servico = dados.data[0];

                setSelectedService({
                    value: servico.id,
                    label: servico.name
                });
            }
        }catch (error){
            console.error("Erro ao buscar serviços:", error);
        }
    }

    const carregarUsuarioPadraoInicial = async (id) => {
        if (!id) return;

        try{
            var dados = await apiFetch.listarUsuariosDigisac(empresa.slug, 1, "", id);
            if(dados){
                var servico = dados.data[0];

                setSelectedDefaultUser({
                    value: servico.id,
                    label: servico.name
                });
            }
        }catch (error){
            console.error("Erro ao buscar usuários:", error);
        }
    }

    const carregarServicos = async (input) => {
        if(input.length < 1){
            return [];
        }

        try{
            var dados = await apiFetch.listarServicosDigisac(empresa.slug, 1, input, "");
            if(dados){
                const opcoesFormatadas = dados.data.map((servico) => ({
                    value: servico.id,
                    label: servico.name
                }));

                return opcoesFormatadas;
            }else{
                return [];
            }
        }catch (error){
            console.error("Erro ao buscar serviços:", error);
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
            console.error("Erro ao buscar serviços:", error);
            return [];
        }
    }
    
    return(
        <>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Slug do Digisac</Form.Label>
                    <p className="fst-italic opacity-75">Parte da URL de acesso do Digisac que vem depois de <strong>https://</strong> e antes de <strong>.digisac.me</strong></p>
                    <Form.Control type="text" placeholder="Slug do Digisac" value={slugDigisac} onChange={(e) => setSlugDigisac(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Token do Digisac</Form.Label>
                    <p className="fst-italic opacity-75">Insira o token de integração obtido do Digisac em Conta {`>`} API {`>`} Tokens de acesso pessoal</p>
                    <Form.Control type="text" placeholder="Token do Digisac" value={tokenDigisac} onChange={(e) => setTokenDigisac(e.target.value)} />
                </Form.Group>
                {digisacClient ? 
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuário padrão</Form.Label>
                            <p className="fst-italic opacity-75">Usuário responsável por realizar as transferências automatizadas entre departamentos</p>
                            <AsyncSelect 
                                cacheOptions
                                defaultOptions
                                value={selectedDefaultUser}
                                loadOptions={loadDebounce(carregarUsuarios)}
                                onChange={(e) => {
                                    setDefaultUserId(e?.value)
                                    setSelectedDefaultUser(e)
                                }}
                                placeholder="Digite para buscar..."
                                noOptionsMessage={() => "Nenhum resultado encontrado. Digite para fazer uma pesquisa."}
                                loadingMessage={() => "Carregando..."}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Conexão</Form.Label>
                            <AsyncSelect 
                                cacheOptions
                                defaultOptions
                                value={selectedService}
                                loadOptions={loadDebounce(carregarServicos)}
                                onChange={(e) => {
                                    setServiceId(e?.value)
                                    setSelectedService(e)
                                }}
                                placeholder="Digite para buscar..."
                                noOptionsMessage={() => "Nenhum resultado encontrado. Digite para fazer uma pesquisa."}
                                loadingMessage={() => "Carregando..."}
                            />
                        </Form.Group>
                        <hr />
                        <p className="fst-italic opacity-75">Os departamentos listados abaixo referem-se aos departamentos que você cadastrou e para os quais as IAs podem fazer transferências. Pode ser que nem todos os departamentos do seu Digisac estejam listados aqui.</p>
                        <Form.Group className="mb-3">
                            <Form.Label>Departamentos (selecione um departamento para modificá-lo)</Form.Label>
                            <Form.Select onChange={(opcao) => alterarDeptSelecionado(opcao.target.value)}>
                                <option>--</option>
                                <option value="+">+ Adicionar departamento</option>
                                {departamentos ? departamentos.map((departamento) => (
                                    <option value={departamento.id}>{departamento.atalho}</option>
                                )) : ""}
                            </Form.Select>
                        </Form.Group>
                        {deptSelecionado ?
                            <Accordion className="pb-3">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        Departamento {deptSelecionado.atalho}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <FormDeptDigisac departamento={deptSelecionado} selecionar={(dpt) => setDeptSelecionado(dpt)} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        : ""}
                    </>
                : ""}
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : digisacClient ? "Salvar" : "Adicionar"}
                </Button>
            </Form>
        </>
    );
}

export default FormDigisac;