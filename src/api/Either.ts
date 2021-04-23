export class Either<T> {

    private readonly value : T | null;
    private readonly error_msg : string | false;

    constructor(value : T | null, error_msg : string | false = "undefined") {
        this.value = value;
        this.error_msg = error_msg;
    }

    public static success<T>(value : T) : Either<T> {
        return new Either<T>(value, false);
    }

    public static error<T>(msg : string) : Either<T> {
        return new Either<T>(null, msg);
    }

    public static collapse<T>(list : Either<T>[], collapse : (t1: T, t2: T) => T) : Either<T> {
        let elem : Either<T> = Either.error("Not initialized");
        list.forEach((item : Either<T>) => {
            if(item.has_error()) return item;
            elem = Either.success(collapse(elem.get_value(), item.get_value()));
        })
        return elem;
    }

    public has_error() : boolean {
        return typeof this.error_msg === "string";
    }

    public get_error() : string {
        return (typeof this.error_msg === "string") ? this.error_msg : "no error";
    }

    public get_value() : T {
        if(this.value === null) throw new Error("Could not access value");
        return this.value;
    }

}