import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import "../styles/frontend.scss";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {Request} from "../api/Request";
import {Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import 'react-toastify/dist/ReactToastify.css';
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Either} from "../api/Either";
import {Loader} from "./Loader";
import { RegisterForm } from "./RegisterForm";
import {Message} from "./Message";

interface AppProps {
    list: number[]
}

export interface Definitions {
    root : string,
    slug : string,
    nonce : string,
    version : string
}

declare var wp_reminder_definitions : Definitions;

const App = (props : AppProps) => {

    const [initObject, load] = useInitializer<{events: APIEvent[], settings: Settings}>();

    useEffect(() => {
        load(async () => {
            const settings = await SettingsHandler.get();
            const events = await EventHandler.get_list(props.list);
            if(settings.has_error() || events.has_error()) {
                return Either.error(settings.get_error() + " | " + events.get_error());
            } else {
                return Either.success({
                    events: events.get_value(),
                    settings: settings.get_value()
                });
            }
        })
    }, [props.list]);

    return (
        <div className='wp-reminder-registration-container'>
            {() => {
                switch(initObject.state) {
                    case InitializeStates.Loading: return <Loader />;
                    case InitializeStates.Error: return <Message msg={{type: "error", msg: ''}} />;
                    case InitializeStates.Success: return <RegisterForm events={initObject.value.events} settings={initObject.value.settings} />;
                }
            }}
        </div>
    )
}

export const run = () => {
    const elem = document.getElementById('wp-reminder-frontend-form');
    if(elem !== null) {
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
        ReactDOM.render(<App list={list} />, elem);
    }
}