import {STATES} from "../model/state/STATES";
import {KEY_VALUE_DELIMENTER, PARAM_DELIMENTER, TOKEN_KEY} from "./Constants";
import {KeyValuePair, UserToken} from "./Types";
import axios, {AxiosRequestConfig} from "axios";
import FileSaver from "file-saver";
import {MyError} from "../view/error-view/MyError";

/******************************** TIME UTILITY FUNCTIONS ******************************** */
/**************************************************************************************** */

function convertSecondsToMillis(s: number): number {
    return s * Math.pow(10, 3)
}
function convertMinutesToMillis(m: number): number {
    return m * 6 * Math.pow(10, 4)
}
function convertHoursToMillis(h: number): number {
    return h * 3.6 * Math.pow(10, 6)
}

const isoDatetimeDelimiterIdx = 10
const isoDateDelim = '-'
const isoTimeDelim = ':'
const isoDateTimeLength = 19


const dateFieldIdx = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    minute: 4
}

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

function getDateTimeField(date: string | null | undefined, fieldName: keyof typeof dateFieldIdx): string {

    // == is used because null == undefined
    if(date == null) return ""

    let dateFields = date.substring(0, isoDatetimeDelimiterIdx).split(isoDateDelim)

    if(date.length === isoDateTimeLength) {
        dateFields = [...dateFields, ...date.substring(isoDatetimeDelimiterIdx+1).split(isoTimeDelim)]
    }

    return dateFields[dateFieldIdx[fieldName]]
}


/**
 * Receives ISO formatted date yyyy-MM-ddTHH:mm:ss.SSSSS
 * @param date ISO Formatted date.
 * @param withHours Optional to decide whether to format the hours as well.
 * @return The date formatted as yyyy-MM-dd HH:mm
 */
function formatDate(date: string, withHours: boolean = false): string {
    const formattedDate = date.length > 10 ? date.substring(0, isoDatetimeDelimiterIdx) : date

    if(!withHours)
        return formattedDate


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

function yearRatioDiff(firstDate: string | undefined | null, secondDate: string | undefined | null) {
    const months = monthDiff(firstDate, secondDate) / 12
    return Math.round((months + Number.EPSILON) * 100) / 100
}

function monthDiff(firstDate: string | undefined | null, secondDate: string | undefined | null) {
    if(firstDate == null && secondDate == null) return 0;
    if(firstDate == null && secondDate != null) return 0;
    if(firstDate != null && secondDate == null) return 0;
    let d1 = new Date(firstDate!)
    let d2 = new Date(secondDate!)

    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return Math.abs(months);
}

/**
 * Compares two dates in ISO format
 * @param firstDate First date in ISO format.
 * @param secondDate Second date in ISO format.
 * @param withHours If comparison should take into account the hours.
 * @returns 0 when dates are equal, positive when first is more recent than second and negative otherwise.
 */
function cmp(firstDate: string | undefined | null, secondDate: string | undefined | null, withHours: boolean = false) {
    if(firstDate == null && secondDate == null) return 0;
    if(firstDate == null && secondDate != null) return -1;
    if(firstDate != null && secondDate == null) return 1;
    // ' /T|-|\.|:/g ' -> regex to find 'T' '-' ':' and '.'
    const firstDateString = formatDate(firstDate!, withHours).replaceAll(/T|-|\.|:/g, '')
    const secondDateString = formatDate(secondDate!, withHours).replaceAll(/T|-|\.|:/g, '')
    return parseInt(firstDateString) - parseInt(secondDateString);
}

/**
 * Compares passed date in ISO format with the current day
 * @param date Date in ISO format.
 * @param withHours If comparison should take into account the hours.
 * @returns 0 when the passed date is the same as today, positive when the passed date is in the future recent and negative otherwise.
 */
function cmpWithToday(date: string | undefined | null, withHours: boolean = false) {
    return cmp(date, new Date().toISOString(), withHours)
}


/****************************************** HTTP UTILITY FUNCTIONS ***********************************/
/*************************************************************************************************** */

const APPLICATION_CONTENT_TYPE = 'application/json'
const HEADER_ACCEPT_JSON: [string,string] = ['Accept', APPLICATION_CONTENT_TYPE]
const HEADER_CONTENT_TYPE: [string,string] = ['Content-Type', APPLICATION_CONTENT_TYPE]
const HEADER_AUTHORIZATION = (token: string): [string,string] => ['Authorization', 'Bearer ' + token]

function parseUrlHash(hash: string): KeyValuePair<string, string>[] {
    const params = hash.substring(1).split(PARAM_DELIMENTER)
    return params.map(p => {
        const pair = p.split(KEY_VALUE_DELIMENTER)
        return {key: pair[0], value: pair[1]}
    })
}

function formatUrlHash(args: KeyValuePair<string, string>[]): string {
    return `#` + args.map(kp => `${kp.key}${KEY_VALUE_DELIMENTER}${kp.value}`).join(PARAM_DELIMENTER)
}


// function checkAndRaiseError(rsp: Response): Response {
//     if(!rsp.ok) {
//         throw new MyError(`Error occurred trying to reach url: ${rsp.url}\n${rsp}`, rsp.status)
//     }
//     return rsp
// }

function _httpFetch<T>(
    url: string,
    method: string,
    headers: [string, string][] = [],
    body: unknown = null

): Promise<T> {
    headers.push(HEADER_ACCEPT_JSON)
    const token = localStorage.getItem(TOKEN_KEY)
    if(token != null) {
        const userToken = JSON.parse(token) as UserToken
        headers.push(HEADER_AUTHORIZATION(userToken?.token))
    }
    const opt : RequestInit = {
        headers: headers,
        method: method
    }
    if(body != null) {
        opt.body = JSON.stringify(body)
    }
    return fetch(url, opt)
        // .then(checkAndRaiseError)
        .then(rsp => rsp.json())
}

export function httpGet<T>(url: string) : Promise<T> {
    return _httpFetch(url, 'GET')
}

export function httpDelete<T>(url: string, body: unknown = null) : Promise<T> {
    return _httpFetch(url, 'DELETE', [HEADER_CONTENT_TYPE], body)
}

export function httpPost<T>(url: string, body: unknown): Promise<T> {
    return _httpFetch(url, 'POST', [HEADER_CONTENT_TYPE], body)
}

export function httpPostNoBody<T>(url: string): Promise<T> {
    return _httpFetch(url, 'POST')
}

export function httpPut<T>(url: string, body: unknown = null): Promise<T> {
    return _httpFetch(url, 'PUT', [HEADER_CONTENT_TYPE], body)
}

export function axiosPostFormFile<T>(url: string, file: File): Promise<T> {
    const token = localStorage.getItem(TOKEN_KEY)
    let reqHeaders
    if(token != null) {
        const userToken = JSON.parse(token) as UserToken
        reqHeaders = {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${userToken?.token}`
        }
    } else {
        reqHeaders = {'Content-Type': 'multipart/form-data'}
    }
    const formData = new FormData()
    formData.append('file', file)
    return axios.postForm(url, formData, {headers: reqHeaders})
}

export function httpGetFile(url: string): Promise<void> {

    const userToken = localStorage.getItem(TOKEN_KEY)
    if(userToken == null) throw new MyError("Not authenticated to download!", 401)

    const token = (JSON.parse(userToken) as UserToken).token
    const opts: AxiosRequestConfig = {
        headers: {'Authorization': `Bearer ${token}`},
        responseType: "blob"
    }

    return axios.get(url, opts)
        .then(res => {
            // console.log(res)
            if(res.status === 200)
                FileSaver.saveAs(res.data, res.headers['file-name'])
        })
}


/************************************** BROWSER UTILITY FUNCTIONS *******************************/
/**************************************************************************************************** */

const getUserToken = () => {
    const tokenString = localStorage.getItem(TOKEN_KEY)
    if(tokenString == null) return null
    return JSON.parse(tokenString) as UserToken
}

const clearUserToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    return null
}

const apiTitle = (title: string) => `CASCIFFO | ${title}`

export const MyUtil = {
    convertSecondsToMillis,
    convertMinutesToMillis,
    convertHoursToMillis,
    formatUrlHash,
    parseUrlHash,
    formatDate,
    proposalStates: Object.values(STATES).filter(s => s.code > STATES.SUBMETIDO.code && s.code <= STATES.VALIDADO.code),
    cmp,
    getDateTimeField,
    monthDiff,
    yearRatioDiff,
    formatDateWithMonthName,
    cmpWithToday,
    getTodayDate,
    getUserToken,
    clearUserToken,
    PAGE_TITLE: apiTitle,
    DASHBOARD_TITLE: apiTitle('Dashboard'),
    CREATE_PROPOSAL_TITLE: apiTitle('Criar proposta'),
    PROPOSALS_TITLE:apiTitle( 'Propostas'),
    PROPOSAL_DETAIL_TITLE: apiTitle('Detalhes de proposta'),
    RESEARCH_TITLE: apiTitle('Ensaios clínicos'),
    RESEARCH_DETAIL_TITLE: apiTitle('Detalhes de ensaio'),
    RESEARCH_VISITS_TITLE: (researchId: string) => apiTitle(`Ensaio ${researchId} | Visitas`),
    RESEARCH_VISIT_DETAIL_TITLE: (researchId: string, visitId: string) => apiTitle(`Ensaio ${researchId} | Visita ${visitId}`),
    RESEARCH_PATIENTS_TITLE: (researchId: string) => apiTitle(`Ensaio ${researchId} | Pacientes`),
    RESEARCH_PATIENT_DETAILS_TITLE: (researchId: string, patientId: string) => apiTitle(`Ensaio ${researchId} | Paciente ${patientId}`),
    NOTIFICATIONS_TITLE: () => apiTitle('Notificações')
}