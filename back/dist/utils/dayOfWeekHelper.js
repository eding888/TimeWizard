// Returns the number of days based on a target date and which days of the week count.
export const countDays = (daysOfWeek, endDate) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(`${endDate.year}-${endDate.month}-${endDate.day}`);
    end.setDate(end.getDate() + 1);
    let count = 0;
    const currentDate = new Date(start);
    while (currentDate <= end) { //eslint-disable-line
        if (daysOfWeek.includes(currentDate.getDay())) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
};
// Ensures that days in daysOfWeek array are valid (between 0-6)
export const validateDays = (daysOfWeek) => {
    const days = new Set();
    for (let i = 0; i < daysOfWeek.length; i++) {
        const day = daysOfWeek[i];
        if (days.has(day) || day < 0 || day > 6) {
            return false;
        }
        days.add(day);
    }
    return true;
};
export const getCurrentEpochInSeconds = () => {
    return (Math.floor(Date.now() / 1000) * 1000);
};
