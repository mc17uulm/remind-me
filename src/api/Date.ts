import dayjs from "dayjs";
import localized from "dayjs/plugin/localizedFormat";

export class Date {

    public year : number;
    public month : number;
    public day : number;

    protected constructor(year : number, month : number, day : number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public get_next(clocking : number, step : number = 1) : Date {
        const comp = this.month + (step * clocking);
        const year = this.year + Math.floor(comp / 12);
        return Date.create_by_date(year, comp % 12, this.day);
    }

    public get_next_array(clocking : number, steps: number) : Date[] {
        let iterator = Array.from(Array(steps + 1).keys());
        iterator.shift();
        return iterator.map((step : number) : Date => {
            return this.get_next(clocking, step);
        });
    }

    public to_string() : string {
        const month = this.month < 10 ? `0${this.month}` : this.month;
        const day = this.day < 10 ? `0${this.day}` : this.day;
        return `${this.year}-${month}-${day}`;
    }

    public format(format : string = 'LLLL') : string {
        dayjs.extend(localized);
        return dayjs(this.to_string(), 'YYYY-MM-DD').format(format);
    }

    public static create_by_string(date : string) : Date {
        const parts : string[] = date.split('-');
        if(parts.length !== 3) throw new Error(`Invalid date string: ${date}`);
        return new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
    }

    public static create() : Date {
        return Date.create_by_string(dayjs().format('YYYY-MM-DD'));
    }

    public static create_by_date(year : number, month : number, day : number) : Date {
        return new Date(year, month, day);
    }

}