import React, {useEffect, useState, MouseEvent, Fragment} from "react";
import ReactDOM from "react-dom";
import "../styles/frontend.scss";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {Request} from "../api/Request";
import {Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import {__} from "@wordpress/i18n";
import {useCheck} from "../hooks/Check";
import {SubscriberHandler} from "../api/handler/SubscriberHandler";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

const ClockingMap : {id: number, text: string}[] = [
    {id : 1, text : __('monthly', 'wp-reminder')},
    {id: 2, text: __('2-monthly', 'wp-reminder')},
    {id: 3, text: __('quarterly', 'wp-reminder')},
    {id: 4, text: __('4-monthly', 'wp-reminder')},
    {id: 6, text: __('half-yearly', 'wp-reminder')},
    {id: 12, text: __('yearly', 'wp-reminder')},
];

interface FormState {
    selected_events : APIEvent[],
    email_address: string,
}

const clockingToStr = (clocking : number) : string => {
    const elem = ClockingMap.filter((elem : {id : number, text: string}) => {
        return elem.id === clocking;
    });
    if(elem.length !== 1) return "";
    return elem[0].text;
}

enum AppState {
    LOADING,
    ERROR,
    FORM,
    SEND
}

const App = (props : AppProps) => {

    const [checked, handleCheck] = useCheck<APIEvent>();
    const [state, setState] = useState<AppState>(AppState.LOADING);
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<boolean>(false);
    const [acceptGDPR, setGDPR] = useState<boolean>(false);
    const [acceptGDPRError, setGDPRError] = useState<boolean>(false);
    const [events, setEvents] = useState<APIEvent[]>([]);
    const [settings, setSettings] = useState<Settings>();
    const [initialized, setInitialized] = useState<boolean>(false);
    const [send, setSend] = useState<boolean>(false);

    const load_events = async () => {
        const resp = await EventHandler.get_list(props.list);
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
            setState(AppState.ERROR);
            return;
        }
        setEvents(resp.get_value());
        handleCheck.set(resp.get_value());
        setState(AppState.FORM);
    }

    const load_settings = async () => {
        const resp = await SettingsHandler.get();
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
            return;
        }
        setSettings(resp.get_value());
    }

    useEffect(() => {
        load_settings();
        load_events();
    }, [props.list]);

    const resetErrors = () => {
        setEmailError(false);
        setGDPRError(false);
    }

    const handleSubmit = async (e : MouseEvent) => {
        e.preventDefault();
        resetErrors();
        let error = false;
        if(email === "") {
            setEmailError(true);
            error = true;
        }
        // TODO: check if email is valid email
        if(!acceptGDPR) {
            setGDPRError(true);
            error = true;
        }
        if(error) return;
        const resp = await SubscriberHandler.set({
            email: email,
            events: checked.filter((val) => val).map((_, index) => events[index].id)
        });
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
        } else {
            // TODO: get success message from settings
            toast.success(__('You subscribed successfully to our service', 'wp-reminder'));
        }
    }

    const renderEvents = () => {
        if(events.length === 0) {
            return (<span>{__('No events found', 'wp-reminder')}</span>)
        } else {
            return (
                <Fragment>
                    {events.map((event : APIEvent, index : number) => (
                        <div role="listitem" key={index} className='wp-reminder-event-item'>
                            <div className='wp-reminder-checkbox'>
                                <input readOnly tabIndex={0} type="checkbox" onChange={() => handleCheck.update(index)} checked={handleCheck.get(index)} />
                                <label>{event.name} - {clockingToStr(event.clocking)}</label>
                            </div>
                        </div>
                    ))}
                </Fragment>
            )
        }
    }

    const renderForm = () => {
        return (
            <div className="wp-reminder-registration-container">
                <div role="list" className='wp-reminder-events-list'>
                    {renderEvents()}
                </div>
                <div className={'wp-reminder-email-input' + (emailError ? ' error' : '')}>
                    <label>{__('Email address', 'wp-reminder')} *</label>
                    <input type="email" value={email} onChange={(e) => {resetErrors(); setEmail(e.target.value)}} />
                    <span className={emailError ? 'error-text' : 'hidden'}>{__('Please insert a valid email address', 'wp-reminder')}</span>
                </div>
                <div className={'wp-reminder-gdpr-check' + (acceptGDPRError ? ' error' : '')}>
                    <div className='wp-reminder-checkbox'>
                        <input readOnly tabIndex={0} type='checkbox' checked={acceptGDPR} onChange={() => {resetErrors(); setGDPR(!acceptGDPR)}} />
                        <label>* {settings?.text_privacy}</label>
                        <span className={acceptGDPRError ? 'error-text' : 'hidden'}>{__('You have to accept the GDPR guidelines to subscribe to our service', 'wp-reminder')}</span>
                    </div>
                </div>
                <span>* {__('All these fields are required', 'wp-reminder')}</span>
                <div className='wp-reminder-form-submit'>
                    <button onClick={handleSubmit}>{__('Submit', 'wp-reminder')}</button>
                </div>
            </div>
        );
    }

    const renderLoader = () => {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const renderError = () => {
        return (
            <div>

            </div>
        )
    }

    const renderSend = () => {
        return (
            <div>

            </div>
        )
    }

    switch(state) {
        case AppState.LOADING: return renderLoader();
        case AppState.FORM: return renderForm();
        case AppState.SEND: return renderSend();
        case AppState.ERROR: return renderError();
    }

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