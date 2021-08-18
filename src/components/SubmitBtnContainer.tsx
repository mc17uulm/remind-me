import React from "react";
import {IMessage} from "../frontend/Message";
import {__} from "@wordpress/i18n";
import { Fragment } from "react";
import {Icon} from "semantic-ui-react";

interface SubmitBtnContainerProps {
    message: IMessage | null
    children?: React.ReactNode
}

export const SubmitBtnContainer = (props : SubmitBtnContainerProps) => {

    return (
        <div className='remind-me-submit-container'>
            {props.message === null ? "" : (
                <span
                    className={`remind-me-btn-text ${props.message.type}`}
                >
                <strong>
                    {props.message.type === 'error' ?
                        (<Fragment><Icon name='times circle' /> {__('Error', 'remind-me')}</Fragment>) :
                        (<Fragment><Icon name='check circle' /> {__('Success', 'remind-me')}</Fragment>)
                    }:
                </strong> {props.message.msg}
            </span>
            )}
            {props.children}
        </div>
    )

}