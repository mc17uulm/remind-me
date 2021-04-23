import {APIEvent, EventHandler, get_next_executions, get_repetition} from "../../api/handler/EventHandler";
import {HandableModalProps, HandableModalType } from "./HandableModal";
import React, {Fragment, useEffect, useState,} from "react";
import {Button, DropdownItemProps, Form, List, Modal, ModalActions} from "semantic-ui-react";
import {__, _n, sprintf} from "@wordpress/i18n";
import {DeleteModal} from "./DeleteModal";
import moment from "moment";
import {toast} from "react-toastify";
import {Either} from "../../api/Either";
import {useLoader} from "../../hooks/useLoader";

const ClockingList : DropdownItemProps[] = [
    {key: '1', value: 1, text: __('monthly', 'wp-reminder')},
    {key: '2', value: 2, text: __('2-monthly', 'wp-reminder')},
    {key: '3', value: 3, text: __('quarterly', 'wp-reminder')},
    {key: '4', value: 4, text: __('4-monthly', 'wp-reminder')},
    {key: '6', value: 6, text: __('half-yearly', 'wp-reminder')},
    {key: '12', value: 12, text: __('yearly', 'wp-reminder')},
];

const MonthList : DropdownItemProps[] = [
    {key: '1', value: 0, text: __('January', 'wp-reminder')},
    {key: '2', value: 1, text: __('February', 'wp-reminder')},
    {key: '3', value: 2, text: __('March', 'wp-reminder')},
    {key: '4', value: 3, text: __('April', 'wp-reminder')},
    {key: '5', value: 4, text: __('May', 'wp-reminder')},
    {key: '6', value: 5, text: __('June', 'wp-reminder')},
    {key: '7', value: 6, text: __('July', 'wp-reminder')},
    {key: '8', value: 7, text: __('August', 'wp-reminder')},
    {key: '9', value: 8, text: __('September', 'wp-reminder')},
    {key: '10', value: 9, text: __('October', 'wp-reminder')},
    {key: '11', value: 10, text: __('November', 'wp-reminder')},
    {key: '12', value: 11, text: __('December', 'wp-reminder')},
]

export const HandleEventModal = (props : HandableModalProps<APIEvent>) => {

    const [loading, doLoading] = useLoader();
    const [name, setName] = useState<string>("");
    const [start, setStart] = useState<number>(0);
    const [repeat, setRepeat] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(props.type === HandableModalType.EDIT) {
            setStart(props.element.start * 1000);
            setRepeat(props.element.clocking);
            setName(props.element.name);
        } else {
            setStart(0);
            setRepeat(1);
            setName("");
        }
    }, [props.type]);

    const onSubmit = async () => {
        await doLoading(async () => {
            const resp = await sendRequest();
            if(resp.has_error()) {
                toast.error(resp.get_error());
            } else {
                toast.success(__('Saved Event', 'wp-reminder'));
                props.onSuccess();
            }
        })
    }

    const checkForm = () : boolean => {
        if(name === "") {
            console.log("this error");
            setError(__('Please insert a event name', 'wp-reminder'));
            return false;
        }
        return true;
    }

    const sendRequest = async () : Promise<Either<any>> => {
        switch(props.type) {
            case HandableModalType.EDIT:
                if(!checkForm()) return Either.error("");
                return await EventHandler.update(props.element.id, {
                    name: name,
                    clocking: repeat,
                    start: Math.floor(start / 1000)
                });
            case HandableModalType.DELETE:
                return await EventHandler.delete(props.elements.map(val => val.id));
            case HandableModalType.ADD:
                if(!checkForm()) return Either.error("");
                return await EventHandler.set({
                    name: name,
                    clocking: repeat,
                    start: Math.floor(start / 1000)
                });
            default: return Either.error("");
        }
    }

    const nextExecutions = () : Date[] => {
        const last_execution = (props.type === HandableModalType.EDIT) ? props.element.last_execution : 0;

        return get_next_executions(last_execution, start, repeat, 4);
    }

    const toDate = (timestamp : number) : Date => {
        return new Date(timestamp);
    }

    const updateMonth = (value : any) : void => {
        const _start = toDate(start);
        setStart(_start.setMonth(parseInt(value)));
    }

    const updateDay = (value : string) : void => {
        const _start = toDate(start);
        setStart(_start.setDate(parseInt(value)));
    }

    const renderContent = () => {
        return (
            <Fragment>
                <Modal.Header>
                    {props.type === HandableModalType.ADD ?
                        __('Add Event', 'wp-reminder') :
                        __('Edit Event', 'wp-reminder')
                    }
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Input
                                width={6}
                                value={name}
                                name="name"
                                label={__('Event name', 'wp-reminder')}
                                placeholder={__('Event name', 'wp-reminder')}
                                onChange={(e) => setName(e.target.value)}
                                error={error}
                            />
                            <Form.Input
                                width={2}
                                label={__('Day', 'wp-reminder')}
                                value={toDate(start).getDate()}
                                onChange={(e, d) => updateDay(d.value)}
                                type="number"
                                placeholder={1}
                                min={1}
                                max={31}
                            />
                            <Form.Select
                                width={4}
                                label={__('Month', 'wp-reminder')}
                                value={toDate(start).getMonth()}
                                onChange={(e, d) => updateMonth(d.value)}
                                options={MonthList}
                            />
                            <Form.Select
                                width={3}
                                label={__('Repeat', 'wp-reminder')}
                                value={repeat}
                                // @ts-ignore
                                onChange={(event, data) => setRepeat(data.value)}
                                options={ClockingList}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Field>
                                <label>{__('Next Executions', 'wp-reminder')}</label>
                                <List>
                                    {nextExecutions().map((date : Date, index : number) => (
                                        <List.Item key={`executions_${index}`}>
                                            {moment(date).format('L')}
                                        </List.Item>
                                    ))}
                                </List>
                            </Form.Field>
                            <Form.Field>
                                <label>{__('Summary', 'wp-reminder')}</label>
                                <code>
                                    {get_repetition(repeat, toDate(start).getDate())}
                                </code>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <ModalActions>
                    <Button color='black' onClick={props.onClose}>{__('Back', 'wp-reminder')}</Button>
                    <Button color='green' loading={loading} onClick={() => onSubmit()}>
                        {__('Save', 'wp-reminder')}
                    </Button>
                </ModalActions>
            </Fragment>
        )
    }

    const renderConfirmation = () => {
        if(props.type === HandableModalType.DELETE) {
            return (
                <DeleteModal
                    title={__('Delete Event', 'wp-reminder')}
                    content={
                        sprintf(
                            _n(
                            'Do you really like to delete the event "%s"?',
                            'Do you really like to delete the events [%s]?',
                                props.elements.length,
                                'wp-reminder'
                            ),
                            (props.elements.length === 1) ? props.elements[0].name : props.elements.map(val => val.name).join(", ")
                        )
                    }
                    loading={loading}
                    onClose={props.onClose}
                    onDelete={onSubmit}
                />
            );
        } else {
            return "";
        }
    }

    const getContent = () => {
        switch(props.type) {
            case HandableModalType.ADD:
            case HandableModalType.EDIT:
                return renderContent();
            case HandableModalType.DELETE:
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