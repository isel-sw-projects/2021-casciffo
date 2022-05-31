import {STATES} from "../model/state/STATES";

function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

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

const dateIndexes = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    min: 4,
    sec: 5,
    millis: 6
}


function formatDate(date: Array<number>, withHours: boolean = false, dateDelim: string = "-", hourDelim: string = ":"): string {
    const formattedDate = [
        date[dateIndexes.year],
        padTo2Digits(date[dateIndexes.month]),
        padTo2Digits(date[dateIndexes.day]),
    ].join(dateDelim)

    if(!withHours) return formattedDate

    const hours =
        [
            padTo2Digits(date[dateIndexes.hour]),
            padTo2Digits(date[dateIndexes.min]),
            padTo2Digits(date[dateIndexes.sec]),
        ].join(hourDelim)

    return formattedDate + ' ' + hours
}

function getTodayDate(): string {
    return (new Date()).toISOString().slice(0, 10)
}

function formatStringToArrayDate(
    value: string,
    withHours: boolean = false,
    dateDelim: string = "-",
    hourDelim: string = ":",
    jointDateDelim: string = "T"
): number[] {
    let dateSplit: string[]

    if(withHours) {
        // value = '2022-11-31T19:19'
        const tmp = value.split(jointDateDelim)
        // tmp = ['2022-11-31', '19:19:19']
        dateSplit = [...tmp[0].split(dateDelim), ...tmp[1].split(hourDelim)]
        // dateSplit = ['2022', '11', '31', '19', '19', '19']
    } else {
        dateSplit = value.split(dateDelim)
    }

    const date = [
        parseInt(dateSplit[dateIndexes.year]),
        parseInt(dateSplit[dateIndexes.month]),
        parseInt(dateSplit[dateIndexes.day]),
    ]

    if(!withHours) return date

    const hours =
        [
            parseInt(dateSplit[dateIndexes.hour]),
            parseInt(dateSplit[dateIndexes.min]),
            dateSplit[dateIndexes.sec] === undefined ? 0 : parseInt(dateSplit[dateIndexes.sec])
        ]

    return [...date, ...hours]
}

function formatDateWithMonthName(date: Array<number>) {
    return [date[dateIndexes.year], month[date[dateIndexes.month]-1], padTo2Digits(date[dateIndexes.day])].join(' ');
}

/**
 * Compares two dates in array format [year, month, day, [hour, min, sec]] hours optional
 * @param firstDate
 * @param secondDate
 * @returns 0 when dates are equal, positive when first is greater than second and negative when first is smaller than second
 */
function cmp(firstDate: Array<number> | undefined, secondDate: Array<number> | undefined) {
    if(isNullOrUndefined(firstDate) && isNullOrUndefined(secondDate)) return 0;
    if(isNullOrUndefined(firstDate) && !isNullOrUndefined(secondDate)) return -1;
    if(!isNullOrUndefined(firstDate) && isNullOrUndefined(secondDate)) return 1;
    const firstDateString = formatDate(firstDate!, false, "")
    const secondDateString = formatDate(secondDate!, false, "")
    return parseInt(firstDateString) - parseInt(secondDateString);
}


function isNullOrUndefined<T>(value: T | null | undefined): boolean {
    return value === undefined || value === null
}

export const Util = {
    formatDate,
    proposalStates: Object.values(STATES).filter(s => s.code > STATES.SUBMETIDO.code && s.code <= STATES.VALIDADO.code),
    formatStringToArrayDate,
    cmp,
    formatDateWithMonthName,
    isNullOrUndefined,
    getTodayDate
}