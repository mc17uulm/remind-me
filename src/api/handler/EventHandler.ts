import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PostResponseSchema, PutResponseSchema, Request} from "../Request";
import {__, sprintf} from "@wordpress/i18n";

export interface Event {
    id: number | null,
    name: string,
    clocking: number,
    day: number,
    start: number,
    end: number
}

export const is_event_active = (event : Event) : boolean => {
    const now = Date.now();
    return (event.start < now) && (event.end < now);
}

const get_clocking_str = (clocking : number) : string => {
    switch(clocking) {
        case 1: return __('every month', 'wp-reminder');
        case 2:
        case 4: return  sprintf(__('every %s month', 'wp-reminder'));
        case 3: return __('quarterly', 'wp-reminder');
        case 6: return __('half-yearly', 'wp-reminder');
        case 12: return __('yearly', 'wp-reminder');
        default: return __('Invalid clocking value', 'wp-reminder');
    }
}

const get_next_execution = () => {

}

export const get_repetition = (event : Event) : string => {
    const clocking = get_clocking_str(event.clocking);
    return sprintf(__('Is repeated %s at the %d day.', 'wp-reminder'), clocking, event.day);
}

export const empty_event = () : Event => {
    return {
        id: null,
        name: "",
        clocking: 0,
        day: 0,
        start: 0,
        end: 0
    }
}

const EventSchema : JSONSchemaType<Event> = {
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
        day: {
            type: "integer"
        },
        start: {
            type: "integer"
        },
        end: {
            type: "integer"
        }
    },
    required: ["id", "name", "clocking", "day", "start", "end"],
    additionalProperties: false
}

const EventsSchema : JSONSchemaType<Event[]> = {
    type: "array",
    items: EventSchema
}

export class EventHandler {

    public static async get_all() : Promise<Either<Event[]>> {
        return await Request.get<Event[]>(
            'events', EventsSchema
        );
    }

    public static async get(index : number) : Promise<Either<Event>> {
        return await Request.get<Event>(
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