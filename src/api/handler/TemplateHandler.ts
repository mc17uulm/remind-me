import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PostResponseSchema, PutResponseSchema, Request, ResponseObject} from "../Request";

export interface Template {
    id?: number,
    name: string,
    html: string,
    active: boolean
}

export interface APITemplate extends Template {
    id: number
}

export const empty_template = () : Template => {
    return {
        name: "",
        html: "",
        active: false
    }
}

export const TemplateSchema : JSONSchemaType<ResponseObject<Template>> = {
    type: "object",
    properties: {
        id: {
            type: "integer"
        },
        name: {
            type: "string"
        },
        html: {
            type: "string"
        },
        active: {
            type: "boolean"
        }
    },
    required: ["id", "name", "html", "active"],
    additionalProperties: false
}

const TemplatesSchema : JSONSchemaType<ResponseObject<Template>[]> = {
    type: "array",
    items: TemplateSchema
}

export class TemplateHandler
{

    public static async get_all() : Promise<Either<ResponseObject<Template>[]>> {
        return await Request.get<ResponseObject<Template>[]>(
            'templates', TemplatesSchema
        )
    }

    public static async set(template : Template) : Promise<Either<number>> {
        return await Request.post<number>('template', template, PostResponseSchema);
    }

    public static async update(index : number, template : Template) : Promise<Either<boolean>> {
        return await Request.put<boolean>(
            `template/${index}`,
            template,
            PutResponseSchema
        );
    }

    public static async delete(index : number[]) : Promise<Either<boolean>> {
        const list = await Promise.all(index.map(async (elem : number) => {
            return await Request.delete<boolean>(`template/${elem}`, DeleteResponseSchema);
        }));
        return Either.collapse(list, (t1 : boolean, t2: boolean) => t1 && t2);
    }

}