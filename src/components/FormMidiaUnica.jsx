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
    const [arquivos, setArquivos] = useState([]);
    const [url, setUrl] = useState("");
    const [mediatype, setMediatype] = useState("");
    const [atalho, setAtalho] = useState("");
    const [ordem, setOrdem] = useState(0);
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        if(midia){
            setUrl(midia.url || "");
            setMediatype(midia.mediatype || "");
            setAtalho(midia.atalho || "");
            setOrdem(midia.ordem || 0);
        }else{
            setUrl("");
            setMediatype("");
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
            var resposta = await apiFetch.adicionarMidia(empresa.slug, atalho, ordem, arquivos[0]);
            if(resposta && resposta.status === 200){
                resposta = await resposta.json();
                addMidia(resposta);
                alert("Mídia adicionada com sucesso");
            }else{
                alert("Ocorreu um erro");
            }
        }else{
            var resposta = await apiFetch.alterarMidia(empresa.slug, midia.id, atalho, ordem);
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

    const adicionarArquivo = async (event) => {
        const tamanhoMaximoMidia = 16 * 1024 * 1024;
        const tamanhoMaximoDocumento = 2 * 1024 * 1024 * 1024;
        const tiposPermitidosMidia = ["image/", "audio/", "video/"];
        const arquivoSelecionado = event.target.files[0];

        if(!arquivoSelecionado){
            alert("Nenhum arquivo selecionado");
            setArquivos([]);
            event.target.value = "";
            return;
        }

        const tipoArquivo = arquivoSelecionado.type;
        const deveValidarTamanho = tiposPermitidosMidia.some((tipo) => tipoArquivo.startsWith(tipo));

        if(deveValidarTamanho && arquivoSelecionado.size > tamanhoMaximoMidia){
            alert("O arquivo selecionado excede o limite de 16MB.");
            setArquivos([]);
            event.target.value = "";
            return;
        }

        if(arquivoSelecionado.size > tamanhoMaximoDocumento){
            alert("O arquivo selecionado excede o limite de 2GB.");
            setArquivos([]);
            event.target.value = "";
            return;
        }

        setArquivos([arquivoSelecionado]);
    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label className="d-block">Mídia</Form.Label>
                {midia === "+" ? 
                    <Form.Control type="file" onChange={adicionarArquivo} /> 
                : 
                    <div className="d-flex flex-column gap-2">
                        {mediatype?.startsWith("image/") ? 
                            <img className="rounded border border-1" src={url} width={200} /> 
                        : mediatype?.startsWith("audio/") ? 
                            <audio controls src={url} />
                        : mediatype?.startsWith("video/") ? 
                            <video controls className="rounded border border-1" src={url} width={200} />
                        :
                            <p className="fst-italic opacity-75 mb-0">Esse arquivo não tem uma visualização. <a href={url} target="_blank">Baixar</a></p>
                        }
                    </div>
                }
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Atalho</Form.Label>
                <p className="fst-italic opacity-75">As IAs poderão enviar a sua mídia utilizando este atalho. Caso queira enviar vários arquivos no mesmo comando, insira um atalho já existente.</p>
                <Form.Control type="text" placeholder="Atalho" value={atalho} onChange={(e) => setAtalho(e.target.value.toUpperCase().trim())} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ordem do arquivo</Form.Label>
                <p className="fst-italic opacity-75">A ordem é utilizada para envios de múltiplos arquivos de mesmo código de atalho.</p>
                <Form.Control type="number" placeholder="Ordem do arquivo" value={ordem} onChange={(e) => setOrdem(e.target.value)} min="0" step="1" />
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