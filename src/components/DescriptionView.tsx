import React, {Fragment, useState} from "react";
import {Icon} from "./Icon";

interface DescriptionViewProps {
    description: string,
    count: number
}

export const DescriptionView = (props : DescriptionViewProps) => {

    const [open, setOpen] = useState<boolean>(false);

    const start = props.description.split(' ').slice(0, props.count).join(' ') + " ...";

    return (
        <Fragment>
            <a
                className='wp-reminder-link'
                onClick={() => setOpen(!open)}
            >
                <Icon class={open ? 'arrow-circle-up' : 'arrow-circle-right'} />
            </a>
            {" " + (open ? props.description : start)}
        </Fragment>
    )

}