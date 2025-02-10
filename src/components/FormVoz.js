import { useContext, useEffect, useState } from "react";
import { EmpresaContext } from "../contexts/EmpresaContext";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function FormVoz({ voz, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [voiceId, setVoiceId] = useState("");
    const [stability, setStability] = useState("");
    const [similarityBoost, setSimilarityBoost] = useState("");
    const [style, setStyle] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        if(voz){
            setVoiceId(voz.voiceId || "");
            setStability(voz.stability || "");
            setSimilarityBoost(voz.similarity_boost || "");
            setStyle(voz.style || "");
        }
    }, [voz])
    
    const addVoz = (novaVoz) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                vozes: [...(prevEmpresa?.vozes || []), novaVoz]
            }
        });

        selecionar(novaVoz);
    }

    const updVoz = (id, vozAtualizada) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                vozes: prevEmpresa.vozes.map((voz) => 
                    voz.id === id
                        ? { ...voz, ...vozAtualizada }
                        : voz
                )
            };
        });
    }

    const delVoz = (id) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                vozes: prevEmpresa.vozes.filter(
                    (voz) => voz.id !== id
                )
            };
        });

       selecionar("+");
    }

    const enviar = async () => {
        setEnviado(true);

        if(voz === "+"){
            var resposta = await apiFetch.adicionarVoz(empresa.slug, voiceId, stability, similarityBoost, style);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addVoz(resposta);
                alert("Voz adicionada com sucesso");
            }else{
                alert("Não foi possível adicionar a voz");
            }
        }else{
            var resposta = await apiFetch.editarVoz(empresa.slug, voz.id, voiceId, stability, similarityBoost, style);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updVoz(voz.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro ao atualizar os dados");
            }
        }

        setEnviado(false);
    }

    const excluir = async () => {
        setExcluido(true);
        
        var resposta = await apiFetch.removerVoz(empresa.slug, voz.id);
        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            if(resposta === true){
                delVoz(voz.id);
                alert("Voz excluída com sucesso");
            }else{
                alert("Não foi possível excluir a voz. Tente novamente");
            }
        }

        setExcluido(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>ID da voz</Form.Label>
                <Form.Control type="text" placeholder="ID da voz" value={voiceId} onChange={(e) => setVoiceId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Estabilidade</Form.Label>
                <Form.Control type="number" placeholder="Estabilidade" value={stability} onChange={(e) => setStability(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Boost de similaridade</Form.Label>
                <Form.Control type="number" placeholder="Boost de similaridade" value={similarityBoost} onChange={(e) => setSimilarityBoost(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Estilo</Form.Label>
                <Form.Control type="number" placeholder="Estilo" value={style} onChange={(e) => setStyle(e.target.value)} />
            </Form.Group>
            <div className="d-flex gap-2">
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : "Salvar"}
                </Button>
                {voz !== "+" ? 
                    <Button onClick={() => excluir()} className="btn-danger">
                        {excluido ?
                            <Spinner animation="border" role="status" size="sm">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner>
                        :
                            <FontAwesomeIcon icon={faTrash} />
                        }
                    </Button>
                : ""}
            </div>
        </Form>
    );
}

export default FormVoz;