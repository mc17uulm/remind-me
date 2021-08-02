import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {DeleteResponseSchema, PutResponseSchema, Request} from "../Request";

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

export interface PublicSettings {
    messages: Messages,
    license: boolean,
    privacy_text: string
}

export interface Settings {
    messages: Messages,
    license: License,
    settings_page: string,
    privacy_text: string
}

export interface APISettings extends Settings {
    license: APILicense
}

export const PublicSettingsSchema : JSONSchemaType<PublicSettings> = {
    type: "object",
    properties: {
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
            type: "boolean"
        },
        privacy_text: {
            type: "string"
        }
    },
    required: [
        "messages",
        "license",
        "privacy_text"
    ],
    additionalProperties: false
}

export const SettingsSchema : JSONSchemaType<APISettings> = {
    type: "object",
    properties: {
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

    public static async get_public() : Promise<Either<PublicSettings>> {
        return await Request.get<PublicSettings>('public/settings', PublicSettingsSchema);
    }

    public static async update(settings : Settings) : Promise<Either<boolean>> {
        return await Request.put('settings', settings, PutResponseSchema);
    }

    public static async remove_license() : Promise<Either<boolean>> {
        return await Request.delete('license', DeleteResponseSchema);
    }

}