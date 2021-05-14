import React, {Fragment, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {Request} from "../api/Request";
import {__} from "@wordpress/i18n";
import {EditSettingsForm} from "./EditSettingsForm";
import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";

export interface Definitions {
    root : string,
    slug : string,
    nonce : string,
    version : string,
    base: string
}

declare var wp_reminder_definitions : Definitions;

interface SettingsProps {
    token: string,
    success: boolean
}

const Settings = (props : SettingsProps) => {

    const [subscriber, setSubscriber] = useState<APISubscriber>();
    const [events, setEvents] = useState<APIEvent[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        const sub_resp = await SubscriberHandler.get(props.token);
        if(sub_resp.has_error()) {
            console.error(sub_resp.get_error());
            setError(sub_resp.get_error());
            setLoading(false);
            return
        }
        const event_resp = await EventHandler.get_all();
        if(event_resp.has_error()) {
            console.error(event_resp.get_error());
            setError(event_resp.get_error());
            setLoading(false);
            return;
        }
        setSubscriber(sub_resp.get_value());
        setEvents(event_resp.get_value());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const renderForm = () => {
        if(loading) return <div>Loading</div>;
        if((typeof subscriber !== "undefined") && (typeof events !== "undefined")) {
            return <EditSettingsForm subscriber={subscriber} events={events} />;
        }
        return "";
    }

    return (
        <Fragment>
            {props.success ? (
                <div>
                    <h3>{__('Success', 'wp-reminder')}</h3>
                    {__('You subscribed successfully')}
                </div>
            ) : ""}
            {renderForm()}
        </Fragment>
    );


}

export const run = () => {

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

    const elem = document.getElementById('wp-reminder-frontend-settings-form');
    if(elem !== null) {

        Request.initialize(
            wp_reminder_definitions.root,
            wp_reminder_definitions.nonce,
            wp_reminder_definitions.slug,
            wp_reminder_definitions.version
        );

        ReactDOM.render(<Settings token={token} success={success} />, elem);

    }
}