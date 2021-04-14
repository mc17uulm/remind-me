import {JSONSchemaType} from "ajv";

export interface Repeat {
    id: number | null,
    event: number,
    clocking: number,
    day: number,
    start: number,
    end: number
}

export const RepeatSchema : JSONSchemaType<Repeat> = {
    type: "object",
    properties: {
        id: {
            type: "integer"
        },
        event: {
            type: "integer"
        },
        clocking: {
            type: "integer"
        },
        day: {
            type: "integer"
        },
        start: {
            type: "integer"
        },
        end: {
            type: "integer"
        }
    },
    required: ["event", "clocking", "day", "start", "end"],
    additionalProperties: false
}