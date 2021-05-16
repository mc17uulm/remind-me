import React from "react";
import {Popup} from "semantic-ui-react";

interface InfoProps {
    children?: React.ReactNode,
    position?: "bottom center" | "top left" | "top right" | "bottom right" | "bottom left" | "right center" | "left center" | "top center" | undefined
    header?: string,
    popup?: boolean
}

export const Info = ({children, position, header, popup = true} : InfoProps) => {

    return popup ? (
        <Popup
            on={['hover', 'click']}
            content={children}
            header={header}
            position={position}
            trigger={
                <i className="fa fa-info-circle" />
            }
        />
    ) : (
        <span><i className="fa fa-info-circle" /> {children}</span>
    )

}