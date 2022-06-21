package isel.casciffo.casciffospringbackend.common


import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import java.util.concurrent.TimeUnit

const val amountOfTime: Long = 15

/**
 * Utility datetime function
 * Returns the difference in days between the first date and second date.
 * If first date > second date: return positive amount of days.
 * If first date < second date: return negative amount of days.
 * If first date = second date: return 0.
 * @param date First date
 * @param other Second date
 */
val dateDiffInDays = { date: Date, other: Date -> TimeUnit.MILLISECONDS.toDays(date.time - other.time).toInt()}

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
