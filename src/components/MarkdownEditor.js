import { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownEditor = ({ instrucoes, setInstrucoes }) => {
    const textareaRef = useRef(null);
    const previewRef = useRef(null);
    const [height, setHeight] = useState("200px");

    // Atualiza a altura da prévia sempre que a altura do textarea muda
    const syncHeight = () => {
        if (textareaRef.current) {
            const newHeight = textareaRef.current.clientHeight + "px";
            setHeight(newHeight);
        }
    };

    useEffect(() => {
        syncHeight();
    }, [instrucoes]);

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            {/* Textarea de Markdown */}
            <div style={{ flex: 1 }}>
                <Form.Group className="mb-3">
                    <Form.Label>Instruções (Markdown)</Form.Label>
                    <Form.Control
                        as="textarea"
                        ref={textareaRef}
                        placeholder="Digite suas instruções em Markdown..."
                        value={instrucoes}
                        onChange={(e) => setInstrucoes(e.target.value)}
                        onInput={syncHeight}
                        onMouseUp={syncHeight}
                        rows={10}
                        style={{
                            width: "100%",
                            minHeight: "150px",
                            resize: "vertical", // Evita redimensionamento manual
                        }}
                    />
                </Form.Group>
            </div>

            {/* Prévia do Markdown */}
            <div
                ref={previewRef}
                style={{
                    flex: 1,
                    marginTop: 30,
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "5px",
                    backgroundColor: "#f8f9fa",
                    overflowY: "auto",
                    height: height, // Sincroniza com o textarea
                    minHeight: "150px",
                    whiteSpace: "pre-wrap"
                }}
            >
                <h5>Prévia:</h5>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{instrucoes}</ReactMarkdown>
            </div>
        </div>
    );
};

export default MarkdownEditor;