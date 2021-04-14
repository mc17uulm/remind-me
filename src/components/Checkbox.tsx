import { FormikProps } from "formik";
import React, {FormEvent} from "react";
import {Form, CheckboxProps as CheckboxData} from "semantic-ui-react";

export interface CheckboxProps {
    toggle: boolean,
    name: string,
    label: string,
    checked: boolean,
    disabled?: boolean
}

export const Checkbox = (props : FormikProps<any> & CheckboxProps) => {

    const disabled = (typeof props.disabled === "undefined") ? false : props.disabled;

    return (
        <Form.Checkbox
            disabled={disabled}
            toggle={props.toggle}
            name={props.name}
            label={props.label}
            checked={props.checked}
            onChange={(e : FormEvent<HTMLInputElement>, data : CheckboxData) => props.setFieldValue(props.name, data.checked)}
        />
    )

}