class ApiFetch{
    constructor(){
        this.urlBase = process.env.REACT_APP_API_URL || "http://localhost:8000";
    }

    async login(username, password){
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try{
            const response = await fetch(`${this.urlBase}/usuario/login`, {
                method: "post",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });

            if(response.ok){
                const data = await response.json();
                return data;
            }
        }catch{
            return "Erro";
        }
    }

    async logout(){
        var resposta;

        try{
            await fetch(`${this.urlBase}/usuario/logout`, {
                method: "post",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = false;
        }

        return resposta;
    }

    async buscarUsuarioLogado(){
        var resposta;

        try{
            const response = await fetch(`${this.urlBase}/usuario/`, {
                method: "get",
                credentials: "include"
            });

            if(response.ok){
                resposta = await response.json();
            }
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarEmpresa(nome, slug, fusoHorario, openaiApiKey){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    slug: slug,
                    fuso_horario: fusoHorario,
                    openai_api_key: openaiApiKey
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterTodasEmpresas(){
        var resposta;

        try{
            await fetch(`${this.urlBase}/empresa/`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterEmpresa(slug){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}`, {
                method: "get",
                credentials: "include"
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesBasicas(slug, nome, fusoHorario){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_basicas`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    fuso_horario: fusoHorario
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesAssistentes(slug, assistentePadrao){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_assistentes`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assistente_padrao: assistentePadrao
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarAssistente(slug, nome, assistantId, proposito, atalho, voz){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_assistentes/assistente`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    assistant_id: assistantId,
                    proposito: proposito,
                    atalho: atalho,
                    voz: voz
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarAssistente(slug, id, nome, assistantId, proposito, atalho, voz){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_assistentes/assistente`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    nome: nome,
                    assistant_id: assistantId,
                    proposito: proposito,
                    atalho: atalho,
                    voz: voz
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarVoz(slug, voiceId, stability, similarityBoost, style){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_assistentes/voz`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    voice_id: voiceId,
                    stability: stability,
                    similarity_boost: similarityBoost,
                    style: style
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarVoz(slug, id, voiceId, stability, similarityBoost, style){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_assistentes/voz`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    voice_id: voiceId,
                    stability: stability,
                    similarity_boost: similarityBoost,
                    style: style
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesMensagens(slug, tipoCliente, tempoRecall, tempoUltimoRecall, quantRecalls, ativarRecall, mensagemErroIa){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_mensagens`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tipo_cliente: tipoCliente,
                    tempo_recall_min: tempoRecall,
                    tempo_recall_final_min: tempoUltimoRecall,
                    quant_recalls: quantRecalls,
                    ativar_recall: ativarRecall,
                    mensagem_erro_ia: mensagemErroIa
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteDigisac(slug, slugDigisac, token, userId, serviceId){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_mensagens/digisac`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slug: slugDigisac,
                    token: token,
                    user_id: userId,
                    service_id: serviceId
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesDigisac(slug, slugDigisac, token, userId, serviceId){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_mensagens/digisac`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slug: slugDigisac,
                    token: token,
                    user_id: userId,
                    service_id: serviceId
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarDepartamento(slug, atalho, comentario, departmentId, userId, dptConfirmacao){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_mensagens/digisac/departamento`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    atalho: atalho,
                    comentario: comentario,
                    department_id: departmentId,
                    user_id: userId,
                    departamento_confirmacao: dptConfirmacao
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarDepartamento(slug, id, atalho, comentario, departmentId, userId, dptConfirmacao){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_mensagens/digisac/departamento`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    atalho: atalho,
                    comentario: comentario,
                    department_id: departmentId,
                    user_id: userId,
                    departamento_confirmacao: dptConfirmacao
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteEvolutionAPI(slug, apiKey, instanceName){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_mensagens/evolutionapi`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: apiKey,
                    instance_name: instanceName
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesEvolutionAPI(slug, apiKey, instanceName){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_mensagens/evolutionapi`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: apiKey,
                    instance_name: instanceName
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesAgenda(slug, tipoCliente, tipoCancelamento, ativarConfirmacao){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tipo_cliente: tipoCliente,
                    tipo_cancelamento_evento: tipoCancelamento,
                    ativar_confirmacao: ativarConfirmacao
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarAgenda(slug, endereco, atalho){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/agenda`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    endereco: endereco,
                    atalho: atalho
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarAgenda(slug, id, endereco, atalho){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/agenda`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    endereco: endereco,
                    atalho: atalho
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteOutlook(slug, clientId, tenantId, clientSecret, duracaoEvento, usuarioPadrao, horaInicial, horaFinal, fusoHorario){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/outlook`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: clientId,
                    tenant_id: tenantId,
                    client_secret: clientSecret,
                    duracao_evento: duracaoEvento,
                    usuario_padrao: usuarioPadrao,
                    hora_inicial: horaInicial,
                    hora_final: horaFinal,
                    fuso_horario: fusoHorario
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesOutlook(slug, clientId, tenantId, clientSecret, duracaoEvento, usuarioPadrao, horaInicial, horaFinal, fusoHorario){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/outlook`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: clientId,
                    tenant_id: tenantId,
                    client_secret: clientSecret,
                    duracao_evento: duracaoEvento,
                    usuario_padrao: usuarioPadrao,
                    hora_inicial: horaInicial,
                    hora_final: horaFinal,
                    fuso_horario: fusoHorario
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteGoogleCalendar(slug, projectId, privateKeyId, privateKey, clientEmail, clientId, clientX509CertUrl, apiKey, duracaoEvento, horaInicial, horaFinal, fusoHorario){
        var resposta;
        privateKey = privateKey.replace(/\r?\n/g, "\\n");

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/googlecalendar`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_id: projectId,
                    private_key_id: privateKeyId,
                    private_key: privateKey,
                    client_email: clientEmail,
                    client_id: clientId,
                    client_x509_cert_url: clientX509CertUrl,
                    api_key: apiKey,
                    duracao_evento: duracaoEvento,
                    hora_inicial: horaInicial,
                    hora_final: horaFinal,
                    fuso_horario: fusoHorario
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesGoogleCalendar(slug, projectId, privateKeyId, privateKey, clientEmail, clientId, clientX509CertUrl, apiKey, duracaoEvento, horaInicial, horaFinal, fusoHorario){
        var resposta;
        privateKey = privateKey.replace(/\r?\n/g, "\\n");

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/googlecalendar`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_id: projectId,
                    private_key_id: privateKeyId,
                    private_key: privateKey,
                    client_email: clientEmail,
                    client_id: clientId,
                    client_x509_cert_url: clientX509CertUrl,
                    api_key: apiKey,
                    duracao_evento: duracaoEvento,
                    hora_inicial: horaInicial,
                    hora_final: horaFinal,
                    fuso_horario: fusoHorario
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesCRM(slug, tipoCliente){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_crm`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tipo_cliente: tipoCliente
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteRDStation(slug, token, idFontePadrao){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_crm/rdstation`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    id_fonte_padrao: idFontePadrao
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesRDStation(slug, token, idFontePadrao){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_crm/rdstation`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    id_fonte_padrao: idFontePadrao
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarEstagioRD(slug, atalho, dealStageId, userId, estagioInicial){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_crm/rdstation/estagio`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    atalho: atalho,
                    deal_stage_id: dealStageId,
                    user_id: userId,
                    estagio_inicial: estagioInicial
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesEstagioRD(slug, id, atalho, dealStageId, userId, estagioInicial){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_crm/rdstation/estagio`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    atalho: atalho,
                    deal_stage_id: dealStageId,
                    user_id: userId,
                    estagio_inicial: estagioInicial
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesFinanceiras(slug, tipoCliente, lembrarVencimentos, cobrarInadimplentes){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_financeiras`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tipo_cliente: tipoCliente,
                    lembrar_vencimentos: lembrarVencimentos,
                    cobrar_inadimplentes: cobrarInadimplentes
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteAsaas(slug, token, rotulo, clientNumber){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_financeiras/asaas`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    rotulo: rotulo,
                    numero_cliente: clientNumber
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesAsaas(slug, token, rotulo, clientNumber){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_financeiras/asaas`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    rotulo: rotulo,
                    numero_cliente: clientNumber
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterAssistentesEmpresa(slug){
        var resposta;

        try{
            await fetch(`${this.urlBase}/empresa/${slug}/assistentes`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterMessageClient(slug){
        var resposta;

        try{
            await fetch(`${this.urlBase}/empresa/${slug}/message_client`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }
}

export default ApiFetch;