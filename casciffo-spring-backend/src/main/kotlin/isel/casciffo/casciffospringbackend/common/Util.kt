package isel.casciffo.casciffospringbackend.common

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

const val amountOfTime: Long = 15

val dateNow: Date = Date.from(Instant.now())




/************************ Authorization related constants *******************************/
/***************************************************************************************/

val newExpirationTime: Date = Date.from(Instant.now().plus(amountOfTime, ChronoUnit.DAYS))
const val tokenIssuer = "Casciffo-back-end"

const val frontEnd = "https://casciffo-react-pwa.herokuapp.com/"

const val AUTH_DELIM = "_"

const val EMAIL_AUTH = "EMAIL$AUTH_DELIM"
const val ROLE_AUTH = "ROLE$AUTH_DELIM"

//may not be needed
const val SUPERUSER_AUTHORITY = "${ROLE_AUTH}SUPERUSER"
const val UIC_AUTHORITY = "${ROLE_AUTH}UIC"
const val CA_AUTHORITY = "${ROLE_AUTH}CA"
const val FINANCE_AUTHORITY = "${ROLE_AUTH}FINANCE"
