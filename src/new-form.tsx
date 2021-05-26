import {FrontendDefinitions} from "./View";
import {Request} from "./api/Request";
import ReactDOM from "react-dom";
import React from "react";
import {Subscription} from "./frontend/Subscription";
import "./styles/frontend.scss";

declare var wp_reminder_definitions : FrontendDefinitions;

(() => {

    const elem = document.getElementById('wp-reminder-frontend-form');
    if(elem !== null) {
        const title = elem.getAttribute('data-title');
        const datalist = elem.getAttribute('datalist-events');
        let list : number[] = [];
        if(datalist !== null) {
            const parts = datalist.split(',');
            list = parts.map((val : string) => parseInt(val)).filter((val : number) => !isNaN(val));
        }
        Request.initialize(
            wp_reminder_definitions.root,
            wp_reminder_definitions.nonce,
            wp_reminder_definitions.slug,
            wp_reminder_definitions.version
        )
        ReactDOM.render(<Subscription fresh={true} list={list} title={title} />, elem);
    }

})();