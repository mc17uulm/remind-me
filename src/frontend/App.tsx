import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import "../styles/frontend.scss";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {Request} from "../api/Request";

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

    const [events, setEvents] = useState<APIEvent[]>([]);

    const loadEvents = async () => {
        const resp = await EventHandler.get_list(props.list);
        if(resp.has_error()) {
            console.error(resp.get_error());
            return;
        }
        setEvents(resp.get_value());
    }

    useEffect(() => {
        loadEvents();
    }, [props.list]);

    return (
        <div>
            <ul>
            {events.map((event : APIEvent, index : number) => (
                <li key={index}>{event.name}</li>
            ))}
            </ul>
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