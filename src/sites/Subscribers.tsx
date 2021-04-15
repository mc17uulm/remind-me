import React, {Fragment, useEffect, useState} from "react";
import {Accordion, Label, List, Table} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {Subscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {Event, EventHandler} from "../api/handler/EventHandler";
import {toast} from "react-toastify";
import {Icon} from "../components/Icon";
import moment from "moment";

export const Subscribers = () => {

    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [openAccordion, setAccordionOpen] = useState<number>(-1);

    const loadSubscribers = async () => {
        const resp = await SubscriberHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setSubscribers(resp.get_value());
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
        loadSubscribers();
    }, []);

    const getEventsByIds = (ids : number[]) : Event[] => {
        return events.filter((event : Event) => {
            return ids.includes(event.id ?? -1);
        });
    }

    const buildAccordion = (index : number, subscriber : Subscriber) => {
        return (
            <Accordion>
                <Accordion.Title
                    active={openAccordion === index}
                    index={index}
                    onClick={() => setAccordionOpen(index)}
                >
                    {subscriber.events.length} {__('Events', 'wp-reminder')}
                </Accordion.Title>
                <Accordion.Content active={openAccordion === index}>
                    <List>
                        {getEventsByIds(subscriber.events).map((event : Event, _index : number) => (
                            <List.Item key={`${index}_event_${_index}`}>
                                <a href=""><Icon class="database" /> {event.name}</a>
                            </List.Item>
                        ))}
                    </List>
                </Accordion.Content>
            </Accordion>
        )
    }

    const renderActive = (active : boolean) => {
        return active ? (<Label color="green">Active</Label>) : (<Label color="red">Inactive</Label>)
    }

    const renderDate = (timestamp : number) => {
        return (
            <Fragment>
                <Icon class="clock-o" /> {moment(timestamp * 1000).format('LLLL')}
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{__('Email address', 'wp-reminder')}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Registered events', 'wp-reminder')}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Registration date', 'wp-reminder')}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Active', 'wp-reminder')}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {subscribers.map((subscriber : Subscriber, index : number) => (
                        <Table.Row key={`subscriber_${index}`}>
                            <Table.Cell><a href={`mailto:${subscriber.email}`}>{subscriber.email}</a></Table.Cell>
                            <Table.Cell>{buildAccordion(index, subscriber)}</Table.Cell>
                            <Table.Cell>{renderDate(subscriber.registered ?? 0)}</Table.Cell>
                            <Table.Cell>{renderActive(subscriber.active ?? false)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Fragment>
    );

}