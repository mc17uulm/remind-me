import {useForm} from "../hooks/useForm";
import {useCheckbox} from "../hooks/useCheckbox";
import {APIEvent} from "../api/handler/EventHandler";
import {useLoader} from "../hooks/useLoader";
import {Fragment, useEffect} from "react";
import React from "react";
import {APISubscriber} from "../api/handler/SubscriberHandler";
import {__} from "@wordpress/i18n";
import {clockingToStr} from "./RegisterForm";

interface FormObject {
    events: number[]
}

interface EditSettingsFormProps {
    subscriber : APISubscriber
    events: APIEvent[]
}

export const EditSettingsForm = (props : EditSettingsFormProps) => {

    const [form, setForm] = useForm<FormObject>({events: props.subscriber.events});
    const [checkbox] = useCheckbox<APIEvent>();
    const [submitting, doSubmitting] = useLoader();

    useEffect(() => {
        const checked = props.events.map((event : APIEvent) => props.subscriber.events.includes(event.id));
        checkbox.set(props.events, checked);
    }, []);

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
        }
        return (
            <Fragment>
                {props.events.map((event: APIEvent, index : number) => (
                    <div role='listitem' key={index} className='wp-reminder-event-item'>
                        <div className='wp-reminder-checkbox'>
                            <input readOnly tabIndex={0} type='checkbox' onChange={() => selectEvent(index)} checked={checkbox.get(index)} />
                            <label>{event.name} - {clockingToStr(event.clocking)}</label>
                        </div>
                    </div>
                ))}
            </Fragment>
        )
    }

    return (
        <div className='wp-reminder-registration-container'>
            <div role='list' className={'wp-reminder-events-list' + (form.errors.events === null ? '' : 'error')}>
                {renderEvents()}
                <span className={form.errors.events === null ? 'hidden' : 'error-text'}>{form.errors.events}</span>
            </div>
        </div>
    )

}