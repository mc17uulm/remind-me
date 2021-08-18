import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import {BlockHandler} from "./block/BlockHandler";
import {Request} from "./api/Request";
import {Definitions} from "./View";
import "./styles/frontend";
import "./styles/block.scss";

export interface BlockAttributes {
    title: string,
    events: string
}

declare var remind_me_definitions : Definitions;

Request.initialize(
    remind_me_definitions.root,
    remind_me_definitions.nonce,
    remind_me_definitions.slug,
    remind_me_definitions.version
);

registerBlockType<BlockAttributes>('remind-me/block', {
    title: 'RemindMe Block',
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
                id='remind-me-frontend-form'
                data-title={props.attributes.title}
                datalist-events={props.attributes.events}
            ></div>
        );
    }
})