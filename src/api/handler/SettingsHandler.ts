import {JSONSchemaType} from "ajv";
import {Either} from "../Either";
import {PutResponseSchema, Request} from "../Request";

export interface Settings {
    text_privacy: string,
    template_check: string,
    template_accept: string,
    template_signout: string,
    signin_msg: string,
    double_opt_in_msg: string,
    signout_msg: string,
    settings_page: string
}

export const SettingsSchema : JSONSchemaType<Settings> = {
    type: "object",
    properties: {
        text_privacy: {
            type: "string"
        },
        template_check: {
            type: "string"
        },
        template_accept: {
            type: "string"
        },
        template_signout: {
            type: "string"
        },
        signin_msg: {
            type: "string"
        },
        double_opt_in_msg: {
            type: "string"
        },
        signout_msg: {
            type: "string"
        },
        settings_page: {
            type: "string"
        }
    },
    required: ["text_privacy", "template_check", "template_accept", "template_signout", "signin_msg", "double_opt_in_msg", "signout_msg", "settings_page"],
    additionalProperties: false
}

export class SettingsHandler
{

    public static async get() : Promise<Either<Settings>> {
        return await Request.get<Settings>('settings', SettingsSchema);
    }

    public static async update(settings : Settings) : Promise<Either<boolean>> {
        return await Request.put('settings', settings, PutResponseSchema);
    }

}