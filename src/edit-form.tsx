import {FrontendDefinitions} from "./View";
import {Request} from "./api/Request";
import ReactDOM from "react-dom";
import React from "react";
import {Subscription} from "./frontend/Subscription";
import "./styles/frontend.scss";

declare var wp_reminder_definitions : FrontendDefinitions;

(() => {

    const param = new URLSearchParams(window.location.search);

    if(!param.has('wp-reminder-action') || !param.has('wp-reminder-token')) {
        window.location.href = wp_reminder_definitions.base;
        return;
    }

    const action = param.get('wp-reminder-action');
    const token = param.get('wp-reminder-token') ?? "";
    const success : boolean = param.get('wp-reminder-success') === 'true';

    if(action !== 'edit') {
        window.location.href = wp_reminder_definitions.base;
        return;
    }

    const elem = document.getElementById('wp-reminder-frontend-form');
    if(elem !== null) {

        Request.initialize(
            wp_reminder_definitions.root,
            wp_reminder_definitions.nonce,
            wp_reminder_definitions.slug,
            wp_reminder_definitions.version
        );

        ReactDOM.render(<Subscription fresh={false} token={token} success={success} />, elem);

    }

})();