package isel.casciffo.casciffospringbackend.common

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

const val amountOfTime: Long = 15

val newExpirationTime: Date = Date.from(Instant.now().plus(amountOfTime, ChronoUnit.DAYS))

val dateNow: Date = Date.from(Instant.now())

const val tokenIssuer = "Casciffo-back-end"

const val frontEnd = "https://casciffo-react-pwa.herokuapp.com/"

const val AUTH_DELIM = ":"

const val EMAIL_AUTH = "EMAIL$AUTH_DELIM"
const val ROLE_AUTH = "ROLE$AUTH_DELIM"
