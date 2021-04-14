export interface Subscriber {
    id?: number,
    email: string,
    registered?: Date,
    active?: boolean,
    events: number[]
}