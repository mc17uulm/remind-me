import React, {Fragment, MouseEvent, useContext, useEffect, useState} from "react";
import {Button, Checkbox, Icon, Label, Table} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {toast} from "react-toastify";
import {useCheckbox} from "../hooks/useCheckbox";
import {LoadingContent} from "../components/LoadingContent";
import {useModal} from "../hooks/useModal";
import {HandleSubscriberModal} from "../components/modals/HandleSubscriberModal";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {EventsList} from "../components/EventsList";
import dayjs from "dayjs";
import {View} from "../View";


const Subscribers = () => {

    const [modal] = useModal<APISubscriber>();
    const checkbox = useCheckbox();
    const [subscribers, loadSubscribers] = useInitializer<APISubscriber[]>();
    const [events, setEvents] = useState<APIEvent[]>([]);

    const load = async () => {
        const _subscribers = await loadSubscribers(SubscriberHandler.get_all);
        if(!_subscribers.has_error()) {
            checkbox.set(_subscribers.get_value());
            await loadEvents();
        }
    }

    const loadEvents = async () => {
        const resp = await EventHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setEvents(resp.get_value());
        }
    }

    useEffect(() => {
        load();
    }, []);

    const getEventsByIds = (ids : number[]) : APIEvent[] => {
        return events.filter((event : APIEvent) => {
            return ids.includes(event.id);
        });
    }

    const handleExport = (e : MouseEvent) => {
        e.preventDefault();
        if(subscribers.state === InitializeStates.Success) {
            const selected = subscribers.value.filter((subscriber : APISubscriber, index : number) => checkbox.get(index));
            let csv = "email,events,active,registered\n";
            csv += selected.map((subscriber : APISubscriber) => {
                const _events = "[" + events.filter((event : APIEvent) => subscriber.events.includes(event.id)).map((event : APIEvent) => event.name).join("|") + "]";
                return `${subscriber.email},${_events},${subscriber.active},${subscriber.registered}`;
            }).join("\n");
            const dwnl = document.createElement('a');
            dwnl.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
            dwnl.setAttribute('download', 'export_subscribers.csv');
            dwnl.style.display = 'none';
            document.body.appendChild(dwnl);
            dwnl.click();
            document.body.removeChild(dwnl);
        }
    }

    const active = events.length > 0;

    const renderActive = (active : boolean) => {
        return active ? (<Label color="green">{__('Active', 'remind-me')}</Label>) : (<Label color="red">{__('Inactive', 'remind-me')}</Label>);
    }

    const renderDate = (timestamp : number) => {
        return (
            <Fragment>
                <Icon name='clock' /> {dayjs(timestamp).format('LLLL')}
            </Fragment>
        )
    }

    const renderTable = () => {
        return (
            <LoadingContent
                state={subscribers}
                header={__('No subscribers found', 'remind-me')}
                icon='users'
                button={
                    <Button color='green' disabled={!active} onClick={modal.add}>{__('Add Subscriber', 'remind-me')}</Button>
                }
            >
                {(val : APISubscriber[]) => (
                    <Fragment>
                        <Table striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        <Checkbox
                                            indeterminate={checkbox.indeterminate()}
                                            checked={checkbox.all()}
                                            onChange={(e, d) => checkbox.update_all(d.checked ?? false)}
                                        />
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>{__('Email address', 'remind-me')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Registered events', 'remind-me')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Registration date', 'remind-me')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Active', 'remind-me')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {val.map((subscriber : APISubscriber, index : number) => (
                                    <Table.Row key={`subscriber_${index}`}>
                                        <Table.Cell><Checkbox checked={checkbox.get(index)} onChange={() => checkbox.update(index)} /></Table.Cell>
                                        <Table.Cell>
                                            <strong>{subscriber.email}</strong><br />
                                            <a
                                                className={'remind-me-edit-link'}
                                                onClick={(e) => modal.edit(e, subscriber)}
                                            >
                                                <Icon name='cogs' /> {__('Edit', 'remind-me')}
                                            </a> <a
                                            className={'remind-me-delete-link'}
                                            onClick={(e) => modal.delete(e, [subscriber])}
                                        >
                                            <Icon name='trash' /> {__('Delete', 'remind-me')}
                                        </a>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <EventsList events={getEventsByIds(subscriber.events)} index={index} />
                                        </Table.Cell>
                                        <Table.Cell>{renderDate(subscriber.registered ?? 0)}</Table.Cell>
                                        <Table.Cell>{renderActive(subscriber.active ?? false)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <a
                            className={'remind-me-float-left remind-me-delete-link' + (checkbox.filtered().length === 0 ? ' remind-me-disabled' : '')}
                            onClick={(e) => {modal.delete(e, val.filter((subscriber , index) => checkbox.get(index)))}}
                        >
                            {__('Delete selected', 'remind-me')}
                        </a>
                    </Fragment>
                )}
            </LoadingContent>
        );
    }

    return (
        <Fragment>
            <h3>{__('Subscribers', 'remind-me')}</h3>
            <a
                className={'remind-me-add-link' + (active ? '' : ' remind-me-disabled')}
                onClick={(e) => {active ? modal.add(e) : null}}>
                {__('Add Subscriber', 'remind-me')}
            </a>
            {renderTable()}
            <a
                onClick={(e) => {active ? handleExport(e) : null;}}
                className={'remind-me-float-right remind-me-link' + (checkbox.filtered().length === 0 ? ' remind-me-disabled' : '')}
            >
                {__('Export selected', 'remind-me')}
            </a>
            <HandleSubscriberModal
                type={modal.state}
                open={modal.isOpen()}
                onClose={modal.hide}
                onSuccess={async () => {modal.hide();await load();}}
                elements={modal.selected}
                element={modal.selected[0]}
            />
        </Fragment>
    );

}

View(<Subscribers />);