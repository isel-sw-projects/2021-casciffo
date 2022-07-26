package isel.casciffo.casciffospringbackend.states.state

import kotlin.math.abs

enum class States(val code: Int) {
    SUBMETIDO(1),VALIDACAO_CF(2),VALIDACAO_INTERNA_DEPARTMENTS(3),
    VALIDACAO_EXTERNA(4), SUBMISSAO_AO_CA(5), VALIDACAO_INTERNA_CA(6), VALIDADO(7),
    CANCELADO(Int.MIN_VALUE), COMPLETO(10), ATIVO(11);

    fun getNextState(): States? {
        return values().find { (it.code - code) == 1 }
    }

    fun getPrevState(): States? {
        val nextState = values().filter { (it.code - this.code) == -1 }

        return nextState.ifEmpty { listOf(null) }[0]
    }

    fun isNextStateValid(nextState: States): Boolean {
        return abs(nextState.code - this.code) == 1 || nextState == CANCELADO
    }

    fun isCancelled() : Boolean {
        return this == CANCELADO
    }

    fun isCompleted(): Boolean {
        return this == COMPLETO || this == VALIDADO
    }

}