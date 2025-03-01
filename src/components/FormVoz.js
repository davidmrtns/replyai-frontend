import { useContext, useEffect, useState } from "react";
import { EmpresaContext } from "../contexts/EmpresaContext";
import { Button, Form, FormGroup } from "react-bootstrap";
import ApiFetch from "../utils/ApiFetch";
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function FormVoz({ voz, selecionar }){
    const apiFetch = new ApiFetch();
    const { empresa, setEmpresa } = useContext(EmpresaContext);
    const [voiceId, setVoiceId] = useState("");
    const [arquivos, setArquivos] = useState([]);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [stability, setStability] = useState(0.7);
    const [similarityBoost, setSimilarityBoost] = useState(0.7);
    const [style, setStyle] = useState(0);
    const [carregandoVozElevenLabs, setCarregandoVozElevenLabs] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [excluido, setExcluido] = useState(false);

    useEffect(() => {
        const obterVozElevenLabs = async () => {
            setCarregandoVozElevenLabs(true);

            if(voz?.id){
                var dados = await apiFetch.obterVozElevenLabs(empresa.slug, voz.id);
                if(dados){
                    setPreviewUrl(dados.preview_url);
                    setDescricao(dados.descricao);
                }else{
                    setPreviewUrl("");
                    setDescricao("");
                }
            }else{
                setPreviewUrl("");
                setDescricao("");
            }

            setCarregandoVozElevenLabs(false);
        }
        
        if(voz){
            setNome(voz.nome || "");
            setVoiceId(voz.voiceId || "");
            setStability(voz.stability || 0.7);
            setSimilarityBoost(voz.similarity_boost || 0.7);
            setStyle(voz.style || 0);

            obterVozElevenLabs();
        }
    }, [voz])
    
    const adicionarArquivo = async (event) => {
        const minDuracao = 5 * 60;
        const arquivoSelecionado = event.target.files[0];

        if(!arquivoSelecionado){
            alert("Nenhum arquivo selecionado");
            setArquivos([]);
            event.target.value = "";
            return;
        }

        if(!arquivoSelecionado.type.startsWith("audio/")){
            alert("Apenas arquivos de áudio são permitidos");
            setArquivos([]);
            event.target.value = "";
            return;
        }

        const duracao = await getAudioDuration(arquivoSelecionado)
        if(duracao < minDuracao){
            alert("O áudio deve ter pelo menos 5 minutos");
            setArquivos([]);
            event.target.value = "";
            return;
        }

        setArquivos([arquivoSelecionado]);
    }

    const getAudioDuration = (file) => {
        return new Promise((resolve, reject) => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const reader = new FileReader();
    
          reader.onload = function (event) {
            const arrayBuffer = event.target.result;
            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
              resolve(audioBuffer.duration);
            }, reject);
          };
    
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      };

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
            if(nome.trim() === ""){
                alert("Digite um nome válido para a voz");
            }else if(arquivos.length <= 0){
                alert("Você deve selecionar um arquivo de áudio com a voz que você deseja clonar");
            }else if(stability < 0 || stability > 1){
                alert("O valor de estabilidade da voz deve ser um valor entre 0 e 1");
            }else if(similarityBoost < 0 || similarityBoost > 1){
                alert("O valor de boost de similaridade da voz deve ser um valor entre 0 e 1");
            }else if(style < 0 || style > 1){
                alert("O valor de estilo da voz deve ser um valor entre 0 e 1")
            }else{
                var resposta = await apiFetch.adicionarVoz(empresa.slug, nome.trim(), descricao, stability, similarityBoost, style, arquivos);
                if(resposta && resposta.status === 200){
                    resposta = await resposta.json();
                    addVoz(resposta);
                    alert("Voz clonada com sucesso");
                }else{
                    alert("Não foi possível adicionar a voz");
                }
            }
        }else{
            var resposta = await apiFetch.editarVoz(empresa.slug, voz.id, nome, descricao, stability, similarityBoost, style);
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
            {voz !== "+" ?
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>ID da voz</Form.Label>
                        <Form.Control type="text" placeholder="ID da voz" value={voiceId} disabled />
                    </Form.Group>
                    <div className="mb-3 d-flex align-items-center">
                        {previewUrl ? 
                            <>
                                <p className="mb-0 me-2">Preview</p>
                                <audio src={previewUrl} controls className="flex-grow-1 w-100" />
                            </>
                        :
                            <p className="fst-italic opacity-75 mb-0">Essa voz não tem um áudio de preview ainda</p>
                        }
                    </div>
                </>
            : ""}
            <Form.Group className="mb-3">
                <Form.Label>Nome da voz</Form.Label>
                <Form.Control type="text" placeholder="Nome da voz" value={carregandoVozElevenLabs ? "" : nome} disabled={carregandoVozElevenLabs} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Descrição (opcional)</Form.Label>
                <Form.Control type="text" placeholder="Descrição (opcional)" value={carregandoVozElevenLabs ? "" : descricao} disabled={carregandoVozElevenLabs} onChange={(e) => setDescricao(e.target.value)} />
            </Form.Group>
            {voz === "+" ? 
                <Form.Group className="mb-3">
                    <Form.Label>Arquivo de áudio</Form.Label>
                    <Form.Control type="file" accept="audio/*" onChange={adicionarArquivo} />
                </Form.Group>
            : ""}
            <hr />
            <p className="fst-italic opacity-75">As configurações abaixo alteram o comportamento da voz gerada. Normalmente os valores padrões já são satisfatórios e não é necessário alterá-los.</p>
            <Form.Group className="mb-3">
                <Form.Label>Estabilidade</Form.Label>
                <Form.Control type="number" placeholder="Estabilidade" value={stability} onChange={(e) => setStability(e.target.value)} max="1" min="0.1" step="0.1" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Boost de similaridade</Form.Label>
                <Form.Control type="number" placeholder="Boost de similaridade" value={similarityBoost} onChange={(e) => setSimilarityBoost(e.target.value)} max="1" min="0.1" step="0.1" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Estilo</Form.Label>
                <Form.Control type="number" placeholder="Estilo" value={style} onChange={(e) => setStyle(e.target.value)} max="1" min="0.1" step="0.1" />
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