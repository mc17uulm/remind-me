import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import {BlockHandler} from "../block/BlockHandler";
import {Request} from "../api/Request";
import {Definitions} from "../View";
import "../styles/frontend";
import "../styles/block.scss";

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
    icon: {
        src: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" version="1.1">
            <g id="surface1">
                <path d="M 25 32.652344 L 25 39.320312 C 23.160156 39.320312 21.667969 37.828125 21.667969 35.988281 C 21.667969 34.144531 23.160156 32.652344 25 32.652344 Z M 25 32.652344 "/>
                <path d="M 28.332031 35.988281 C 28.332031 37.828125 26.839844 39.320312 25 39.320312 L 25 32.652344 C 26.839844 32.652344 28.332031 34.144531 28.332031 35.988281 Z M 28.332031 35.988281 "/>
                <path d="M 37.3125 32.128906 L 34.523438 34.914062 L 33.628906 34.015625 L 25 34.015625 L 25 12.898438 C 30.261719 12.898438 34.527344 17.167969 34.527344 22.425781 L 34.527344 29.34375 Z M 37.3125 32.128906 "/>
                <path d="M 26.667969 31.578125 L 36.09375 31.578125 C 37.011719 31.578125 37.757812 32.324219 37.757812 33.246094 L 37.757812 34.308594 C 37.757812 35.230469 37.011719 35.976562 36.09375 35.976562 L 26.667969 35.976562 C 25.746094 35.976562 25 35.230469 25 34.308594 L 25 33.246094 C 25 32.324219 25.746094 31.578125 26.667969 31.578125 Z M 26.667969 31.578125 "/>
                <path d="M 25 31.199219 L 27.601562 31.199219 L 27.601562 35.976562 L 25 35.976562 Z M 25 31.199219 "/>
                <path d="M 25 12.898438 L 25 34.015625 L 16.371094 34.015625 L 15.476562 34.914062 L 12.6875 32.125 L 15.476562 29.339844 L 15.476562 22.429688 C 15.476562 17.167969 19.738281 12.902344 25 12.898438 Z M 25 12.898438 "/>
                <path d="M 13.90625 31.578125 L 23.332031 31.578125 C 24.253906 31.578125 25 32.324219 25 33.246094 L 25 34.308594 C 25 35.230469 24.253906 35.976562 23.332031 35.976562 L 13.90625 35.976562 C 12.988281 35.976562 12.242188 35.230469 12.242188 34.308594 L 12.242188 33.246094 C 12.242188 32.324219 12.988281 31.578125 13.90625 31.578125 Z M 13.90625 31.578125 "/>
                <path d="M 22.398438 31.976562 L 25 31.976562 L 25 35.988281 L 22.398438 35.988281 Z M 22.398438 31.976562 "/>
            </g>
        </svg>

    },
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
            />
        );
    }
})