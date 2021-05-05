import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PostResponseSchema, PutResponseSchema, Request} from "../Request";

export interface Subscriber {
    id?: number,
    email: string,
    registered?: number,
    active?: boolean,
    events: number[]
}

export const empty_subscriber : Subscriber = {
    email: "",
    events: []
}

export interface APISubscriber extends Subscriber {
    id: number,
    registered: number,
    active: boolean
}

export const SubscriberSchema : JSONSchemaType<APISubscriber> = {
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

const SubscribersSchema : JSONSchemaType<APISubscriber[]> = {
    type: "array",
    items: SubscriberSchema
}

export class SubscriberHandler
{

    public static async get_all() : Promise<Either<APISubscriber[]>> {
        return await Request.get<APISubscriber[]>(
            'subscribers', SubscribersSchema
        );
    }

    public static async update(index : number, subscriber : Subscriber) : Promise<Either<boolean>> {
        return await Request.put<boolean>(
            `subscriber/${index}`,
            subscriber,
            PutResponseSchema
        );
    }

    public static async set(subscriber : Subscriber) : Promise<Either<number>> {
        return await Request.post<number>(
            `subscribe`,
            subscriber,
            PostResponseSchema
        );
    }

    public static async delete(index : number[]) : Promise<Either<boolean>> {
        const list = await Promise.all(index.map(async (elem : number) => {
            return await Request.delete<boolean>(`subscriber/${elem}`, DeleteResponseSchema);
        }));
        return Either.collapse(list, true, (t1 : boolean, t2 : boolean) => t1 && t2);
    }

}