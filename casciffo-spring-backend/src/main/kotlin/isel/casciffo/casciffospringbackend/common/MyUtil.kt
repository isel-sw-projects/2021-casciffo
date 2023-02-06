package isel.casciffo.casciffospringbackend.common


import java.nio.file.Paths
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.*

const val FILE_NAME_HEADER = "File-Name"
val FILES_DIR = { fileName: String -> Paths.get("./src/main/resources/files/$fileName-${Date().time}") }

const val amountOfTime: Long = 15

/**
 * Utility datetime function
 * Returns the difference in days between the first date and second date.
 * If first date < second date: return positive amount of days.
 * If first date > second date: return negative amount of days.
 * If first date = second date: return 0.
 * @param date First date
 * @param other Second date
 */
val datetimeDiffInDays = { date: LocalDateTime, other: LocalDateTime -> date.until(other, ChronoUnit.DAYS).toInt() }

/**
 * Utility date function
 * Returns the difference in days between the first date and second date.
 * If first date < second date: return positive amount of days.
 * If first date > second date: return negative amount of days.
 * If first date = second date: return 0.
 * @param date First date
 * @param other Second date
 */
val dateDiffInDays = { date: LocalDate, other: LocalDate -> date.until(other, ChronoUnit.DAYS).toInt() }


/************************ Authorization related constants *******************************/
/***************************************************************************************/

const val CASCIFFO_AUTH_HEADER = "Casciffo-Authenticate"

val newExpirationTime: Date = Date.from(Instant.now().plus(amountOfTime, ChronoUnit.DAYS))
const val tokenIssuer = "Casciffo-back-end"

const val frontEnd = "https://casciffo-react-pwa.herokuapp.com/"

const val AUTH_DELIM = "_"

const val EMAIL_AUTH = "EMAIL$AUTH_DELIM"
const val ROLE_AUTH = "ROLE$AUTH_DELIM"

const val DEFAULT_PASSWORD = "123456"

//may not be needed
const val SUPERUSER_AUTHORITY = "${ROLE_AUTH}SUPERUSER"
const val UIC_AUTHORITY = "${ROLE_AUTH}UIC"
const val CA_AUTHORITY = "${ROLE_AUTH}CA"
const val FINANCE_AUTHORITY = "${ROLE_AUTH}FINANCE"
const val JURIDICAL_AUTHORITY = "${ROLE_AUTH}JURIDICAL"


/************************ More Utility functions *******************************/
/*******************************************************************************/

fun convertToJson(list: List<Pair<String, Int>>): String {
    return "{" + list.joinToString(separator=",", transform= {pair -> "\"${pair.first}\":${pair.second}"}) + "}"
}