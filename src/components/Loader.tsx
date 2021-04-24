import React from "react";
import {Dimmer, Placeholder, Loader as LoaderContainer, Segment} from "semantic-ui-react";
import {__} from "@wordpress/i18n";

export const Loader = () => {

    return (
        <Segment style={{height: "250px"}}>
            <Dimmer active>
                <LoaderContainer>{__('Loading', 'wp-reminder')}</LoaderContainer>
            </Dimmer>

            <Placeholder />
        </Segment>
    )

}