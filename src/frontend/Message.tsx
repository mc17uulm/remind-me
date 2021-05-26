import React, {useState, MouseEvent} from "react"
import {__} from "@wordpress/i18n";

export interface IMessage {
    type: "error" | "success",
    msg: string
}

interface MessageProps {
    msg: IMessage | null,
    exit?: boolean
}

export const Message = (props : MessageProps) => {

    const [show, setShow] = useState<boolean>(true);

    const onExit = (e : MouseEvent) => {
        e.preventDefault();
        setShow(false);
    }

    const exit = (typeof props.exit === "undefined") ? false : props.exit;

    if(!show) return null;

    return props.msg === null ? null : (
        <div className={'alert alert-' + (props.msg.type === "success" ? 'success' : 'danger')}>
            <h4>{props.msg.type === "success" ? __('Success', 'wp-reminder') : __('Error', 'wp-reminder')}</h4>
            {props.msg.msg}
            {exit ? (
                <button onClick={onExit}></button>
            ) : ""}
        </div>
    )

}