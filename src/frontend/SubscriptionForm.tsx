import React, {Fragment, MouseEvent, useEffect, useState} from "react";
import {APIEvent} from "../api/handler/EventHandler";
import {PublicSettings} from "../api/handler/SettingsHandler";
import {useForm} from "../hooks/useForm";
import {__} from "@wordpress/i18n";
import {useCheckbox} from "../hooks/useCheckbox";
import {useLoader} from "../hooks/useLoader";
import {APISubscriber, Subscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import * as yup from "yup";
import {IMessage, Message} from "./Message";
import {ButtonMessage} from "./ButtonMessage";
import {EventCheckbox} from "./EventCheckbox";

interface RegisterFormProps {
    events: APIEvent[],
    subscriber?: APISubscriber,
    settings: PublicSettings
}

export interface FormObject {
    email: string,
    events: number[]
    accept: boolean
}

const empty_form : FormObject = {
    email: "",
    events: [],
    accept: false
}

const SubscriptionFormSchema : yup.SchemaOf<any> = yup.object({
    email: yup.string().email().required(__('Please insert a valid email address', 'wp-reminder')),
    events: yup.array()
        .min(1, __('Please select at least one event', 'wp-reminder'))
        .required(__('Please select at least one event', 'wp-reminder')),
    accept: yup.boolean().oneOf([true], __('To subscribe to our service you have to accept the privacy settings', 'wp-reminder'))
})

export const SubscriptionForm = (props : RegisterFormProps) => {

    const [form, setForm] = useForm<FormObject>(empty_form);
    const checkbox = useCheckbox<APIEvent>();
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
            if(validate.has_error()) return;
            let resp;
            const selected = props.events
                .filter((event : APIEvent, index : number) => {
                    return checkbox.list()[index];
                })
                .map((event: APIEvent) => {
                   return event.id;
                });
            if(typeof props.subscriber === "undefined") {
                resp = await SubscriberHandler.set({
                    email: form.values.email,
                    events: selected
                });
            } else {
                resp = await SubscriberHandler.update_by_token(
                    props.subscriber.token,
                    {
                        email: props.subscriber.email,
                        events: selected
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
                    msg: props.settings.messages.signin
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
                    setMessage({type: "success", msg: props.settings.messages.signout});
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
        return (
            <Fragment>
                {props.events.map((event : APIEvent, index : number) => (
                    <EventCheckbox
                        key={`event_${index}`}
                        block={false}
                        event={event}
                        error={form.errors.events}
                        checked={checkbox.get(index)}
                        index={index}
                        update={() => selectEvent(index)}
                        submitting={submitting}
                    />
                ))}
            </Fragment>
        );
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
        if(props.events.length === 0) {
            return (
                <Message msg={{type: 'error', msg: __('No events found', 'wp-reminder')}}/>
            );
        } else {
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
                            disabled={(typeof props.subscriber !== "undefined") || submitting}
                            onChange={form.onChange}
                        />
                        <small className={form.errors.email === null ? 'hidden' : 'error-text'}>{form.errors.email}</small>
                    </div>
                    {(typeof props.subscriber === "undefined") ? (
                        <div className='row'>
                            <label>{__('Privacy settings', 'wp-reminder')}</label>
                            <div className='checkbox-container'>
                                <div className='checkbox'>
                                    <input
                                        className={form.errors.accept === null ? '' : 'error'}
                                        type='checkbox'
                                        readOnly
                                        tabIndex={0}
                                        disabled={submitting}
                                        checked={form.values.accept}
                                        onChange={() => form.setValue('accept', !form.values.accept)}
                                    />
                                </div>
                                <div className='checkbox-label'>
                                    <label>{props.settings.privacy_text}*</label>
                                </div>
                            </div>
                            <small className={form.errors.accept === null ? 'hidden' : 'error-text'}>{form.errors.accept}</small>
                        </div>
                    ) : ""}
                    <div className='row'>
                        <span className='small'>* {__('All these fields are required', 'wp-reminder')}</span>
                    </div>
                    <div className='row btn-row'>
                        {(typeof props.subscriber !== "undefined") ? (
                            <a onClick={() => setStep(1)}>{__('Unsubscribe')}</a>
                        ) : ""}
                        <ButtonMessage msg={message} />
                        <button type='button' disabled={submitting} onClick={onSubmit}>
                            {submitting ? __('Submitting...', 'wp-reminder') : __('Submit', 'wp-reminder')}
                        </button>
                    </div>
                </form>
            );
        }
    }

    switch (step) {
        case 0: return renderForm();
        case 1: return renderConfirm();
        case 2: return renderSuccess();
        default: return <Fragment>{__('Internal Error', 'wp-reminder')}</Fragment>;
    }

}