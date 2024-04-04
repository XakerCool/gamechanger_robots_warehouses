export class Logger {
    constructor() {}

    errorLog(errorSource, errorMsg) {
        return `ERROR ${errorSource} ${this.setDateTime()} - ${errorMsg}`
    }
    successLog(source, msg) {
        return `SUCCESS ${source} ${this.setDateTime()} - ${msg}`
    }

    setDateTime() {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
    }
}