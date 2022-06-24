import {STATES} from "../model/state/STATES";
import {UserToken} from "./Types";

function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}
const isoDatetimeDelimiterIdx = 10
const isoDateDelim = '-'

const month = [
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

function formatStringToISODate(
    value: string,
    withHours: boolean = false,
    dateDelim: string = "-",
    hourDelim: string = ":",
    jointDateDelim: string = "T"
): string {
    // let dateSplit: string[]
    //
    // if(withHours) {
    //     // value = '2022-11-31T19:19'
    //     const tmp = value.split(jointDateDelim)
    //     // tmp = ['2022-11-31', '19:19:19']
    //     dateSplit = [...tmp[0].split(dateDelim), ...tmp[1].split(hourDelim)]
    //     // dateSplit = ['2022', '11', '31', '19', '19', '19']
    // } else {
    //     dateSplit = value.split(dateDelim)
    // }
    //
    // const date = [
    //     parseInt(dateSplit[dateIndexes.year]),
    //     parseInt(dateSplit[dateIndexes.month]),
    //     parseInt(dateSplit[dateIndexes.day]),
    // ]
    //
    // if(!withHours) return date
    //
    // const hours =
    //     [
    //         parseInt(dateSplit[dateIndexes.hour]),
    //         parseInt(dateSplit[dateIndexes.min]),
    //         dateSplit[dateIndexes.sec] === undefined ? 0 : parseInt(dateSplit[dateIndexes.sec])
    //     ]
    //
    // return [...date, ...hours]
    return ''
}

function formatDateWithMonthName(date: string) {
    const datePart = date.length > 10 ? date.substring(0, isoDatetimeDelimiterIdx) : date

    let dateWithMonth = datePart.split(isoDateDelim)
    dateWithMonth[1] = month[parseInt(dateWithMonth[1])-1]

    return dateWithMonth.join('-')
}

/**
 * Compares two dates in ISO format
 * @param firstDate First date in ISO format.
 * @param secondDate Second date in ISO format.
 * @returns 0 when dates are equal, positive when first is more recent than second and negative otherwise.
 */
function cmp(firstDate: string | undefined | null, secondDate: string | undefined | null) {
    if(isNullOrUndefined(firstDate) && isNullOrUndefined(secondDate)) return 0;
    if(isNullOrUndefined(firstDate) && !isNullOrUndefined(secondDate)) return -1;
    if(!isNullOrUndefined(firstDate) && isNullOrUndefined(secondDate)) return 1;
    const firstDateString = formatDate(firstDate!, false).replaceAll('-', '')
    const secondDateString = formatDate(secondDate!, false).replaceAll('-', '')
    return parseInt(firstDateString) - parseInt(secondDateString);
}

/**
 * Utility function
 *
 * Checks whether a given value is null or undefined using a juggle check.
 * @param value Value to check, can be anything.
 * @returns true when value is null or undefined, false otherwise.
 */
function isNullOrUndefined<T>(value: T | null | undefined): boolean {
    return value == null
}

const APPLICATION_CONTENT_TYPE = 'application/json'
const HEADER_ACCEPT_JSON = ['Accept', APPLICATION_CONTENT_TYPE]
const HEADER_CONTENT_TYPE = ['Content-Type', APPLICATION_CONTENT_TYPE]
const HEADER_AUTHORIZATION = (token: string) => ['Authorization', token]

function _httpFetch<T>(url: string, method: string, headers: HeadersInit, body: unknown = null,): Promise<T> {
    const opt : RequestInit = {
        headers: headers,
        method: method
    }
    if(body != null) {
        opt.body = JSON.stringify(body)
    }
    return fetch(url, opt).then(rsp => rsp.json())
}
export function httpGet<T>(url: string) : Promise<T> {
    return _httpFetch(url, 'GET', [HEADER_ACCEPT_JSON])
}
export function httpDelete<T>(url: string) : Promise<T> {
    return _httpFetch(url, 'DELETE', [HEADER_ACCEPT_JSON])
}
export function httpPost<T>(url: string, body: unknown): Promise<T> {
    return _httpFetch(url, 'POST', [HEADER_CONTENT_TYPE], body)
}
export function httpPut<T>(url: string, body: unknown = null): Promise<T> {
    return _httpFetch(url, 'PUT', [HEADER_CONTENT_TYPE, HEADER_ACCEPT_JSON], body)
}
export const Util = {
    formatDate,
    proposalStates: Object.values(STATES).filter(s => s.code > STATES.SUBMETIDO.code && s.code <= STATES.VALIDADO.code),
    formatStringToISODate,
    cmp,
    formatDateWithMonthName,
    isNullOrUndefined,
    getTodayDate,
}