import {FrontendDefinitions} from "../View";
import ReactDOM from "react-dom";
import React from "react";
import "../styles/frontend.scss";
import {Request} from "../api/Request";
import {Subscription} from "../frontend/Subscription";

declare var remind_me_definitions : FrontendDefinitions;

(() => {

    const param = new URLSearchParams(window.location.search);

    if(!param.has('remind-me-action') || !param.has('remind-me-token')) {
        window.location.href = remind_me_definitions.base;
        return;
    }

    const action = param.get('remind-me-action');
    const token = param.get('remind-me-token') ?? "";
    const success : boolean = param.get('remind-me-success') === 'true';

    if(action !== 'edit') {
        window.location.href = remind_me_definitions.base;
        return;
    }

    const elem = document.getElementById('remind-me-frontend-form');
    if(elem !== null) {

        Request.initialize(
            remind_me_definitions.root,
            remind_me_definitions.nonce,
            remind_me_definitions.slug,
            remind_me_definitions.version
        );

        ReactDOM.render(<Subscription fresh={false} token={token} success={success} />, elem);

    }

})();