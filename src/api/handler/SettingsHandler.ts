import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PutResponseSchema, Request} from "../Request";

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

export interface Messages {
    signin: string,
    signout: string,
    double_opt_in: string
}

export interface License {
    code?: string
}

export interface APILicense extends License {
    code: string,
    active: boolean,
    til: number,
    status: string
}

export interface Settings {
    templates: Templates,
    messages: Messages,
    license: License,
    settings_page: string,
    privacy_text: string
}

export interface APISettings extends Settings {
    license: APILicense
}

export const SettingsSchema : JSONSchemaType<APISettings> = {
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
        templates: {
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
        },
        messages: {
            type: "object",
            properties: {
                signin: {
                    type: "string"
                },
                signout: {
                    type: "string"
                },
                double_opt_in: {
                    type: "string"
                }
            },
            required: ["signin", "signout", "double_opt_in"],
            additionalProperties: false
        },
        license: {
            type: "object",
            properties: {
                code: {
                    type: "string"
                },
                active: {
                    type: "boolean"
                },
                til: {
                    type: "integer"
                },
                status: {
                    type: "string"
                }
            },
            required: ["code", "active", "til", "status"],
            additionalProperties: false
        },
        settings_page: {
            type: "string"
        },
        privacy_text: {
            type: "string"
        }
    },
    required: [
        "templates",
        "messages",
        "license",
        "settings_page",
        "privacy_text"
    ],
    additionalProperties: false
}

export class SettingsHandler
{

    public static async get() : Promise<Either<APISettings>> {
        return await Request.get<APISettings>('settings', SettingsSchema);
    }

    public static async update(settings : Settings) : Promise<Either<boolean>> {
        return await Request.put('settings', settings, PutResponseSchema);
    }

    public static async remove_license() : Promise<Either<boolean>> {
        return await Request.delete('license', DeleteResponseSchema);
    }

}