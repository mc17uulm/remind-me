import React from "react";
import {Message} from "semantic-ui-react";
import {__} from "@wordpress/i18n";

interface ErrorProps {
    children: React.ReactNode
}

export const Error = (props : ErrorProps) => {

    return (
        <Message negative>
            <Message.Header>{__('Error', 'wp-reminder')}</Message.Header>
            {props.children}
        </Message>
    );

}