import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PostResponseSchema, PutResponseSchema, Request} from "../Request";
import {__, sprintf} from "@wordpress/i18n";

export interface Event {
    id?: number,
    name: string,
    clocking: number,
    start: number,
    last_execution? : number,
    active?: boolean
}

export interface APIEvent extends Event {
    id: number,
    last_execution : number,
    active: boolean
}

const get_components = (clocking : number) : {divider : string, of: string, on : string} => {
    switch(clocking) {
        case 1: return {divider: "", of: __('month', 'wp-reminder'), on: __('month', 'wp-reminder')};
        case 2:
        case 4: return  {divider: `${clocking}. `, of: __('month', 'wp-reminder'), on: __('month', 'wp-reminder')}
        case 3: return {divider: __('quarter ', 'wp-reminder'), of: __('year', 'wp-reminder'), on: __('month', 'wp-reminder')};
        case 6: return {divider: __('half ', 'wp-reminder'), of: __('year', 'wp-reminder'), on: __('month', 'wp-reminder')};
        case 12: return {divider: "", of: __('year', 'wp-reminder'), on: __('year', 'wp-reminder')};
        default: return {divider: "", of: "", on: ''};
    }
}

export const get_next_executions = (last_execution : number, start: number, clocking : number, steps : number = 1) : Date[] => {
    let date : Date
    if(last_execution === 0) {
        date = new Date(start);
    } else {
        date = new Date(last_execution * 1000);
    }
    let iterator = Array.from(Array(steps + 1).keys());
    iterator.shift();
    return iterator.map((step : number) : Date => {
        const comp = (date.getMonth() + (step * clocking));
        const year = date.getFullYear() + Math.floor(comp / 12);
        return new Date(year, comp % 12, date.getDate());
    });
}

export const get_repetition = (clocking : number, day : number) : string => {
    const components = get_components(clocking);
    return sprintf(
        __('Is executed every %s%s on the %d. of the %s', 'wp-reminder'),
        components.divider,
        components.of,
        day,
        components.on
    );
}

export const empty_event = () : Event => {
    const start = new Date();
    return {
        name: "",
        clocking: 1,
        start: start.getTime()
    }
}

const EventSchema : JSONSchemaType<APIEvent> = {
    type: "object",
    properties: {
        id: {
            type: "integer"
        },
        name: {
            type: "string"
        },
        clocking: {
            type: "integer"
        },
        start: {
            type: "integer"
        },
        last_execution: {
            type: "integer"
        },
        active: {
            type: "boolean"
        }
    },
    required: ["id", "name", "clocking", "start", "active", "last_execution"],
    additionalProperties: false
}

const EventsSchema : JSONSchemaType<APIEvent[]> = {
    type: "array",
    items: EventSchema
}

export class EventHandler {

    public static async get_all() : Promise<Either<APIEvent[]>> {
        return await Request.get<APIEvent[]>(
            'events', EventsSchema
        );
    }

    public static async get(index : number) : Promise<Either<APIEvent>> {
        return await Request.get<APIEvent>(
            `event/${index}`,
            EventSchema
        );
    }

    public static async set(event : Event) : Promise<Either<number>> {
        return await Request.post<number>('event', event, PostResponseSchema);
    }

    public static async update(index : number, event : Event) : Promise<Either<boolean>> {
        return await Request.put<boolean>(
            `event/${index}`,
            event,
            PutResponseSchema
        );
    }

    public static async delete(index : number) : Promise<Either<boolean>> {
        return await Request.delete<boolean>(`event/${index}`, DeleteResponseSchema);
    }

}