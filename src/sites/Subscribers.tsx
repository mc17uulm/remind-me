import React, {Fragment, useEffect, useState} from "react";
import {Accordion, Button, Checkbox, Label, List, Table} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {APISubscriber, Subscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {APIEvent, Event, EventHandler} from "../api/handler/EventHandler";
import {toast} from "react-toastify";
import {Icon} from "../components/Icon";
import moment from "moment";
import {useCheckbox} from "../hooks/useCheckbox";
import {LoadingContent} from "../components/LoadingContent";
import {useModal} from "../hooks/useModal";
import {HandleSubscriberModal} from "../components/modals/HandleSubscriberModal";

export const Subscribers = () => {

    const [modal] = useModal<APISubscriber>();
    const [checked, handleCheck] = useCheckbox();
    const [subscribers, setSubscribers] = useState<APISubscriber[]>([]);
    const [events, setEvents] = useState<APIEvent[]>([]);
    const [openAccordion, setAccordionOpen] = useState<number>(-1);
    const [initialized, setInitialized] = useState<boolean>(false);

    const loadSubscribers = async () => {
        const resp = await SubscriberHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setSubscribers(resp.get_value());
            handleCheck.set(resp.get_value());
            await loadEvents();
        }
    }

    const loadEvents = async () => {
        const resp = await EventHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setEvents(resp.get_value());
            setInitialized(true);
        }
    }

    useEffect(() => {
        loadSubscribers();
    }, []);

    const getEventsByIds = (ids : number[]) : Event[] => {
        return events.filter((event : Event) => {
            return ids.includes(event.id ?? -1);
        });
    }

    const renderActive = (active : boolean) => {
        return active ? (<Label color="green">Active</Label>) : (<Label color="red">Inactive</Label>)
    }

    const renderDate = (timestamp : number) => {
        return (
            <Fragment>
                <Icon class="clock-o" /> {moment(timestamp).format('LLLL')}
            </Fragment>
        )
    }

    const renderTable = () => {
        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            <Checkbox
                                indeterminate={handleCheck.indeterminate()}
                                checked={handleCheck.all()}
                                onChange={(e, d) => handleCheck.update_all(d.checked ?? false)}
                            />
                        </Table.HeaderCell>
                        <Table.HeaderCell>{__('Email address', 'wp-reminder')}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Registered events', 'wp-reminder')}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Registration date', 'wp-reminder')}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Active', 'wp-reminder')}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {subscribers.map((subscriber : APISubscriber, index : number) => (
                        <Table.Row key={`subscriber_${index}`}>
                            <Table.Cell><Checkbox checked={handleCheck.get(index)} onChange={() => handleCheck.update(index)} /></Table.Cell>
                            <Table.Cell>
                                <a href={`mailto:${subscriber.email}`}>{subscriber.email}</a><br />
                                <a
                                    className="wp-reminder-edit-link"
                                    onClick={(e) => modal.edit(e, subscriber)}
                                >
                                    <Icon class='cogs' /> Edit
                                </a> <a
                                    className="wp-reminder-delete-link"
                                    onClick={(e) => modal.delete(e, [subscriber])}
                                >
                                    <Icon class='trash' /> Delete
                                </a>
                            </Table.Cell>
                            <Table.Cell>
                                <List>
                                    {getEventsByIds(subscriber.events).map((event : Event, _index : number) => (
                                        <List.Item key={`${index}_event_${_index}`}>
                                            <Icon class="clock-o" /> {event.name}
                                        </List.Item>
                                    ))}
                                </List>
                            </Table.Cell>
                            <Table.Cell>{renderDate(subscriber.registered ?? 0)}</Table.Cell>
                            <Table.Cell>{renderActive(subscriber.active ?? false)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }

    return (
        <Fragment>
            <a className='wp-reminder-add-link' onClick={modal.add}>{__('Add Subscriber', 'wp-reminder')}</a>
            <LoadingContent
                initialized={initialized}
                hasContent={subscribers.length !== 0}
                header={__('No subscribers found', 'wp-reminder')}
                icon='users'
                button={
                    <Button color='green' onClick={modal.add}>{__('Add Subscriber', 'wp-reminder')}</Button>
                }
            >
                {renderTable()}
            </LoadingContent>
            <a
                className={'wp-reminder-float-left wp-reminder-delete-link' + (handleCheck.filtered().length === 0 ? ' wp-reminder-disabled' : '')}
                onClick={(e) => modal.delete(e, subscribers.filter((subscriber , index) => handleCheck.get(index)))}
            >
                {__('Delete selected', 'wp-reminder')}
            </a>
            <a
                className={'wp-reminder-float-right' + (handleCheck.filtered().length === 0 ? ' wp-reminder-disabled' : '')}
            >
                {__('Export selected', 'wp-reminder')}
            </a>
            <HandleSubscriberModal
                type={modal.state}
                open={modal.isOpen()}
                onClose={modal.hide}
                onSuccess={async () => {modal.hide();await loadSubscribers();}}
                elements={modal.selected}
                element={modal.selected[0]}
            />
        </Fragment>
    );

}