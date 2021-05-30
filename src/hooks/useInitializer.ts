import {useState} from "react";
import {Either} from "../api/Either";

export enum InitializeStates {
    Loading,
    Error,
    Success
}

export type InitializerResponse<S> = SuccessResponse<S> | ErrorResponse | LoadingResponse;

export type useInitializerResponse<S> = [
    InitializerResponse<S>,
    (callback : () => Promise<Either<S>>) => Promise<Either<S>>
];

export interface SuccessResponse<S> {
    state: InitializeStates.Success,
    value: S
}

export interface ErrorResponse {
    state: InitializeStates.Error,
    error: string
}

export interface LoadingResponse {
    state: InitializeStates.Loading
}

/**
 * The useInitializer hook loads a resource asynchronously.
 * While loading it has the state 'loading'
 * If the resource was returned successfully (via Either.success) the state is set to 'success' and the resource is saved in state
 * If there was an error the state is set to 'error' (and printed to console/toast; if load function has given parameters)
 */
export const useInitializer = <T extends unknown>() : useInitializerResponse<T> => {

    const [elem, setElem] = useState<T>();
    const [error, setError] = useState<string>("");
    const [state, setState] = useState<InitializeStates>(InitializeStates.Loading);

    // function is executed to asynchronously execute callback and handle Either response
    const load = async (callback : () => Promise<Either<T>>) : Promise<Either<T>> => {
        setState(InitializeStates.Loading);
        const res = await callback();
        if(res.has_error()) {
            setState(InitializeStates.Error);
            setError(res.get_error());
        } else {
            setState(InitializeStates.Success);
            setElem(res.get_value());
        }
        return res;
    }

    /**
     * Loading and Error only deliver the state and the load function
     * while Success also delivers ALWAYS a value
     */
    switch(state) {
        case InitializeStates.Loading: return [{state: state}, load];
        case InitializeStates.Error: return [{state: state, error: error}, load];
        case InitializeStates.Success:
            if(typeof elem === "undefined") return [{state: InitializeStates.Error, error: 'Invalid state'}, load];
            return [{state: state, value: elem}, load];
    }

}