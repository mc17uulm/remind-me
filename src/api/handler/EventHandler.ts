import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PostResponseSchema, PutResponseSchema, Request} from "../Request";
import {__, sprintf} from "@wordpress/i18n";
import {DropdownItemProps} from "semantic-ui-react";
import {Date} from "../Date";

export interface Event {
    name: string,
    description: string,
    clocking: number,
    start: Date | string
}

interface EventResponse extends Event{
    id: number,
    start: string,
    next: string,
    last: number,
    active: boolean
}

export interface APIEvent extends Event {
    id: number,
    start: Date,
    next: Date,
    last : number,
    active: boolean
}

export const ClockingList : DropdownItemProps[] = [
    {key: '1', value: 1, text: __('monthly', 'wp-reminder')},
    {key: '2', value: 2, text: __('2-monthly', 'wp-reminder')},
    {key: '3', value: 3, text: __('quarterly', 'wp-reminder')},
    {key: '4', value: 4, text: __('4-monthly', 'wp-reminder')},
    {key: '6', value: 6, text: __('half-yearly', 'wp-reminder')},
    {key: '12', value: 12, text: __('yearly', 'wp-reminder')},
];

export const get_clocking_str = (clocking : number) : string => {
    const _val : DropdownItemProps[] = ClockingList.filter((val : DropdownItemProps) => val.value === clocking);
    if(_val.length === 1) {
        // @ts-ignore
        return _val[0].text;
    }
    return "Invalid clocking";
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


export const get_repetition = (date: Date, clocking : number) : string => {
    const components = get_components(clocking);
    return sprintf(
        __('Is executed every %s%s on the %d. of the %s', 'wp-reminder'),
        components.divider,
        components.of,
        date.day,
        components.on
    );
}

export const empty_event = () : APIEvent => {
    return {
        id: -1,
        name: "",
        description: "",
        clocking: 1,
        start: Date.create(),
        next: Date.create(),
        last: 0,
        active: false
    }
}

export const EventSchema : JSONSchemaType<EventResponse> = {
    type: "object",
    properties: {
        id: {
            type: "integer"
        },
        name: {
            type: "string"
        },
        description: {
            type: "string"
        },
        clocking: {
            type: "integer"
        },
        start: {
            type: "string"
        },
        next: {
            type: "string"
        },
        last: {
            type: "integer"
        },
        active: {
            type: "boolean"
        }
    },
    required: ["id", "name", "description", "clocking", "start", "next", "active", "last"],
    additionalProperties: false
}

const EventsSchema : JSONSchemaType<EventResponse[]> = {
    type: "array",
    items: EventSchema
}

export class EventHandler {

    public static async get_all() : Promise<Either<APIEvent[]>> {
        const resp = await Request.get<EventResponse[]>(
            'events', EventsSchema
        );
        return EventHandler.map(resp);
    }

    public static async get(index : number) : Promise<Either<APIEvent>> {
        const res = await Request.get<EventResponse>(
            `event/${index}`,
            EventSchema
        );
        if(res.has_error()) return Either.error<APIEvent>(res.get_error());
        return Either.success<APIEvent>({
            id: res.get_value().id,
            name: res.get_value().name,
            description: res.get_value().description,
            clocking: res.get_value().clocking,
            start: Date.create_by_string(res.get_value().start),
            next: Date.create_by_string(res.get_value().next),
            last : res.get_value().last,
            active: res.get_value().active
        });
    }

    public static async count() : Promise<Either<number>> {
        return await Request.get<number>('events/count', PostResponseSchema);
    }

    public static async get_list(indices : number[]) : Promise<Either<APIEvent[]>> {
        const list = await Promise.all(indices.map(async (elem : number) => {
            return await Request.get<EventResponse>(`event/${elem}`, EventSchema);
        }));
        return EventHandler.map(Either.map<EventResponse>(list));
    }

    private static map(list : Either<EventResponse[]>) : Either<APIEvent[]> {
        if(list.has_error()) return Either.error<APIEvent[]>(list.get_error());
        return Either.success<APIEvent[]>(list.get_value().map((event : EventResponse) => {
            return {
                id: event.id,
                name: event.name,
                description: event.description,
                clocking: event.clocking,
                start: Date.create_by_string(event.start),
                next: Date.create_by_string(event.next),
                last : event.last,
                active: event.active
            }
        }));
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

    public static async delete(index : number[]) : Promise<Either<boolean>> {
        const list = await Promise.all(index.map(async (elem : number) => {
            return await Request.delete<boolean>(`event/${elem}`, DeleteResponseSchema);
        }));
        console.log(list);
        const back = Either.collapse(list, true,(t1 : boolean, t2 : boolean) => t1 && t2);
        console.log(back);
        return back;
    }

}