import {APISubscriber, empty_subscriber, Subscriber, SubscriberHandler} from "../../api/handler/SubscriberHandler";
import {useLoader} from "../../hooks/useLoader";
import {useForm} from "../../hooks/useForm";
import {APIEvent, EventHandler} from "../../api/handler/EventHandler";
import React, {Fragment, useEffect, useState} from "react";
import {Button, DropdownItemProps, Form, List, Message, Modal} from "semantic-ui-react";
import {DeleteModal} from "./DeleteModal";
import {__, _n, sprintf} from "@wordpress/i18n";
import {ModalProps, ModalState} from "../../hooks/useModal";
import {toast} from "react-toastify";
import {Either} from "../../api/Either";
import * as yup from 'yup';

const eventsToItemProps = (events : APIEvent[]) : DropdownItemProps[] => {
    return events.map((event : APIEvent) => {
        return {
            key: event.id,
            value: event.id,
            text: event.name
        };
    });
}

const SubscriberSchema : yup.SchemaOf<any> = yup.object({
    email: yup.string().email().required(__('Please insert a valid email address', 'remind-me')),
    events: yup.array()
        .min(1, __('Please select at least one event', 'remind-me'))
        .required(__('Please select at least one event', 'remind-me')),
})

export const HandleSubscriberModal = (props : ModalProps<APISubscriber>) => {

    const [loading, doLoading] = useLoader();
    const [form, setForm] = useForm<Subscriber>(empty_subscriber);
    const [events, setEvents] = useState<DropdownItemProps[]>([]);

    const loadEvents = async () => {
        const resp = await EventHandler.get_all();
        if(resp.has_error()) {
            props.onClose();
            console.error(resp.get_error());
            toast.error(__('Could not load events', 'remind-me'));
            return;
        }
        setEvents(eventsToItemProps(resp.get_value()));
    }

    useEffect(() => {
        if(props.type === ModalState.EDIT) {
            setForm({
                email: props.element.email,
                events: props.element.events
            });
        } else {
            setForm({
                email: "",
                events: []
            });
        }
    }, [props.type]);

    useEffect(() => {
        loadEvents();
    }, []);

    const onSubmit = async () =>  {
        await doLoading(async () => {
            let validate, resp;
            switch(props.type) {
                case ModalState.EDIT:
                    validate = await form.validate(SubscriberSchema);
                    if(validate.has_error()) return;
                    resp = await SubscriberHandler.update_by_id(props.element.id, {
                        email: form.values.email,
                        events: form.values.events
                    });
                    break;
                case ModalState.DELETE:
                    resp = await SubscriberHandler.delete(props.elements.map(val => val.id));
                    break;
                case ModalState.ADD:
                    validate = await form.validate(SubscriberSchema);
                    if(validate.has_error()) return;
                    resp = await SubscriberHandler.set({
                        email: form.values.email,
                        events: form.values.events
                    });
                    break;
                default: resp = Either.error(""); break;
            }
            if(resp.has_error()){
                toast.error(resp.get_error());
            } else {
                toast.success(props.type === ModalState.DELETE ? __('Deleted Subscriber', 'remind-me') : __('Saved Subscriber', 'remind-me'));
                props.onSuccess();
            }
        })
    }

    const renderContent = () => {
        return (
            <Fragment>
                <Modal.Header>
                    {props.type === ModalState.ADD ?
                        __('Add Subscriber', 'remind-me') :
                        __('Edit Subscriber', 'remind-me')
                    }
                </Modal.Header>
                <Modal.Content>
                    <Message warning>
                        <Message.Header>{__('Important', 'remind-me')}</Message.Header>
                        {__('Manually inserted email addresses require the consent of the email address owner! Add new subscribers only if you have their consent!', 'remind-me')}
                    </Message>
                    <Form>
                        <Form.Group>
                            <Form.Input
                                width={10}
                                value={form.values.email}
                                name='email'
                                label={__('Subscriber email address', 'remind-me')}
                                placeholder={__('Subscriber email address', 'remind-me')}
                                onChange={form.onChange}
                                error={form.errors.email}
                            />
                            <Form.Select
                                width={5}
                                multiple
                                search
                                label={__('Events', 'remind-me')}
                                onChange={(e, d) => form.setValue('events', d.value)}
                                value={form.values.events}
                                error={form.errors.events}
                                options={events}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Message info style={{textAlign: 'left'}}>
                        {__('The owner of the email address has to verify his subscription. If you save, a welcome email is sent to the new subscriber', 'remind-me')}
                    </Message>
                    <Button color='black' onClick={props.onClose}>{__('Back', 'remind-me')}</Button>
                    <Button color='green' disabled={loading} loading={loading} onClick={() => onSubmit()}>
                        {__('Save', 'remind-me')}
                    </Button>
                </Modal.Actions>
            </Fragment>
        );
    }

    const renderConfirmation = () => {
        if(props.type === ModalState.DELETE) {
            return (
                <DeleteModal
                    title={__('Delete Subscriber', 'remind-me')}
                    loading={loading}
                    onClose={props.onClose}
                    onDelete={onSubmit}
                >
                    {props.elements.length === 1 ?
                        __('Do you really like to delete the following subscriber?', 'remind-me') :
                        __('Do you really like to delete the following subscribers?', 'remind-me')
                    }
                    <br />
                    <List bulleted>
                        {props.elements.map((subscriber : APISubscriber, index : number) => (
                            <List.Item key={`subscriber_${index}`}>{subscriber.email}</List.Item>
                        ))}
                    </List>
                </DeleteModal>
            );
        } else {
            return "";
        }
    }

    const getContent = () => {
        switch(props.type) {
            case ModalState.ADD:
            case ModalState.EDIT:
                return renderContent();
            case ModalState.DELETE:
                return renderConfirmation();
       }
    }

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            {getContent()}
        </Modal>
    )

}