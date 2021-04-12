import Ajv, {JSONSchemaType} from "ajv";
import {Either} from "./Either";

export interface ResponseObject {
    id: number
}

interface Response <S> {
    status: "error" | "success",
    message: "string",
    data: S,
    debug_message: string
}

const ResponseSchema = <T>(schema : JSONSchemaType<T>) : JSONSchemaType<Response<T>> => {
    return {
        type: "object",
        properties: {
            status: {
                type: "string",
                enum: ["success", "error"]
            },
            //@ts-ignore
            data: schema,
            message: {
                type: "string"
            },
            debug_message: {
                type: "string"
            }
        },
        anyOf: [
            {
                properties: {
                    // @ts-ignore
                    status: {const: "error"}
                },
                required: ["message"]
            }, {
                properties: {
                    // @ts-ignore
                    status: {const: "success"}
                },
                required: ["data"]
            }
        ],
        required: ["status"],
        additionalProperties: false
    }
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
        const r = await this.send(type, path, {'X-WP-Nonce': this.nonce, 'Content-Type': 'application/json; charset=UTF-8'}, JSON.stringify(data));
        return Request.validate<T>(r, schema);
    }

    private static validate<S>(body : any, schema : JSONSchemaType<S>) : Either<S> {
        try {
            const response = JSON.parse(body);
            const ajv = new Ajv();
            const validate = ajv.compile(ResponseSchema<S>(schema));
            if(!validate(response)) {
                console.error(validate.errors);
                return Either.error("Invalid Response");
            }
            if(response.status === "error") {
                console.info(response.debug_message);
                return Either.error(response.message);
            } else {
                return Either.success(response.data);
            }
        } catch (err) {
            console.error(err.message);
            return Either.error("Invalid Response");
        }
    }

    public static async send(type : RequestType, url : string, headers : object = {}, body : any = "") : Promise<any> {
        return new Promise(((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open(type.valueOf(), url);
            Object.keys(headers).forEach((key : string) => {
                // @ts-ignore
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = () => {
                if(xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            };

            xhr.onerror = () => {
                reject(xhr.statusText);
            }

            xhr.send(body);

        }));
    }

}