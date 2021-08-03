import React, {Fragment, useState} from "react";
import {Icon} from "./Icon";
import {__} from "@wordpress/i18n";

interface DescriptionViewProps {
    description: string,
    count: number
}

export const DescriptionView = (props : DescriptionViewProps) => {

    const [open, setOpen] = useState<boolean>(false);

    if(props.description.length < props.count) {
        return (
            <Fragment>
                {props.description}
            </Fragment>
        );
    } else {
        const length = props.description.substr(0, props.count).split(' ').length;
        const split = props.description.split(' ').slice(0, length).join(' ');
        return (
            <Fragment>
                {(open ? props.description : split)}
                <br />
                <span style={{textAlign: 'center', display: 'block'}}>
                <a className='wp-reminder-link' onClick={() => setOpen(!open)}>
                    {open ? __('Close', 'wp-reminder') : __('Expand', 'wp-reminder')}
                </a>
                </span>
            </Fragment>
        )
    }

}