import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {Request} from "../Request";

export interface Subscriber {
    id: number | null,
    email: string,
    registered: number | null,
    active: boolean | null,
    events: number[]
}

export const SubscriberSchema : JSONSchemaType<Subscriber> = {
    type: "object",
    properties: {
        id: {
            type: "integer"
        },
        email: {
            type: "string"
        },
        registered: {
            type: "integer"
        },
        active: {
            type: "boolean"
        },
        events: {
            type: "array",
            items: {
                type: "integer"
            }
        }
    },
    required: ["email", "events"],
    additionalProperties: false
}

const SubscribersSchema : JSONSchemaType<Subscriber[]> = {
    type: "array",
    items: SubscriberSchema
}

export class SubscriberHandler
{

    public static async get_all() : Promise<Either<Subscriber[]>> {
        return await Request.get<Subscriber[]>(
            'subscribers', SubscribersSchema
        );
    }

}