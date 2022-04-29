package isel.casciffo.casciffospringbackend.states

enum class States(val code: Int) {
    SUBMETIDO(1),NEGOCIACAO_DE_CF(2),VALIDACAO_INTERNA_DEPARTMENTS(3),
    VALIDACAO_EXTERNA(4), SUBMISSAO_AO_CA(5), VALIDACAO_INTERNA_CA(6), VALIDADO(7),
    CANCELADO(-1), COMPLETO(10), ATIVO(11);

    fun getState(name: String) : States {
        return valueOf(name)
    }
}