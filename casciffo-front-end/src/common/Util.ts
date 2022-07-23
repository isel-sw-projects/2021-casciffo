import {STATES} from "../model/state/STATES";
import {TOKEN_KEY} from "./Constants";
import {UserToken} from "./Types";
import axios, {AxiosRequestConfig, AxiosRequestHeaders} from "axios";
import FileSaver from "file-saver";
import {MyError} from "../view/error-view/MyError";

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

const APPLICATION_CONTENT_TYPE = 'application/json'
const HEADER_ACCEPT_JSON = ['Accept', APPLICATION_CONTENT_TYPE]
const HEADER_CONTENT_TYPE = ['Content-Type', APPLICATION_CONTENT_TYPE]
const HEADER_AUTHORIZATION = (token: string) => ['Authorization', 'Bearer ' + token]



function checkAndRaiseError(rsp: Response): Response {
    if(!rsp.ok) {
        //TODO RAISE ERROR
        throw {status: rsp.status, path: rsp.url}
    }
    return rsp
}

function _httpFetch<T>(
    url: string,
    method: string,
    headers: string[][] = [],
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
        .then(checkAndRaiseError)
        .then(rsp => rsp.json())
}

export function httpGet<T>(url: string) : Promise<T> {
    return _httpFetch(url, 'GET')
}

export function httpDelete<T>(url: string) : Promise<T> {
    return _httpFetch(url, 'DELETE')
}

export function httpPost<T>(url: string, body: unknown): Promise<T> {
    return _httpFetch(url, 'POST', [HEADER_CONTENT_TYPE], body)
}

export function httpPut<T>(url: string, body: unknown = null): Promise<T> {
    return _httpFetch(url, 'PUT', [HEADER_CONTENT_TYPE], body)
}

export function httpPostFormFile(url: string, file: File): Promise<void> {
    const token = localStorage.getItem(TOKEN_KEY)
    const headers: AxiosRequestHeaders = {'Content-type': 'multipart/form-data'}
    if(token != null) {
        const userToken = JSON.parse(token) as UserToken
        headers['Authorization'] = `Bearer ${userToken?.token}`
    }
    const formData = new FormData()
    formData.append('file', file)
    return axios.postForm(url, formData, {headers: headers})
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
            console.log(res)
            if(res.status === 200)
                FileSaver.saveAs(res.data, res.headers['file-name'])
        })
}

const getUserToken = () => {
    const tokenString = localStorage.getItem(TOKEN_KEY)
    if(tokenString == null) return null
    return JSON.parse(tokenString) as UserToken
}

const clearUserToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    return null
}

export const Util = {
    formatDate,
    proposalStates: Object.values(STATES).filter(s => s.code > STATES.SUBMETIDO.code && s.code <= STATES.VALIDADO.code),
    cmp,
    formatDateWithMonthName,
    getTodayDate,
    getUserToken,
    clearUserToken
}