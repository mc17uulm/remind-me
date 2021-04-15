import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PostResponseSchema, PutResponseSchema, Request} from "../Request";

export interface Template {
    id: number | null,
    name: string,
    html: string
}

export const empty_template = () : Template => {
    return {
        id: null,
        name: "",
        html: ""
    }
}

export const TemplateSchema : JSONSchemaType<Template> = {
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
        }
    },
    required: ["name", "html"],
    additionalProperties: false
}

const TemplatesSchema : JSONSchemaType<Template[]> = {
    type: "array",
    items: TemplateSchema
}

export class TemplateHandler
{

    public static async get_all() : Promise<Either<Template[]>> {
        return await Request.get<Template[]>(
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

    public static async delete(index : number) : Promise<Either<boolean>> {
        return await Request.delete<boolean>(`template/${index}`, DeleteResponseSchema);
    }

}