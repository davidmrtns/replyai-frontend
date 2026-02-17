import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

function AuthFeedback({ status }){
    useEffect(() => {
        document.body.style.backgroundColor = status === "success" ? "green" : "red";

        return () => {
            document.body.style.backgroundColor = "";
        };
    }, [status]);


    return (
        <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
            <h2>
                {status === "success" ?
                    <>
                        <FontAwesomeIcon icon={faSquareCheck} /> Autenticação realizada com sucesso!
                    </>
                : status === "failed" ? 
                    <>
                        <FontAwesomeIcon icon={faSquareXmark} /> Falha na autenticação!
                    </>
                : ""}
            </h2>
            <p>Você pode fechar esta janela.</p>
        </div>
    );
}

export default AuthFeedback;