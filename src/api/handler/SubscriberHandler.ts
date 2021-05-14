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
    token: string,
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
        token: {
            type: "string"
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

    public static async get(token : string): Promise<Either<APISubscriber>> {
        return await Request.get<APISubscriber>(
            `subscriber/${token}`,
            SubscriberSchema
        )
    }

    public static async get_all() : Promise<Either<APISubscriber[]>> {
        return await Request.get<APISubscriber[]>(
            'subscribers', SubscribersSchema
        );
    }

    public static async update_by_id(id: number, subscriber: Subscriber) : Promise<Either<boolean>> {
        return await Request.put<boolean>(
            `subscriber/${id}`,
            subscriber,
            PutResponseSchema
        );
    }

    public static async update_by_token(token: string, events : number[]) : Promise<Either<boolean>> {
        return await Request.put<boolean>(
            `subscriber/${token}`,
            events,
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