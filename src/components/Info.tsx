import React from "react";
import {Popup} from "semantic-ui-react";

interface InfoProps {
    children?: React.ReactNode,
    position?: "bottom center" | "top left" | "top right" | "bottom right" | "bottom left" | "right center" | "left center" | "top center" | undefined
    header?: string
}

export const Info = (props : InfoProps) => {

    return (
        <Popup
            on={['hover', 'click']}
            content={props.children}
            header={props.header}
            position={props.position}
            trigger={
                <i className="fa fa-info-circle" />
            }
        />
    )

}