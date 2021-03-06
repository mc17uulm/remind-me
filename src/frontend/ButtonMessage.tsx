import React, { Fragment } from "react";
import {IMessage} from "./Message";
import {__} from "@wordpress/i18n";

interface ButtonMessageProps {
    msg: IMessage | null
}

export const ButtonMessage = (props : ButtonMessageProps) => {

    if(props.msg === null) return <Fragment></Fragment>;

    return (
        <span
            className={`btn-text ${props.msg.type}`}
        >
            <strong>
                {props.msg.type === 'error' ?
                    __('Error', 'remind-me') :
                    __('Success', 'remind-me')
                }:
            </strong> {props.msg.msg}
        </span>
    )

}