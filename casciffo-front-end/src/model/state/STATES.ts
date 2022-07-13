export const STATES = {
    SUBMETIDO: {code: 1, name: "Submetido", id: "SUBMETIDO", owner: "UIC"},
    VALIDACAO_CF: {code: 2, name: "Validação do CF", id: "VALIDACAO_CF", owner: "FINANCE, JURIDICAL"},
    VALIDACAO_EXTERNA: {code: 4, name: "Validação externa", id: "VALIDACAO_EXTERNA", owner: "UIC"},
    SUBMISSAO_AO_CA: {code: 5, name: "Submissão ao CA", id: "SUBMISSAO_AO_CA", owner: "UIC"},
    VALIDACAO_INTERNA_CA: {code: 6, name: "Validação interna", id: "VALIDACAO_INTERNA_CA", owner: "CA"},
    VALIDADO: {code: 7, name: "Validado", id: "VALIDADO", owner: "CA"},
    CANCELADO: {code: -1, name: "Cancelado", id: "CANCELADO", owner: "UIC"},
    COMPLETO: {code: 10, name: "Completo", id: "COMPLETO", owner: "UIC"},
    ATIVO: {code: 11, name: "Ativo", id: "ATIVO", owner: "UIC"}
}