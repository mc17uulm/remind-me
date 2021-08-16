import {Message} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React, {useEffect, useState} from "react";
import { Fragment } from "react";
import {useCookie} from "../hooks/useCookie";

export const LicenseWarning = (props : {active: boolean}) => {

    if(props.active) return <Fragment></Fragment>;
    const [cookie, setCookie] = useCookie('wp-reminder-license-notice');
    const [open, setOpen] = useState<boolean>(true);

    useEffect(() => {
        if(cookie === 'false') {
            setOpen(false);
        }
    }, [cookie]);

    const onClose = () => {
        setOpen(false);
        setCookie('false', 60);
    }

    return open ? (
        <Message
            warning
            onDismiss={onClose}
        >
            <Message.Header>{__('Plugin not licensed', 'wp-reminder')}</Message.Header>
            <p>{__('You have no license added. Some functions are therefore not available', 'wp-reminder')}</p>
        </Message>
    ) : <Fragment></Fragment>;

}