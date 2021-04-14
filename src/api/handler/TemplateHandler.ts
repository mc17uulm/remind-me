import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {Request} from "../Request";

export interface Template {
    id: number | null,
    name: string,
    html: string
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
            'template', TemplatesSchema
        )
    }

}