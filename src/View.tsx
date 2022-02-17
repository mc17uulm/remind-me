import "@babel/polyfill/noConflict";
import React, {ReactNode} from "react";
import ReactDOM from "react-dom";
import {Container} from "semantic-ui-react";
import {ToastContainer} from "react-toastify";
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {Request} from "./api/Request";

export interface FrontendDefinitions {
    root : string,
    slug : string,
    nonce : string,
    version : string,
    base: string,
    active: string
}

export interface Definitions extends FrontendDefinitions {
    site : string
}

declare var remind_me_definitions : Definitions;

export const View = (element : ReactNode, key : string = 'remind-me-container') : void => {

    Request.initialize(
        remind_me_definitions.root,
        remind_me_definitions.nonce,
        remind_me_definitions.slug,
        remind_me_definitions.version
    );

    const elem = document.getElementById("remind-me-container");
    elem ? ReactDOM.render(
        <Container>
            <h1>RemindMe</h1>
            {element}
            <ToastContainer position="bottom-center" autoClose={2000} />
        </Container>,
        elem
    ) : false;

}