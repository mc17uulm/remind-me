import {Template, TemplateSchema} from "./TemplateHandler";
import {Repeat, RepeatSchema} from "./RepeatHandler";
import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PostResponseSchema, PutResponseSchema, Request} from "../Request";

export interface Event {
    id: number | null,
    name: string,
    template: number,
    repeat: Repeat
}

export const empty_event = () : Event => {
    return {
        id: null,
        name: "",
        template: -1,
        repeat: {
            id: null,
            event: -1,
            clocking: 0,
            day: 0,
            start: 0,
            end: 0
        }
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
        template: {
            type: "integer"
        },
        repeat: RepeatSchema
    },
    required: ["id", "name", "template", "repeat"],
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