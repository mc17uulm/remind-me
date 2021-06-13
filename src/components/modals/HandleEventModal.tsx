import {
    APIEvent,
    ClockingList,
    empty_event,
    EventHandler,
    get_repetition
} from "../../api/handler/EventHandler";
import React, {Fragment, useEffect} from "react";
import {Button, DropdownItemProps, Form, List, Modal, ModalActions} from "semantic-ui-react";
import {__, _n, sprintf} from "@wordpress/i18n";
import {DeleteModal} from "./DeleteModal";
import {toast} from "react-toastify";
import {Either} from "../../api/Either";
import {useLoader} from "../../hooks/useLoader";
import {useForm} from "../../hooks/useForm";
import * as yup from 'yup';
import {ModalProps, ModalState} from "../../hooks/useModal";
import {Date as DateForm} from "../../api/Date";
import dayjs from "dayjs";

const MonthList : DropdownItemProps[] = [
    {key: '1', value: 1, text: __('January', 'wp-reminder')},
    {key: '2', value: 2, text: __('February', 'wp-reminder')},
    {key: '3', value: 3, text: __('March', 'wp-reminder')},
    {key: '4', value: 4, text: __('April', 'wp-reminder')},
    {key: '5', value: 5, text: __('May', 'wp-reminder')},
    {key: '6', value: 6, text: __('June', 'wp-reminder')},
    {key: '7', value: 7, text: __('July', 'wp-reminder')},
    {key: '8', value: 8, text: __('August', 'wp-reminder')},
    {key: '9', value: 9, text: __('September', 'wp-reminder')},
    {key: '10', value: 10, text: __('October', 'wp-reminder')},
    {key: '11', value: 11, text: __('November', 'wp-reminder')},
    {key: '12', value: 12, text: __('December', 'wp-reminder')},
];

const Today : DateForm = DateForm.create_by_string(dayjs().format('YYYY-MM-DD'));

const EventSchema : yup.SchemaOf<any> = yup.object({
    name: yup.string().required(__('Please insert a event name'))
});

export const HandleEventModal = (props : ModalProps<APIEvent>) => {

    const [loading, doLoading] = useLoader();
    const [form, setForm] = useForm<APIEvent>(empty_event());

    useEffect(() => {
        if(props.type === ModalState.EDIT) {
            setForm(props.element);
        } else {
            setForm(empty_event());
        }
    }, [props.type]);

    const onSubmit = async () => {
        await doLoading(async () => {
            let validate, resp;
            switch(props.type) {
                case ModalState.EDIT:
                    validate = await form.validate(EventSchema);
                    if(validate.has_error()) return;
                    resp = await EventHandler.update(props.element.id, {
                        name: form.values.name,
                        clocking: form.values.clocking,
                        start: form.values.start.to_string()
                    });
                    break;
                case ModalState.DELETE:
                    resp = await EventHandler.delete(props.elements.map(val => val.id));
                    break;
                case ModalState.ADD:
                    validate = await form.validate(EventSchema);
                    if(validate.has_error()) return;
                    resp = await EventHandler.set({
                        name: form.values.name,
                        clocking: form.values.clocking,
                        start: form.values.start.to_string()
                    });
                    break;
                default:
                    resp = Either.error("");
                    break;
            }
            if(resp.has_error()) {
                toast.error(resp.get_error());
            } else {
                toast.success(props.type === ModalState.DELETE ? __('Deleted Event', 'wp-reminder') : __('Saved Event', 'wp-reminder'));
                props.onSuccess();
            }
        })
    }

    const get_min = () : number => {
        if((Today.year === form.values.start.year) && (Today.month === form.values.start.month)) {
            return Today.day;
        }
        return 1;
    }

    const get_max = () : number => {
        return new Date(form.values.start.year, form.values.start.month, 0).getDate();
    }

    const get_month_list = () : DropdownItemProps[] => {
        let months = MonthList;
        if(Today.year === form.values.start.year) {
            months = months.map((item : DropdownItemProps) => {
                // @ts-ignore
                if(item.value < Today.month) {
                    return {key: item.key, value: item.value, text: item.text, disabled: true};
                }
                return item;
            });
        }
        return months;
    }

    const get_years_list = () : DropdownItemProps[] => {
        const year = Today.year;
        return Array.from(Array(5).keys()).map((val: number) => {
            return {key: val + 1, value: year + val, text: year  + val};
        });
    }

    const updateYear = (value : any) : void => {
        const start = form.values.start;
        start.year = parseInt(value);
        form.setValue('start', start);
    }

    const updateMonth = (value : any) : void => {
        const start = form.values.start;
        start.month = parseInt(value);
        form.setValue('start', start);
    }

    const updateDay = (value : string) : void => {
        const day = parseInt(value);
        if(isNaN(day)) return;
        const start = form.values.start;
        start.day = day;
        form.setValue('start', start);
    }

    const checkDay = () : void => {
        const start = form.values.start;
        const day = start.day;
        const max = get_max();
        if(day > max) {
            start.day = max;
        }
        const min = get_min();
        if(day < min) {
            start.day = min;
        }
        form.setValue('start', start);
    }

    const renderContent = () => {
        return (
            <Fragment>
                <Modal.Header>
                    {props.type === ModalState.ADD ?
                        __('Add Event', 'wp-reminder') :
                        __('Edit Event', 'wp-reminder')
                    }
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Input
                                width={16}
                                value={form.values.name}
                                name="name"
                                label={__('Event name', 'wp-reminder')}
                                placeholder={__('Event name', 'wp-reminder')}
                                onChange={form.onChange}
                                error={form.errors.name}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Input
                                width={2}
                                label={__('Day', 'wp-reminder')}
                                value={form.values.start.day}
                                onChange={(e, d) => updateDay(d.value)}
                                type="number"
                                onBlur={checkDay}
                                placeholder={1}
                            />
                            <Form.Select
                                width={4}
                                label={__('Month', 'wp-reminder')}
                                value={form.values.start.month}
                                onChange={(e, d) => updateMonth(d.value)}
                                options={get_month_list()}
                            />
                            <Form.Select
                                width={4}
                                label={__('Year', 'wp-reminder')}
                                value={form.values.start.year}
                                onChange={(e, d) => updateYear(d.value)}
                                options={get_years_list()}
                            />
                            <Form.Select
                                width={6}
                                label={__('Repeat', 'wp-reminder')}
                                value={form.values.clocking}
                                onChange={(event, data) => form.setValue('clocking', data.value)}
                                options={ClockingList}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Field>
                                <label>{__('Next Executions', 'wp-reminder')}</label>
                                <List>
                                    {form.values.start.get_next_array(form.values.clocking, 5).map((date : DateForm, index : number) => (
                                        <List.Item key={`executions_${index}`}>
                                            {date.format('L')}
                                        </List.Item>
                                    ))}
                                </List>
                            </Form.Field>
                            <Form.Field>
                                <label>{__('Summary', 'wp-reminder')}</label>
                                <code>
                                    {get_repetition(form.values.start, form.values.clocking)}
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
        if(props.type === ModalState.DELETE) {
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