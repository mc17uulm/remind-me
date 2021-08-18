import * as yup from 'yup';
import {ChangeEvent, FormEvent, useState} from "react";
import {Either} from "../api/Either";
import {ValidationError} from "yup";

export type Errors<S> = {
    [key in keyof S]: string | null
}

export interface Form<S> {
    values: S,
    onChange: (e : ChangeEvent<HTMLInputElement>) => void,
    setValue: (key: keyof S, value: any) => void,
    handleSubmit: (e : FormEvent) => void,
    hasError: (key : keyof S) => boolean,
    hasErrors: () => boolean,
    getErrors: () => string[]
    validate: (schema : yup.SchemaOf<any>, customCallback?: (_state : S, errors : Errors<S>) => Errors<S>) => Promise<Either<S>>,
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
export const useForm = <T extends object>(defaultValue: T) : [Form<T>, (elem : T) => void] => {

    const [state, setStateValue] = useState<T>(defaultValue);
    const [errors, setErrors] = useState<Errors<T>>(clone(defaultValue));

    const onChange = (e : ChangeEvent<HTMLInputElement>) : void => {
        e.preventDefault();
        const name : keyof T = e.target.name as keyof T;
        setValue(name, e.target.value);
    }

    const setValue = (key : keyof T, value : any) : void => {
        setError(key, null);
        let _state : T = Object.assign({}, state);
        _state[key] = value;
        setStateValue(_state);
    }

    const setForm = (element : T) : void => {
        setStateValue(element);
        setErrors(clone(element));
    }

    const handleSubmit = (e : FormEvent) => {
        e.preventDefault();
    }

    const setError = (key : keyof T, error : string | null) : void => {
        let _errors : Errors<T> = Object.assign({}, errors);
        _errors[key] = error;
        setErrors(_errors);
    }

    const hasError = (key : keyof T) : boolean => {
        return errors[key] !== null;
    }

    const hasErrors = (_errors : Errors<T> = errors) : boolean => {
        for(let key in _errors) {
            if(_errors.hasOwnProperty(key) && (_errors[key] !== null)) return true;
        }
        return false;
    }

    const getErrors = () : string[] => {
        let _errors : string[] = [];
        for(let key in errors) {
            if(errors.hasOwnProperty(key)) {
                const elem = errors[key];
                if(elem !== null) {
                    // @ts-ignore
                    _errors.push(elem);
                }
            }
        }
        return _errors;
    }

    const validate = async (schema : yup.SchemaOf<any>, customCallback: (_state : T, errors : Errors<T>) => Errors<T> = () => clone(defaultValue)) : Promise<Either<T>> => {
        let _errors = customCallback(state, errors);
        try {
            await schema.validate(state, {
                abortEarly: false
            });
        }
            // @ts-ignore
        catch (e : ValidationError) {
            e.inner.map((el : ValidationError) => {
                // @ts-ignore
                _errors[el.path] = el.message;
            });
        }
        if(hasErrors(_errors)) {
            setErrors(_errors);
            console.log(_errors);
            return Either.error("");
        }
        return Either.success(state);
    }

    return [
        {
            values: state,
            onChange: onChange,
            setValue: setValue,
            handleSubmit: handleSubmit,
            hasError: hasError,
            hasErrors: hasErrors,
            getErrors: getErrors,
            validate: validate,
            errors: errors
        },
        setForm
    ]

}