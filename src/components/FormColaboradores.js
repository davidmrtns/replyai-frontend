import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import ApiFetch from "../utils/ApiFetch";
import { EmpresaContext } from "../contexts/EmpresaContext";
import FormColaboradorUnico from "./FormColaboradorUnico";

function FormColaboradores(){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [colabSelecionado, setColabSelecionado] = useState("");
    const [colaboradores, setColaboradores] = useState([]);

    useEffect(() => {
        if(empresa){
            setColaboradores(empresa.colaboradores || []);
        }
    }, [empresa])

    const alterarColabSelecionado = (id) => {
        if(id === "+"){
            setColabSelecionado("+");
        }else{
            var colaborador = colaboradores.find(colab => colab.id === parseInt(id));
            setColabSelecionado(colaborador);
        }
    }

    return(
        <Form>
            <h1>Colaboradores</h1>
            <Form.Group className="mb-3">
                <Form.Label>Colaboradores (selecione um colaborador para modificá-lo)</Form.Label>
                <Form.Select value={colabSelecionado?.id || colabSelecionado} onChange={(opcao) => alterarColabSelecionado(opcao.target.value)}>
                    <option>--</option>
                    {colaboradores ? colaboradores.map((colaborador) => (
                        <option value={colaborador.id}>{colaborador.nome}</option>
                    )) : ""}
                    <option value="+">Adicionar colaborador</option>
                </Form.Select>
            </Form.Group>
            {colabSelecionado ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {colabSelecionado !== "+" ?
                                (`Colaborador ${colabSelecionado.nome}`)
                            : "Novo colaborador"}
                        </Accordion.Header>
                        <Accordion.Body>
                            <FormColaboradorUnico colaborador={colabSelecionado} selecionar={(colab) => setColabSelecionado(colab)} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            : ""}
        </Form>
    );
}

export default FormColaboradores;