import Ajv, {JSONSchemaType} from "ajv";
import {Either} from "./Either";

interface Error {
    status: "error",
    message: string,
    debug: string | null
}

const ErrorSchema : JSONSchemaType<Error> = {
    type: "object",
    properties: {
        status: {
            type: "string",
            enum: ["error"]
        },
        message: {
            type: "string"
        },
        debug: {
            type: "string"
        }
    },
    required: ["status", "message"],
    additionalProperties: false
}

export const PostResponseSchema : JSONSchemaType<number> = {
    type: "number"
}

export const PutResponseSchema : JSONSchemaType<boolean> = {
    type: "boolean"
}

export const DeleteResponseSchema : JSONSchemaType<boolean> = {
    type: "boolean"
}

interface Response {
    code: number,
    content: string
}

export enum RequestType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export class Request {

    private static base : string = "/";
    private static nonce : string = "";

    public static initialize(root : string, nonce : string, slug : string, version : string) : void {
        this.base = `${root}${slug}/${version}/`;
        this.nonce = nonce;
    }

    public static async get<T>(path : string, schema : JSONSchemaType<T>) : Promise<Either<T>> {
        return await this.handle<T>(RequestType.GET, `${this.base}${path}`, "", schema);
    }

    public static async post<T>(path : string, data : any, schema : JSONSchemaType<T>) : Promise<Either<T>> {
        return await this.handle<T>(RequestType.POST, `${this.base}${path}`, data, schema);
    }

    public static async put<T>(path : string, data : any, schema : JSONSchemaType<T>) : Promise<Either<T>> {
        return await this.handle<T>(RequestType.PUT, `${this.base}${path}`, data, schema);
    }

    public static async delete<T>(path : string, schema : JSONSchemaType<T>) : Promise<Either<T>> {
        return await this.handle<T>(RequestType.DELETE, `${this.base}${path}`, "", schema);
    }

    private static async handle<T>(type : RequestType, path : string, data : any, schema : JSONSchemaType<T>) : Promise<Either<T>> {
        const response : Response = await this.send(type, path, {'X-WP-Nonce': this.nonce, 'Content-Type': 'application/json; charset=UTF-8'}, JSON.stringify(data));
        return Request.validate<T>(response, schema);
    }

    private static validate<S>(response : Response, schema : JSONSchemaType<S>) : Either<S> {
        try {
            if(response.code === 200) {
                const content : S = this.compile<S>(schema, JSON.parse(response.content));
                return Either.success(content);
            } else {
                const error : Error = this.compile<Error>(ErrorSchema, JSON.parse(response.content));
                return Either.error(error.message);
            }
        } catch (err) {
            return Either.error("Invalid response");
        }
    }

    private static compile<S>(schema : JSONSchemaType<S>, content : any) : S {
        const ajv = new Ajv();
        const validator = ajv.compile(schema);
        const valid = validator(content);
        if(!valid) {
            console.error(validator.errors);
            throw new Error(validator.errors?.toString() ?? "");
        }
        return content;
    }

    public static async send(type : RequestType, url : string, headers : object = {}, body : any = "") : Promise<Response> {
        return new Promise(((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open(type.valueOf(), url);
            Object.keys(headers).forEach((key : string) => {
                // @ts-ignore
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = () => {
                resolve({code: xhr.status, content: xhr.response});
            };

            xhr.onerror = () => {
                reject(xhr.statusText);
            }

            xhr.send(body);

        }));
    }

}