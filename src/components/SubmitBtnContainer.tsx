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
        <div className='wp-reminder-submit-container'>
            {props.message === null ? "" : (
                <span
                    className={`wp-reminder-btn-text ${props.message.type}`}
                >
                <strong>
                    {props.message.type === 'error' ?
                        (<Fragment><Icon name='times circle' /> {__('Error', 'wp-reminder')}</Fragment>) :
                        (<Fragment><Icon name='check circle' /> {__('Success', 'wp-reminder')}</Fragment>)
                    }:
                </strong> {props.message.msg}
            </span>
            )}
            {props.children}
        </div>
    )

}