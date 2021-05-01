import * as yup from 'yup';
import {ChangeEvent, FormEvent, useState} from "react";
import {Either} from "../api/Either";
import {ValidationError} from "yup";

interface FormError {
    hasError: boolean,
    error?: string
}

type Errors<S> = {
    [key in keyof S]: string | null
}

interface Form<S> {
    values: S,
    onChange: (e : ChangeEvent<HTMLInputElement>) => void,
    setValue: (key: keyof S, value: any) => void,
    handleSubmit: (e : FormEvent) => void,
    getError: (key : keyof S) => string | null,
    validate: (schema : yup.SchemaOf<S>) => Promise<Either<S>>,
    errors: Errors<S>
}

function clone<S>(values : S) : Errors<S> {
    return <{[key in keyof S]: string | null}>Object.entries(values).reduce(
        (p, [k, v]) => Object.assign(p, {[k]: null}), {}
    )
}

/**
 * The useForm hook handles the state of a form.
 * @param defaultValue
 */
export const useForm = <T extends unknown>(defaultValue: T) : [Form<T>, (elem : T) => void] => {

    const [state, setStateValue] = useState<T>(defaultValue);
    const [errors, setErrors] = useState<Errors<T>>(clone(defaultValue));

    const onChange = (e : ChangeEvent<HTMLInputElement>) : void => {
        e.preventDefault();
        // @ts-ignore
        setValue(e.target.name, e.target.value);
    }

    const setValue = (key : keyof T, value : any) : void => {
        setErrors(clone(defaultValue));
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
        return errors[key];
    }

    const validate = async (schema : yup.SchemaOf<T>) : Promise<Either<T>> => {
        setErrors(clone(defaultValue));
        try {
            const res = await schema.validate(state, {
                abortEarly: false
            });
            return Either.success(state);
        }
        // @ts-ignore
        catch (e : ValidationError) {
            let _errors = Object.assign({}, errors);
            e.inner.map((el : ValidationError) => {
                // @ts-ignore
                _errors[el.path] = el.message;
            });
            setErrors(_errors);
            return Either.error("");
        }
    }

    return [
        {
            values: state,
            onChange: onChange,
            setValue: setValue,
            handleSubmit: handleSubmit,
            getError: getError,
            validate: validate,
            errors: errors
        },
        setForm
    ]

}