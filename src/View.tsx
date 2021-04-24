import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {Container} from "semantic-ui-react";
import {ToastContainer} from "react-toastify";
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'font-awesome/css/font-awesome.css';
import {Request} from "./api/Request";

export interface Definitions {
    root : string,
    nonce : string,
    slug : string,
    version : string,
    base : string,
    site : string
}

declare var wp_reminder_definitions : Definitions;

export class View {

    static run (element : React.ReactNode) : void {

        Request.initialize(
            wp_reminder_definitions.root,
            wp_reminder_definitions.nonce,
            wp_reminder_definitions.slug,
            wp_reminder_definitions.version
        );

        const elem = document.getElementById("wp_reminder_container");
        elem ? ReactDOM.render(
            <Container>
                <h1>WP Reminder</h1>
                {element}
                <ToastContainer position="bottom-center" autoClose={2000} />
            </Container>,
            elem
        ) : false;

    }

}