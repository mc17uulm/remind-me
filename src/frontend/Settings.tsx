import {Request} from "../api/Request";

export interface Definitions {
    root : string,
    slug : string,
    nonce : string,
    version : string,
    base: string
}

declare var wp_reminder_definitions : Definitions;

export const run = () => {

    const param = new URLSearchParams(window.location.search);

    if(!param.has('wp-reminder-token')) {
        window.location.href = wp_reminder_definitions.base;
        return;
    }

    const token = param.get('wp-reminder-token');
    console.log(token);

    const elem = document.getElementById('wp-reminder-frontend-settings-form');
    if(elem !== null) {



        Request.initialize(
            wp_reminder_definitions.root,
            wp_reminder_definitions.nonce,
            wp_reminder_definitions.slug,
            wp_reminder_definitions.version
        );



    }
}