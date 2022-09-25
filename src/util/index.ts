export const getYearAgo = (from = new Date()): Date => {
    const date = new Date(from);
    date.setFullYear(from.getFullYear() -  1);
    
    return resetTimeToMidnight(date);
}

export const getYesterday = (from = new Date()): Date => {
    const date = new Date(from);
    date.setDate(from.getDate() -  1);
    return resetTimeToMidnight(date);
}

export const getWeekBefore = (from = new Date()): Date => {
    const date = new Date(from);
    date.setDate(from.getDate() -  7);
    return resetTimeToMidnight(date);
}

export const getMonthBefore = (from = new Date()): Date => {
    const date = new Date(from);
    date.setMonth(from.getMonth() -  1);
    return resetTimeToMidnight(date);
}

export const resetTimeToMidnight = (date: Date): Date => {
    const clone = new Date(date);
    clone.setHours(0);
    clone.setMinutes(0);
    clone.setSeconds(0);
    clone.setMilliseconds(0);
    return clone;
} 

export const get0000DateString = (date: Date, isEnd = false): string => {
    const clone = new Date(date);
    const d = clone.getDate();
    const m = clone.getMonth() + 1;
    const y = clone.getFullYear();
    const dd = d < 10 ? `0${d}`: d.toString();
    const mm = m < 10 ? `0${m}`: m.toString();
    const timeSuffix = isEnd ? '23:59:59.999Z' :'00:00:00.000Z'
    return `${y}-${mm}-${dd}T${timeSuffix}`;
} 