import {useState} from "react";
import {Either} from "../api/Either";
import {toast} from "react-toastify";
import React from "react";
import {Loader} from "../components/Loader";

export enum InitializeStates {
    Loading,
    Error,
    Success
}

type useInitializerResponse<S> = [
    SuccessResponse<S> | ErrorResponse | LoadingResponse,
    (callback : () => Promise<Either<S>>, show? : boolean, log? : boolean) => Promise<void>
];

interface SuccessResponse<S> {
    state: InitializeStates.Success,
    value: S
}

interface ErrorResponse {
    state: InitializeStates.Error,
}

interface LoadingResponse {
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
    const [state, setState] = useState<InitializeStates>(InitializeStates.Loading);

    // function is executed to asynchronously execute callback and handle Either response
    const load = async (callback : () => Promise<Either<T>>, show : boolean = true, log : boolean = true) : Promise<void> => {
        setState(InitializeStates.Loading);
        const res = await callback();
        if(res.has_error()) {
            if(show) toast.error(res.get_error());
            if(log) console.error(res.get_error());
            setState(InitializeStates.Error)
            return;
        } else {
            setElem(res.get_value());
            setState(InitializeStates.Success);
        }
    }

    /**
     * Loading and Error only deliver the state and the load function
     * while Success also delivers ALWAYS a value
     */
    switch(state) {
        case InitializeStates.Loading: return [{state: state}, load];
        case InitializeStates.Error: return [{state: state}, load];
        case InitializeStates.Success:
            if(typeof elem === "undefined") return [{state: InitializeStates.Error}, load];
            return [{state: state, value: elem}, load];
    }

}