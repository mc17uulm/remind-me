import dayjs from "dayjs";
import localized from "dayjs/plugin/localizedFormat";
import de from 'dayjs/locale/de';

dayjs.extend(localized);

const locale_id = document.getElementsByTagName('html')[0].getAttribute('lang')?.substr(0, 2) ?? 'en';
if(locale_id === 'de') {
    dayjs.locale(de);
}

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
        let iterator = Array.from(Array(steps).keys());
        iterator.shift();
        let next = iterator.map((step : number) : Date => {
            return this.get_next(clocking, step);
        });
        next.unshift(this);
        return next;
    }

    public to_string() : string {
        const month = this.month < 10 ? `0${this.month}` : this.month;
        let day = this.day;
        if(day > 28) {
            switch(this.month) {
                case 4:
                case 6:
                case 9:
                case 11:
                    if(day > 30) day = 30;
                    break;
                case 2:
                    day = 28;
                    break;
                default:
                    break;
            }
        }
        const day_str =  day < 10 ? `0${day}` : day;
        return `${this.year}-${month}-${day_str}`;
    }

    public format(format : string = 'LLLL') : string {
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