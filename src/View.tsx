import "@babel/polyfill/noConflict";
import React from "react";
import ReactDOM from "react-dom";
import {Container} from "semantic-ui-react";
import {ToastContainer} from "react-toastify";
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {Request} from "./api/Request";
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

declare var remind_me_definitions : Definitions;

export interface PluginSettings {
    active: boolean;
}

const Settings : PluginSettings = {
    active: remind_me_definitions.active === 'true'
}

export const PluginContext = React.createContext<PluginSettings>(Settings);

export class View {

    static run (element : React.ReactNode) : void {

        Request.initialize(
            remind_me_definitions.root,
            remind_me_definitions.nonce,
            remind_me_definitions.slug,
            remind_me_definitions.version
        );

        const elem = document.getElementById("remind_me_container");
        elem ? ReactDOM.render(
            <PluginContext.Provider value={Settings}>
                <Container>
                    <h1>RemindMe</h1>
                    <LicenseWarning active={Settings.active} />
                    {element}
                    <ToastContainer position="bottom-center" autoClose={2000} />
                </Container>
            </PluginContext.Provider>,
            elem
        ) : false;

    }

}