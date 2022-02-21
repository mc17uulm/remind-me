import {FrontendDefinitions} from "../View";
import ReactDOM from "react-dom";
import React from "react";
import {Subscription} from "../frontend/Subscription";
import "../styles/frontend.scss";
import {Request} from "../api/Request";

declare var remind_me_definitions : FrontendDefinitions;

const elem = document.getElementById('remind-me-frontend-form');

if(elem !== null) {

    const title = elem.getAttribute('data-title');
    const datalist = elem.getAttribute('datalist-events');

    let list : number[] = [];
    if(datalist !== null) {

        const result = JSON.parse(datalist);
        if(Array.isArray(result)) {
            list = result.filter((elem: any) => !isNaN(elem));
        }

    }

    Request.initialize(
        remind_me_definitions.root,
        remind_me_definitions.nonce,
        remind_me_definitions.slug,
        remind_me_definitions.version
    );

    ReactDOM.render(<Subscription fresh={true} list={list} title={title} />, elem);
}