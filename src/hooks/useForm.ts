import * as yup from 'yup';
import {ChangeEvent, FormEvent, useState} from "react";

interface FormError {
    hasError: boolean,
    error?: string
}

type Errors<S> = {
    [key in keyof S]: FormError
}

interface Form<S> {
    values: S,
    onChange: (e : ChangeEvent<HTMLInputElement>) => void,
    setValue: (key: keyof S, value: any) => void,
    handleSubmit: (e : FormEvent) => void,
    getError: (key : keyof S) => string | null,
    errors: Errors<S>
}

function clone<S>(values : S) : Errors<S> {
    return <{[key in keyof S]: FormError}>Object.entries(values).reduce(
        (p, [k, v]) => Object.assign(p, {[k]: {hasError: false}}), {}
    )
}

export const useForm = <T extends unknown>(defaultValue: T) : [Form<T>, (elem : T) => void] => {

    const [state, setStateValue] = useState<T>(defaultValue);
    const [errors, setErrors] = useState<Errors<T>>(clone(defaultValue));

    const onChange = (e : ChangeEvent<HTMLInputElement>) : void => {
        e.preventDefault();
        // @ts-ignore
        setValue(e.target.name, e.target.value);
    }

    const setValue = (key : keyof T, value : any) : void => {
        let _state : T = Object.assign({}, state);
        _state[key] = value;
        setStateValue(_state);
    }

    const setForm = (element : T) : void => {
        setStateValue(element);
    }

    const handleSubmit = (e : FormEvent) => {
        e.preventDefault();
    }

    const getError = (key : keyof T) : string | null => {
        const error = errors[key];
        if(!error.hasError) return null;
        return error.error ?? "";
    }

    const validate = async (schema : yup.AnySchema) : Promise<boolean> => {
        return await schema.isValid(state);
    }

    return [
        {
            values: state,
            onChange: onChange,
            setValue: setValue,
            handleSubmit: handleSubmit,
            getError: getError,
            errors: errors
        },
        setForm
    ]

}