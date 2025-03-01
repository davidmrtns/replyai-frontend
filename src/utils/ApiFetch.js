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
            }else if(response.status === 401){
                const errorData = await response.json();
                alert(errorData.detail || "Não foi possível fazer login com essas credenciais. Verifique se os dados estão corretos e se você tem acesso a esse sistema");
                return null;
            }
        }catch{
            return null;
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

    async adicionarUsuario(nome, email, senha, confirmacao, usuarioAtivo, admin, idEmpresa){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/usuario/`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha: senha,
                    confirmacao_senha: confirmacao,
                    usuario_ativo: usuarioAtivo,
                    admin: admin,
                    id_empresa: idEmpresa
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async alterarUsuario(id, nome, email, senha, confirmacao, usuarioAtivo, admin, idEmpresa){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/usuario/`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    nome: nome,
                    email: email,
                    senha: senha,
                    confirmacao_senha: confirmacao,
                    usuario_ativo: usuarioAtivo,
                    admin: admin,
                    id_empresa: idEmpresa
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async removerUsuario(id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/usuario/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarUsuarios(cursor, limite){
        var resposta;
        let url = `${this.urlBase}/usuario/todos?limit=${limite}`

        if(cursor){
            url += `&cursor=${cursor}`;
        }

        try{
            resposta = await fetch(url, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarEmpresa(nome, slug, fusoHorario, empresaAtiva, openaiApiKey, elevenLabsApiKey){
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
                    empresa_ativa: empresaAtiva,
                    openai_api_key: openaiApiKey,
                    elevenlabs_api_key: elevenLabsApiKey
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

    async editarInformacoesBasicas(slug, nome, fusoHorario, empresaAtiva, openaiApiKey, elevenLabsApiKey){
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
                    fuso_horario: fusoHorario,
                    empresa_ativa: empresaAtiva,
                    openai_api_key: openaiApiKey,
                    elevenlabs_api_key: elevenLabsApiKey
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarColaborador(slug, nome, apelido, departamento){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_basicas/colaborador`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    apelido: apelido,
                    departamento: departamento
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async alterarColaborador(slug, id, nome, apelido, departamento){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_basicas/colaborador`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    nome: nome,
                    apelido: apelido,
                    departamento: departamento
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async removerColaborador(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_basicas/colaborador/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarMidia(slug, atalho, ordem, arquivo){
        var resposta;
        const formData = new FormData();

        formData.append("atalho", atalho);
        formData.append("ordem", ordem);
        formData.append("arquivo", arquivo);

        try{
            resposta = await fetch(`${this.urlBase}/midia/${slug}`, {
                method: "post",
                credentials: "include",
                body: formData
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async alterarMidia(slug, id, atalho, ordem){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/midia/${slug}/${id}`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    atalho: atalho,
                    ordem: ordem
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async removerMidia(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/midia/${slug}/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
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

    async adicionarAssistente(slug, nome, instrucoes, proposito, atalho, voz){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/assistente/${slug}/`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    instrucoes: instrucoes,
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

    async editarAssistente(slug, id, nome, instrucoes, proposito, atalho, voz){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/assistente/${slug}/${id}`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    instrucoes: instrucoes,
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

    async removerAssistente(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/assistente/${slug}/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarVoz(slug, nome, descricao, stability, similarityBoost, style, arquivos){
        var resposta;
        const formData = new FormData();

        formData.append("nome", nome);
        formData.append("descricao", descricao);
        formData.append("stability", stability);
        formData.append("similarity_boost", similarityBoost);
        formData.append("style", style);

        arquivos.forEach((arquivo, index) => {
            formData.append("arquivos", arquivo);
        });

        try{
            resposta = await fetch(`${this.urlBase}/voz/${slug}`, {
                method: "post",
                credentials: "include",
                body: formData
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarVoz(slug, id, nome, descricao, stability, similarityBoost, style){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/voz/${slug}/${id}`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    descricao: descricao,
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

    async removerVoz(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/voz/${slug}/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesMensagens(slug, tipoCliente, tempoRecall, tempoUltimoRecall, quantRecalls, ativarRecall, ativarRecallConfirmacao, mensagemErroIa){
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
                    ativar_recall_confirmacao: ativarRecallConfirmacao,
                    mensagem_erro_ia: mensagemErroIa
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteDigisac(slug, slugDigisac, token){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/digisac/${slug}`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slug: slugDigisac,
                    token: token
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
            resposta = await fetch(`${this.urlBase}/digisac/${slug}`, {
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
            resposta = await fetch(`${this.urlBase}/digisac/${slug}/departamentos`, {
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
            resposta = await fetch(`${this.urlBase}/digisac/${slug}/departamentos/${id}`, {
                method: "put",
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

    async removerDepartamento(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/digisac/${slug}/departamentos/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarClienteEvolutionAPI(slug, nomeInstancia){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/evolutionapi/${slug}`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome_instancia: nomeInstancia
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesAgenda(slug, tipoCliente, tipoCancelamento, ativarConfirmacao, duracaoEvento, horaInicioAgenda, horaFinalAgenda){
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
                    ativar_confirmacao: ativarConfirmacao,
                    duracao_evento: duracaoEvento,
                    hora_inicio_agenda: horaInicioAgenda,
                    hora_final_agenda: horaFinalAgenda
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
            resposta = await fetch(`${this.urlBase}/agenda/${slug}`, {
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
            resposta = await fetch(`${this.urlBase}/agenda/${slug}/${id}`, {
                method: "put",
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

    async removerAgenda(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/agenda/${slug}/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarFusosPytz(){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/agenda/fusos`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json());
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesOutlook(slug, fusoHorario){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/outlook`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fuso_horario: fusoHorario
                })
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesGoogleCalendar(slug, fusoHorario){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_agenda/googlecalendar`, {
                method: "put",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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

    async removerEstagioRD(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_crm/rdstation/estagio/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async editarInformacoesFinanceiras(slug, tipoCliente, lembrarVencimentos, enviarBoletoVencimentos, cobrarInadimplentes){
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
                    enviar_boletos_vencimentos: enviarBoletoVencimentos,
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

    async editarInformacoesClienteAsaas(slug, token, rotulo, clientNumber){
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

    async removerClienteAsaas(slug, id){
        var resposta;

        try{
            resposta = await fetch(`${this.urlBase}/empresa/${slug}/informacoes_financeiras/asaas/${id}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
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

    async obterInstrucoes(slug, id){
        var resposta;

        try{
            await fetch(`${this.urlBase}/assistente/${slug}/${id}`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterVozElevenLabs(slug, id){
        var resposta;

        try{
            await fetch(`${this.urlBase}/voz/${slug}/${id}`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async criarInstanciaEvolution(slug, nomeInstancia, webhook){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}`, {
                method: "post",
                credentials: "include",
                body: JSON.stringify({
                    nome_instancia: nomeInstancia,
                    webhook_url: webhook
                })
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterInstanciaEvolution(slug, apiKey){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}/${apiKey}`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async conectarInstanciaEvolution(slug, apiKey){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}/${apiKey}/conectar`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async reiniciarInstanciaEvolution(slug, apiKey){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}/${apiKey}/reiniciar`, {
                method: "put",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async desligarInstanciaEvolution(slug, apiKey){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}/${apiKey}/desligar`, {
                method: "delete",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async checarConexaoInstanciaEvolution(slug, apiKey){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}/${apiKey}/checar-conexao`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarWebhookEvolutionAPI(slug, apiKey, webhookUrl, habilitado){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}/${apiKey}/webhook`, {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    webhook_url: webhookUrl,
                    habilitado: habilitado
                })
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarWebhooksEvolutionAPI(slug, apiKey){
        var resposta;

        try{
            await fetch(`${this.urlBase}/evolutionapi/${slug}/${apiKey}/webhook`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarServicosDigisac(slug, pagina, nome, id){
        var resposta;

        try{
            await fetch(`${this.urlBase}/digisac/${slug}/servicos?pagina=${pagina}&nome=${nome}&id=${id}`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarUsuariosDigisac(slug, pagina, nome, id){
        var resposta;

        try{
            await fetch(`${this.urlBase}/digisac/${slug}/usuarios?pagina=${pagina}&nome=${nome}&id=${id}`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarDepartamentosDigisac(slug, pagina, nome, id){
        var resposta;

        try{
            await fetch(`${this.urlBase}/digisac/${slug}/departamentos?pagina=${pagina}&nome=${nome}&id=${id}`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterLinkMicrosoft(slug){
        var resposta;

        try{
            await fetch(`${this.urlBase}/microsoft/${slug}/auth-link`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarFusosOutlook(slug){
        var resposta;

        try{
            await fetch(`${this.urlBase}/microsoft/${slug}/timezones`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterLinkGoogle(slug){
        var resposta;

        try{
            await fetch(`${this.urlBase}/google/${slug}/auth-link`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }
}

export default ApiFetch;