import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import ApiFetch from "../utils/ApiFetch";
import { EmpresaContext } from "../contexts/EmpresaContext";
import FormMidiaUnica from "./FormMidiaUnica";

function FormMidias(){
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [midiaSelecionada, setMidiaSelecionada] = useState("");
    const [midias, setMidias] = useState([]);

    useEffect(() => {
        if(empresa){
            setMidias(empresa.midias || []);
        }
    }, [empresa])

    const alterarMidiaSelecionada = (id) => {
        if(id === "+"){
            setMidiaSelecionada("+");
        }else{
            var midia = midias.find(mid => mid.id === parseInt(id));
            setMidiaSelecionada(midia);
        }
    }

    return(
        <Form>
            <h1>Mídias</h1>
            <p className="fst-italic opacity-75">As mídias abaixo poderão ser enviadas pelos seus assistentes de IA durante o fluxo de atendimento deles.</p>
            <Form.Group className="mb-3">
                <Form.Label>Mídias (selecione uma mídia para modificá-la)</Form.Label>
                <Form.Select value={midiaSelecionada?.id || midiaSelecionada} onChange={(opcao) => alterarMidiaSelecionada(opcao.target.value)}>
                    <option>--</option>
                    <option value="+">+ Adicionar mídia</option>
                    {midias ? midias.map((midia) => (
                        <option value={midia.id}>{midia.nome}</option>
                    )) : ""}
                </Form.Select>
            </Form.Group>
            {midiaSelecionada ?
                <Accordion className="pb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {midiaSelecionada !== "+" ?
                                (`Mídia ${midiaSelecionada.nome}`)
                            : "Nova mídia"}
                        </Accordion.Header>
                        <Accordion.Body>
                            <FormMidiaUnica midia={midiaSelecionada} selecionar={(mid) => setMidiaSelecionada(mid)} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            : ""}
        </Form>
    );
}

export default FormMidias;