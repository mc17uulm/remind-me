import React, {MouseEvent} from "react";
import {Icon} from "../Icon";

interface StyleButtonProps {
    label: string,
    key: string,
    active: boolean,
    onToggle: (style : string) => void,
    style: string,
    icon: string
}

export const StyleButton = (props : StyleButtonProps) => {

    const onToggle = (e : MouseEvent) => {
        e.preventDefault();
        props.onToggle(props.style);
    }

    return (
        <span onMouseDown={onToggle} className={"RichEditor-styleButton" + (props.active ? " RichEditor-activeButton" : "")}>
            <Icon class={`fa fa-${props.icon}`} />
        </span>
    )

}