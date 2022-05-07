function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

const dateIndexes = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    min: 4,
    sec: 5,
    millis: 6
}

function formatDate(date: Array<number>, withHours: boolean = false): string {
    const formattedDate = [
        date[dateIndexes.year],
        padTo2Digits(date[dateIndexes.month] + 1),
        padTo2Digits(date[dateIndexes.day]),
    ].join('-')

    if(!withHours) return formattedDate

    const hours =
        [
            padTo2Digits(date[dateIndexes.hour]),
            padTo2Digits(date[dateIndexes.min]),
            padTo2Digits(date[dateIndexes.sec]),
        ].join(':')

    return formattedDate + ' ' + hours
}

export const Util = {
    formatDate: formatDate
}