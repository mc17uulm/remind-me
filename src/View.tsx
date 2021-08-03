import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {Container, Message} from "semantic-ui-react";
import {ToastContainer} from "react-toastify";
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'font-awesome/css/font-awesome.css';
import {Request} from "./api/Request";
import {__} from "@wordpress/i18n";
import {LicenseWarning} from "./components/LicenseWarning";

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

declare var wp_reminder_definitions : Definitions;

export interface PluginSettings {
    active: boolean;
}

const Settings : PluginSettings = {
    active: wp_reminder_definitions.active === 'true'
}

export const PluginContext = React.createContext<PluginSettings>(Settings);

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
            <PluginContext.Provider value={Settings}>
                <Container>
                    <h1>WP Reminder</h1>
                    <LicenseWarning active={Settings.active} />
                    {element}
                    <ToastContainer position="bottom-center" autoClose={2000} />
                </Container>
            </PluginContext.Provider>,
            elem
        ) : false;

    }

}