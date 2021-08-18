import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {PublicSettings, Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import React, {Fragment, useEffect} from "react";
import {Either} from "../api/Either";
import {Loader} from "./Loader";
import {Message} from "./Message";
import {SubscriptionForm} from "./SubscriptionForm";
import {__} from "@wordpress/i18n";

interface FreshForm {
    fresh: true,
    list: number[],
    title: string | null
}

interface EditForm {
    fresh: false,
    token: string,
    success: boolean
}

type SubscriptionProps = FreshForm | EditForm;

interface SubscriptionSettingsState {
    subscriber?: APISubscriber,
    events: APIEvent[],
    settings: PublicSettings
}

export const Subscription = (props : SubscriptionProps) => {

    const [initObject, load] = useInitializer<SubscriptionSettingsState>();

    useEffect(() => {
        load(async () => {
            const settings = await SettingsHandler.get_public();
            if(settings.has_error()) return Either.error(settings.get_error());
            const events = props.fresh ? await EventHandler.get_list(props.list) : await EventHandler.get_all();
            if(events.has_error()) return Either.error(events.get_error());
            let subscriber : APISubscriber | undefined;
            if(!props.fresh) {
                const subscriber_response = await SubscriberHandler.get(props.token);
                if(subscriber_response.has_error()) return Either.error(subscriber_response.get_error());
                subscriber = subscriber_response.get_value();
            }
            return Either.success({
                events: events.get_value(),
                settings: settings.get_value(),
                subscriber: subscriber
            });
        })
    }, []);

    const render = () => {
        switch(initObject.state) {
            case InitializeStates.Loading: return <Loader />;
            case InitializeStates.Error: return <Message msg={{type: "error", msg: ''}} />;
            case InitializeStates.Success: return <SubscriptionForm subscriber={initObject.value.subscriber} events={initObject.value.events} settings={initObject.value.settings} />;
        }
    }

    const renderHeader = () => {
        if(props.fresh) {
            return props.title !== null ? (<h4>{props.title}</h4>) : __('Subscription', 'remind-me');
        } else {
            const success = props.success ? <Message exit msg={{type: 'success', msg: __('You subscribed successfully', 'remind-me')}} /> : "";
            return (
                <Fragment>
                    <h4>{__('Subscription Settings', 'remind-me')}</h4>
                    {success}
                </Fragment>
            );
        }
    }

    return (
        <div className='remind-me-container'>
            {renderHeader()}
            {render()}
        </div>
    )

}