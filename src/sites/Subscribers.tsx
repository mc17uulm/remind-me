import React, {Fragment, MouseEvent, useContext, useEffect, useState} from "react";
import {Button, Checkbox, Label, Table} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {toast} from "react-toastify";
import {Icon} from "../components/Icon";
import {useCheckbox} from "../hooks/useCheckbox";
import {LoadingContent} from "../components/LoadingContent";
import {useModal} from "../hooks/useModal";
import {HandleSubscriberModal} from "../components/modals/HandleSubscriberModal";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {EventsList} from "../components/EventsList";
import dayjs from "dayjs";
import {PluginContext, PluginSettings} from "../View";


export const Subscribers = () => {

    const [modal] = useModal<APISubscriber>();
    const checkbox = useCheckbox();
    const [subscribers, loadSubscribers] = useInitializer<APISubscriber[]>();
    const [events, setEvents] = useState<APIEvent[]>([]);
    const settings : PluginSettings = useContext(PluginContext);

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
            let csv = "token,email,events,active\n";
            csv += selected.map((subscriber : APISubscriber) => {
                const _events = "[" + events.filter((event : APIEvent) => subscriber.events.includes(event.id)).map((event : APIEvent) => event.name).join("|") + "]";
                return `${subscriber.token},${subscriber.email},${_events},${subscriber.active}`;
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

    const renderActive = (active : boolean) => {
        return active ? (<Label color="green">{__('Active', 'wp-reminder')}</Label>) : (<Label color="red">{__('Inactive', 'wp-reminder')}</Label>);
    }

    const renderDate = (timestamp : number) => {
        return (
            <Fragment>
                <Icon class="clock-o" /> {dayjs(timestamp).format('LLLL')}
            </Fragment>
        )
    }

    const renderTable = () => {
        return (
            <LoadingContent
                state={subscribers}
                header={__('No subscribers found', 'wp-reminder')}
                icon='users'
                button={
                    <Button color='green' onClick={modal.add}>{__('Add Subscriber', 'wp-reminder')}</Button>
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
                                    <Table.HeaderCell>{__('Email address', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Registered events', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Registration date', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Active', 'wp-reminder')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {val.map((subscriber : APISubscriber, index : number) => (
                                    <Table.Row key={`subscriber_${index}`}>
                                        <Table.Cell><Checkbox checked={checkbox.get(index)} onChange={() => checkbox.update(index)} /></Table.Cell>
                                        <Table.Cell>
                                            <strong>{subscriber.email}</strong><br />
                                            <a
                                                className={'wp-reminder-edit-link' + (settings.active ? '' : ' wp-reminder-disabled')}
                                                onClick={(e) => modal.edit(e, subscriber)}
                                            >
                                                <Icon class='cogs' /> {__('Edit', 'wp-reminder')}
                                            </a> <a
                                            className={'wp-reminder-delete-link' + (settings.active ? '' : ' wp-reminder-disabled')}
                                            onClick={(e) => modal.delete(e, [subscriber])}
                                        >
                                            <Icon class='trash' /> {__('Delete', 'wp-reminder')}
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
                            className={'wp-reminder-float-left wp-reminder-delete-link' + (checkbox.filtered().length === 0 || !settings.active ? ' wp-reminder-disabled' : '')}
                            onClick={(e) => {settings.active ? modal.delete(e, val.filter((subscriber , index) => checkbox.get(index))) : null}}
                        >
                            {__('Delete selected', 'wp-reminder')}
                        </a>
                    </Fragment>
                )}
            </LoadingContent>
        );
    }

    return (
        <Fragment>
            <h3>{__('Subscribers', 'wp-reminder')}</h3>
            <a
                className={'wp-reminder-add-link' + (settings.active ? '' : ' wp-reminder-disabled')}
                onClick={(e) => {settings.active ? modal.add(e) : null}}>
                {__('Add Subscriber', 'wp-reminder')}
            </a>
            {renderTable()}
            <a
                onClick={(e) => {settings.active ? handleExport(e) : null;}}
                className={'wp-reminder-float-right wp-reminder-link' + (checkbox.filtered().length === 0 || !settings.active ? ' wp-reminder-disabled' : '')}
            >
                {__('Export selected', 'wp-reminder')}
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