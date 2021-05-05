import React from "react"
import {__} from "@wordpress/i18n";

export interface IMessage {
    type: "error" | "success",
    msg: string
}

interface MessageProps {
    msg: IMessage | null
}

export const Message = (props : MessageProps) => {

    return props.msg === null ? null : (
        <div className={'wp-reminder-message' + (props.msg.type === "success" ? ' success' : ' error')}>
            <h3>{props.msg.type === "success" ? __('Success', 'wp-reminder') : __('Error', 'wp-reminder')}</h3>
            <span className='wp-reminder-message-text'>{props.msg.msg}</span>
        </div>
    )

}