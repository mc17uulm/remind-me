import {useForm} from "../hooks/useForm";
import {useCheckbox} from "../hooks/useCheckbox";
import {APIEvent} from "../api/handler/EventHandler";
import {useLoader} from "../hooks/useLoader";
import {Fragment, MouseEvent, useEffect} from "react";
import React from "react";
import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {__} from "@wordpress/i18n";
import {clockingToStr} from "./RegisterForm";
import * as yup from 'yup';

interface FormObject {
    events: number[]
}

interface EditSettingsFormProps {
    subscriber : APISubscriber
    events: APIEvent[]
}

const EditFormSchema : yup.SchemaOf<any> = yup.object({
    events: yup.array()
        .min(1,  __('Please select at least one event', 'wp-reminder'))
        .required(__('Please select at least one event', 'wp-reminder'))
});

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

    const onSubmit = async (e : MouseEvent) => {
        e.preventDefault();
        await doSubmitting(async () => {
            const validate = await form.validate(EditFormSchema);
            if(validate.has_error()) return;
            const resp = await SubscriberHandler.update_by_token(
                props.subscriber.token,
                checkbox.filtered().map((_, index) => props.events[index].id)
            );
            if(resp.has_error()) {
                console.error(resp.get_error());
            }
        });
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

    return (
        <form>
            <div className='form-group'>
                <label>{__('Events', 'wp-reminder')} *</label>
                {renderEvents()}
                <small className={form.errors.events === null ? 'hidden' : 'form-text text-muted error-text'}>{form.errors.events}</small>
            </div>
            <span>* {__('All these fields are required', 'wp-reminder')}</span>
            <button style={{float: 'right'}} className='btn btn-success' type='button' disabled={submitting} onClick={onSubmit}>
                {submitting ? (
                    <Fragment>
                        <span className='spinner-border spinner-border-sm' role='status'></span>
                        {__('Submitting...', 'wp-reminder')}
                    </Fragment>
                ) : __('Submit', 'wp-reminder')}
            </button>
        </form>
    )

}