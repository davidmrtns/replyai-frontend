import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import { EmpresaContext } from "../contexts/EmpresaContext";
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function FormMidiaUnica({ midia, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [url, setUrl] = useState("");
    const [tipo, setTipo] = useState("");
    const [mediatype, setMediatype] = useState("");
    const [nome, setNome] = useState("");
    const [atalho, setAtalho] = useState("");
    const [ordem, setOrdem] = useState(0);
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        if(midia){
            setUrl(midia.url || "");
            setTipo(midia.tipo || "");
            setMediatype(midia.mediatype || "");
            setNome(midia.nome || "");
            setAtalho(midia.atalho || "");
            setOrdem(midia.ordem || 0);
        }else{
            setUrl("");
            setTipo("");
            setMediatype("");
            setNome("");
            setAtalho("");
            setOrdem(0);
        }
    }, [midia])

    const addMidia = (novaMidia) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                midias: [...(prevEmpresa?.midias || []), novaMidia]
            }
        });

        selecionar(novaMidia);
    }

    const updMidia = (id, midiaAtualizada) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                midias: prevEmpresa.midias.map((midia) => 
                    midia.id === id
                        ? { ...midia, ...midiaAtualizada }
                        : midia
                )
            };
        });
    }

    const delMidia = (id) => {
        setEmpresa((prevEmpresa) => {
            return {
                ...prevEmpresa,
                midias: prevEmpresa.midias.filter(
                    (midia) => midia.id !== id
                )
            };
        });

       selecionar("+");
    }

    const enviar = async () => {
        setEnviado(true);
        
        if(midia === "+"){
            var resposta = await apiFetch.adicionarMidia(empresa.slug, url, tipo, mediatype, nome, atalho, ordem);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addMidia(resposta);
                alert("Mídia adicionada com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }else{
            var resposta = await apiFetch.alterarMidia(empresa.slug, midia.id, url, tipo, mediatype, nome, atalho, ordem);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                updMidia(midia.id, resposta);
                alert("Dados atualizados com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }

        setEnviado(false);
    }

    const excluir = async () => {
        setExcluido(true);
        
        var resposta = await apiFetch.removerMidia(empresa.slug, midia.id);
        if(resposta && resposta.status === 200){
            resposta = await resposta.json();
            if(resposta === true){
                delMidia(midia.id);
                alert("Mídia excluída com sucesso");
            }else{
                alert("Não foi possível excluir a mídia. Tente novamente");
            }
        }

        setExcluido(false);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>URL pública da mídia</Form.Label>
                <div className="d-flex align-items-start gap-2">
                    <Form.Control type="text" placeholder="URL pública da mídia" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-grow-1" />
                    {tipo ?
                        tipo === "image" ?
                            <img src={url} className="img-thumbnail img-fluid" style={{ width: "200px", height: "auto" }} />
                        : tipo === "video" ?
                            <video src={url} width={200} controls />
                        : tipo === "audio" ?
                            <audio src={url} controls />
                        : ""
                    : ""}
                </div>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tipo da mídia</Form.Label>
                <Form.Select value={tipo} onChange={(opcao) => setTipo(opcao.target.value)}>
                    <option value="image">Imagem</option>
                    <option value="audio">Áudio</option>
                    <option value="video">Vídeo</option>
                    <option value="document">Documento</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Mimetype/Mediatype</Form.Label>
                <Form.Control type="text" placeholder="Mimetype/Mediatype" value={mediatype} onChange={(e) => setMediatype(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Nome do arquivo</Form.Label>
                <Form.Control type="text" placeholder="Nome do arquivo" value={nome} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Atalho</Form.Label>
                <Form.Control type="text" placeholder="Atalho" value={atalho} onChange={(e) => setAtalho(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ordem do arquivo</Form.Label>
                <Form.Control type="number" placeholder="Ordem do arquivo" value={ordem} onChange={(e) => setOrdem(e.target.value)} />
            </Form.Group>
            <div className="d-flex gap-2">
                <Button onClick={() => enviar()} disabled={enviado}>
                    {enviado ?
                        <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                    : "Salvar"}
                </Button>
                {midia !== "+" ?
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

export default FormMidiaUnica;