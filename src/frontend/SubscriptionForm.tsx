import React, {Fragment, MouseEvent, useEffect, useState} from "react";
import {APIEvent} from "../api/handler/EventHandler";
import {Settings} from "../api/handler/SettingsHandler";
import {useForm} from "../hooks/useForm";
import {__, subscribe} from "@wordpress/i18n";
import {useCheckbox} from "../hooks/useCheckbox";
import {useLoader} from "../hooks/useLoader";
import {APISubscriber, Subscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import * as yup from "yup";
import {IMessage, Message} from "./Message";

interface RegisterFormProps {
    events: APIEvent[],
    subscriber?: APISubscriber,
    settings: Settings
}

interface FormObject {
    email: string,
    events: number[]
    accept: boolean
}

const empty_form : FormObject = {
    email: "",
    events: [],
    accept: false
}

export const ClockingMap : {id: number, text: string}[] = [
    {id : 1, text : __('monthly', 'wp-reminder')},
    {id: 2, text: __('2-monthly', 'wp-reminder')},
    {id: 3, text: __('quarterly', 'wp-reminder')},
    {id: 4, text: __('4-monthly', 'wp-reminder')},
    {id: 6, text: __('half-yearly', 'wp-reminder')},
    {id: 12, text: __('yearly', 'wp-reminder')},
];

const SubscriptionFormSchema : yup.SchemaOf<any> = yup.object({
    email: yup.string().email().required(__('Please insert a valid email address')),
    events: yup.array()
        .min(1, __('Please select at least one event', 'wp-reminder'))
        .required(__('Please select at least one event', 'wp-reminder')),
    accept: yup.boolean().oneOf([true], __('To subscribe to our service you have to accept the privacy settings', 'wp-reminder'))
})

export const clockingToStr = (clocking : number) : string => {
    const elem = ClockingMap.filter((elem : {id : number, text: string}) => {
        return elem.id === clocking;
    });
    if(elem.length !== 1) return "";
    return elem[0].text;
}

export const SubscriptionForm = (props : RegisterFormProps) => {

    const [form, setForm] = useForm<FormObject>(empty_form);
    const [checkbox] = useCheckbox<APIEvent>();
    const [submitting, doSubmitting] = useLoader();
    const [message, setMessage] = useState<IMessage | null>(null);
    const [step, setStep] = useState<number>(0);

    useEffect(() => {
        if(typeof props.subscriber !== "undefined") {
            const subscriber : Subscriber = props.subscriber;
            setForm({
                events: subscriber.events,
                email: subscriber.email,
                accept: true
            });
            const checked = props.events.map((event : APIEvent) => subscriber.events.includes(event.id));
            checkbox.set(props.events, checked);
        } else {
            checkbox.set(props.events);
        }
    }, []);

    const onSubmit = async (e : MouseEvent) => {
        e.preventDefault();
        await doSubmitting(async () => {
            const validate = await form.validate(SubscriptionFormSchema);
            if(validate.has_error()) {console.log("has error"); return;}
            let resp;
            if(typeof props.subscriber === "undefined") {
                console.log("set");
                resp = await SubscriberHandler.set({
                    email: form.values.email,
                    events: checkbox.filtered().map((_, index) => props.events[index].id)
                });
            } else {
                console.log("update");
                resp = await SubscriberHandler.update_by_token(
                    props.subscriber.token,
                    {
                        email: props.subscriber.email,
                        events: checkbox.filtered().map((_, index) => props.events[index].id)
                    }
                )
            }
            if(resp.has_error()) {
                console.error(resp.get_error());
                setMessage({type: "error", msg: resp.get_error()});
                return;
            }
            if(typeof props.subscriber === "undefined") {
                setMessage({
                    type: "success",
                    msg: props.settings.signin_msg
                });
                setStep(2);
                return;
            }
            setMessage({
                type: "success",
                msg: __('Updated subscription successful', 'wp-reminder')
            });
        });
    }

    const unsubscribe = async (e : MouseEvent) => {
        e.preventDefault();
        await doSubmitting(async () => {
            if(typeof props.subscriber !== "undefined") {
                const resp = await SubscriberHandler.unsubscribe(props.subscriber.token);
                if (resp.has_error()) {
                    console.error(resp.get_error());
                    setMessage({type: "error", msg: resp.get_error()})
                } else {
                    setMessage({type: "success", msg: props.settings.signout_msg});
                }
                setStep(2);
            }
        });
    }

    const selectEvent = (index : number) => {
        let list = checkbox.list();
        list[index] = !list[index];
        checkbox.update(index);
        form.setValue('events', list.filter(val => val).map((_, index) => props.events[index].id));
    }

    const renderEvents = () => {
        if(props.events.length === 0) {
            return (
                <span>{__('No events found', 'wp-reminder')}</span>
            )
        } else {
            return (
                <Fragment>
                    {props.events.map((event : APIEvent, index : number) => (
                        <div className='checkbox-container' key={`event_${index}`}>
                            <input
                                className={form.errors.events === null ? '' : 'error'}
                                readOnly
                                tabIndex={0}
                                type='checkbox'
                                onChange={() => selectEvent(index)}
                                checked={checkbox.get(index)}
                            />
                            <div className='checkbox-label'>
                                <label>{event.name}</label>
                                <p>{clockingToStr(event.clocking)}</p>
                            </div>
                        </div>
                    ))}
                </Fragment>
            )
        }
    }

    const renderSuccess = () => {
        return (
            <Message msg={message} />
        );
    }

    const renderConfirm = () => {
        return (
            <div className='unsubscribe-confirm-box'>
                {__('Do you really want to unsubscribe from our service?', 'wp-reminder')}
                <div className='btn-group'>
                    <button className='back' onClick={() => setStep(0)}>{__('No, go back', 'wp-reminder')}</button>
                    <button className='confirm' disabled={submitting} onClick={unsubscribe}>
                        {submitting ? __('Unsubscribing...', 'wp-reminder') : __('Yes, unsubscribe', 'wp-reminder')}
                    </button>
                </div>
            </div>
        )
    }

    const renderForm = () => {
        return (
            <form onSubmit={form.handleSubmit}>
                <div className='row'>
                    <label>{__('Events', 'wp-reminder')} *</label>
                    {renderEvents()}
                    <small className={form.errors.events === null ? 'hidden' : 'error-text'}>{form.errors.events}</small>
                </div>
                <div className='row'>
                    <label>{__('Email address', 'wp-reminder')} *</label>
                    <input
                        className={form.errors.email === null ? '' : 'error'}
                        type='email'
                        value={form.values.email}
                        name='email'
                        disabled={typeof props.subscriber !== "undefined"}
                        onChange={form.onChange}
                    />
                    <small className={form.errors.email === null ? 'hidden' : 'error-text'}>{form.errors.email}</small>
                </div>
                {(typeof props.subscriber === "undefined") ? (
                    <div className='row'>
                        <label>{__('Privacy settings', 'wp-reminder')}</label>
                        <div className='checkbox-container'>
                            <input
                                className={form.errors.accept === null ? '' : 'error'}
                                type='checkbox'
                                readOnly
                                tabIndex={0}
                                checked={form.values.accept}
                                onChange={() => form.setValue('accept', !form.values.accept)}
                            />
                            <div className='checkbox-label'>
                                <label>{props.settings.text_privacy}*</label>
                            </div>
                        </div>
                        <small className={form.errors.accept === null ? 'hidden' : 'error-text'}>{form.errors.accept}</small>
                    </div>
                ) : ""}
                <div className='row'>
                    <span className='small'>* {__('All these fields are required', 'wp-reminder')}</span>
                </div>
                {(typeof props.subscriber !== "undefined") ? (
                    <a onClick={() => setStep(1)}>{__('Unsubscribe')}</a>
                ) : ""}
                <Message msg={message} />
                <button type='button' disabled={submitting} onClick={onSubmit}>
                    {submitting ? __('Submitting...', 'wp-reminder') : __('Submit', 'wp-reminder')}
                </button>
            </form>
        );
    }

    switch (step) {
        case 0: return renderForm();
        case 1: return renderConfirm();
        case 2: return renderSuccess();
        default: return <Fragment>Internal Error</Fragment>;
    }

}