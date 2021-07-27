import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import {BlockHandler} from "./block/BlockHandler";
import {Request} from "./api/Request";
import {Definitions} from "./View";
import "./styles/block";

export interface BlockAttributes {
    title: string,
    events: string
}

declare var wp_reminder_definitions : Definitions;

Request.initialize(
    wp_reminder_definitions.root,
    wp_reminder_definitions.nonce,
    wp_reminder_definitions.slug,
    wp_reminder_definitions.version
);

registerBlockType<BlockAttributes>('wp-reminder/block', {
    title: 'WPReminder Block',
    icon: 'post-status',
    category: 'layout',
    attributes: {
        title: {
            selector: 'div',
            source: 'attribute',
            attribute: 'data-title',
            type: 'string'
        },
        events: {
            selector: 'div',
            source: 'attribute',
            attribute: 'datalist-events',
            type: 'string'
        }
    },
    edit: (props) => <BlockHandler {...props} />,
    save: (props) => {
        return (
            <div
                id='wp-reminder-frontend-form'
                data-title={props.attributes.title}
                datalist-events={props.attributes.events}
            ></div>
        );
    }
})