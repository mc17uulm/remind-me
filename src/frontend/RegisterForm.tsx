import React, {Fragment, MouseEvent, useEffect, useState} from "react";
import {APIEvent} from "../api/handler/EventHandler";
import {Settings} from "../api/handler/SettingsHandler";
import {useForm} from "../hooks/useForm";
import {__} from "@wordpress/i18n";
import {useCheckbox} from "../hooks/useCheckbox";
import {useLoader} from "../hooks/useLoader";
import {SubscriberHandler} from "../api/handler/SubscriberHandler";
import * as yup from "yup";
import {IMessage, Message} from "./Message";
import {Icon} from "../components/Icon";

interface RegisterFormProps {
    events: APIEvent[],
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

const RegisterFormSchema : yup.SchemaOf<any> = yup.object({
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

export const RegisterForm = (props : RegisterFormProps) => {

    const [form, setForm] = useForm<FormObject>(empty_form);
    const [checkbox] = useCheckbox<APIEvent>();
    const [submitting, doSubmitting] = useLoader();
    const [message, setMessage] = useState<IMessage | null>(null);

    useEffect(() => {
        checkbox.set(props.events);
    }, [props.events]);

    const onSubmit = async (e : MouseEvent) => {
        e.preventDefault();
        await doSubmitting(async () => {
            const validate = await form.validate(RegisterFormSchema);
            if(validate.has_error()) {console.log("has error"); return;}
            const resp = await SubscriberHandler.set({
                email: form.values.email,
                events: checkbox.filtered().map((_, index) => props.events[index].id)
            });
            if(resp.has_error()) {
                console.error(resp.get_error());
                setMessage({type: "error", msg: resp.get_error()})
            } else {
                setMessage({type: "success", msg: props.settings.signin_msg});
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
                        <div className='form-check' key={index}>
                            <input className='form-check-input' readOnly tabIndex={0} type='checkbox' onChange={() => selectEvent(index)} checked={checkbox.get(index)} />
                            <label className='form-check-label'>{event.name} - {clockingToStr(event.clocking)}</label>
                        </div>
                    ))}
                </Fragment>
            )
        }
    }

    return message?.type === "success" ? <Message msg={message} /> : (
        <form>
            <div className='form-group'>
                <label>{__('Events', 'wp-reminder')} *</label>
                {renderEvents()}
                <small className={form.errors.events === null ? 'hidden' : 'form-text text-muted error-text'}>{form.errors.events}</small>
            </div>
            <div className='form-group'>
                <label>{__('Email address', 'wp-reminder')} *</label>
                <input className='form-control' type='email' value={form.values.email} name='email' onChange={form.onChange} />
                <small className={form.errors.email === null ? 'hidden' : 'form-text text-muted error-text'}>{form.errors.email}</small>
            </div>
            <div className='form-group'>
                <label>{__('Privacy settings', 'wp-reminder')}</label>
                <div className='form-check'>
                    <input className='form-check-input' readOnly tabIndex={0} type='checkbox' checked={form.values.accept} onChange={() => form.setValue('accept', !form.values.accept)} />
                    <label className='form-check-label'>{props.settings.text_privacy}*</label>
                    <small className={form.errors.accept === null ? 'hidden' : 'form-text text-muted error-text'}>{form.errors.accept}</small>
                </div>
            </div>
            <span>* {__('All these fields are required', 'wp-reminder')}</span>
            <Message msg={message} />
            <button style={{float: 'right'}} className='btn btn-success' type='button' disabled={submitting} onClick={onSubmit}>
                {submitting ? (
                    <Fragment>
                        <span className='spinner-border spinner-border-sm' role='status'></span>
                        {__('Submitting...', 'wp-reminder')}
                    </Fragment>
                ) : __('Submit', 'wp-reminder')}
            </button>
        </form>
    );

}