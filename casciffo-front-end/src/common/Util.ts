import {STATES} from "../model/state/STATES";

function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}
const isoDatetimeDelimiterIdx = 10
const isoDateDelim = '-'

const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

/**
 * Receives ISO formatted date yyyy-MM-dd'T'HH:mm:ss.SSSSS
 * @param date ISO Formatted date.
 * @param withHours Optional to decide whether to format the hours as well.
 * @return The date formatted as yyyy-MM-dd HH:mm
 */
function formatDate(date: string, withHours: boolean = false): string {

    const formattedDate = date.substring(0, isoDatetimeDelimiterIdx)

    if(!withHours) return formattedDate

    const hours = date.substring(isoDatetimeDelimiterIdx+1, isoDatetimeDelimiterIdx+1+5)

    return formattedDate + ' ' + hours
}

function getTodayDate(): string {
    return (new Date()).toISOString().slice(0, isoDatetimeDelimiterIdx)
}

function formatDateWithMonthName(date: string) {
    const datePart = date.length > 10 ? date.substring(0, isoDatetimeDelimiterIdx) : date

    let dateWithMonth = datePart.split(isoDateDelim)
    dateWithMonth[1] = months[parseInt(dateWithMonth[1])-1]

    return dateWithMonth.join('-')
}

/**
 * Compares two dates in ISO format
 * @param firstDate First date in ISO format.
 * @param secondDate Second date in ISO format.
 * @returns 0 when dates are equal, positive when first is more recent than second and negative otherwise.
 */
function cmp(firstDate: string | undefined | null, secondDate: string | undefined | null) {
    if(firstDate == null && secondDate == null) return 0;
    if(firstDate == null && secondDate != null) return -1;
    if(firstDate != null && secondDate == null) return 1;
    const firstDateString = formatDate(firstDate!, false).replaceAll('-', '')
    const secondDateString = formatDate(secondDate!, false).replaceAll('-', '')
    return parseInt(firstDateString) - parseInt(secondDateString);
}

const APPLICATION_CONTENT_TYPE = 'application/json'
const HEADER_ACCEPT_JSON = ['Accept', APPLICATION_CONTENT_TYPE]
const HEADER_CONTENT_TYPE = ['Content-Type', APPLICATION_CONTENT_TYPE]
const HEADER_AUTHORIZATION = (token: string) => ['Authorization', token]



function _httpFetch<T>(
    url: string,
    method: string,
    token: string | undefined = undefined,
    headers: string[][] = [],
    body: unknown = null

): Promise<T> {
    headers.push(HEADER_ACCEPT_JSON)
    if(token != null) {
        headers.push(HEADER_AUTHORIZATION(token))
    }
    const opt : RequestInit = {
        headers: headers,
        method: method
    }
    if(body != null) {
        opt.body = JSON.stringify(body)
    }
    return fetch(url, opt).then(rsp => rsp.json())
}

export function httpGet<T>(url: string, token: string | undefined = undefined) : Promise<T> {
    return _httpFetch(url, 'GET', token)
}

export function httpDelete<T>(url: string, token: string | undefined = undefined) : Promise<T> {
    return _httpFetch(url, 'DELETE', token)
}

export function httpPost<T>(url: string, body: unknown, token: string | undefined = undefined): Promise<T> {
    return _httpFetch(url, 'POST', token, [HEADER_CONTENT_TYPE], body)
}

export function httpPut<T>(url: string, body: unknown = null, token: string | undefined = undefined): Promise<T> {
    return _httpFetch(url, 'PUT', token, [HEADER_CONTENT_TYPE], body)
}

export const Util = {
    formatDate,
    proposalStates: Object.values(STATES).filter(s => s.code > STATES.SUBMETIDO.code && s.code <= STATES.VALIDADO.code),
    cmp,
    formatDateWithMonthName,
    getTodayDate,
}