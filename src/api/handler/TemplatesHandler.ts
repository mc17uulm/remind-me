import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {PutResponseSchema, Request} from "../Request";

export interface Template {
    html: string,
    subject: string
}

export interface Templates {
    confirm: Template,
    success: Template,
    signout: Template,
    reminder: Template
}

export const TemplateSchema : JSONSchemaType<Templates> = {
    definitions: {
        template: {
            type: "object",
            properties: {
                html: {
                    type: "string"
                },
                subject: {
                    type: "string"
                }
            },
            required: ["html", "subject"],
            additionalProperties: false
        }
    },
    type: "object",
    properties: {
        confirm: {
            "$ref": "#/definitions/template"
        },
        success: {
            "$ref": "#/definitions/template"
        },
        signout: {
            "$ref": "#/definitions/template"
        },
        reminder: {
            "$ref": "#/definitions/template"
        }
    },
    required: ["confirm", "success", "signout", "reminder"],
    additionalProperties: false
}

export class TemplatesHandler {

    public static async get(): Promise<Either<Templates>> {
        return await Request.get<Templates>('templates', TemplateSchema);
    }

    public static async update(templates: Templates) : Promise<Either<boolean>> {
        return await Request.put('templates', templates, PutResponseSchema);
    }

}