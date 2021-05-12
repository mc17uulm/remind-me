import React, {Fragment, useEffect} from "react";
import "../styles/main.scss";
import {APIEvent, EventHandler, get_clocking_str} from "../api/handler/EventHandler";
import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {__, _n, sprintf} from "@wordpress/i18n";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Loader} from "../components/Loader";
import {Error} from "../components/Error";
import {Card, Grid, Label, Table} from "semantic-ui-react";
import moment from "moment";

export const Dashboard = () => {

    const [subscribers, loadSubscribers] = useInitializer<APISubscriber[]>();
    const [events, loadEvents] = useInitializer<APIEvent[]>();

    const load = async () : Promise<void> => {
        await loadSubscribers(async () => {
            return SubscriberHandler.get_all();
        });
        await loadEvents(async () => {
            return EventHandler.get_all();
        });
    }

    useEffect(() => {
        load();
    }, []);

    const renderSubscribers = () => {
        switch(subscribers.state) {
            case InitializeStates.Loading: return <Loader />;
            case InitializeStates.Error: return (
                <Error>
                    {__('Could not load subscribers', 'wp-reminder')}
                </Error>
            );
            case InitializeStates.Success: return (
                <Fragment>
                    <Card.Content header={__('Subscribers', 'wp-reminder')} />
                    <Card.Content>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{__('Email address', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Events', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Active', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Registered', 'wp-reminder')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {subscribers.value.map((subscriber : APISubscriber, index : number) => (
                                    <Table.Row key={`subscriber_${index}`}>
                                        <Table.Cell>{subscriber.email}</Table.Cell>
                                        <Table.Cell>{sprintf(_n('%d Event', '%d Events', subscriber.events.length, 'wp-reminder'), subscriber.events.length)}</Table.Cell>
                                        <Table.Cell>{subscriber.active ? (<Label color="green">Active</Label>) : (<Label color="red">Inactive</Label>)}</Table.Cell>
                                        <Table.Cell>{moment(subscriber.registered).format('LLLL')}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Card.Content>
                    <Card.Content extra>
                        <a href='admin.php?page=wp-reminder-subscribers' className='wp-reminder-link floated right'>{__('Go to subscribers', 'wp-reminder')}</a>
                    </Card.Content>
                </Fragment>
            )
        }
    }

    const renderEvents = () => {
        switch(events.state) {
            case InitializeStates.Loading: return <Loader />;
            case InitializeStates.Error: return (
                <Error>
                    {__('Could not load events', 'wp-reminder')}
                </Error>
            );
            case InitializeStates.Success: return (
                <Fragment>
                    <Card.Content header={__('Events', 'wp-reminder')} />
                    <Card.Content>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{__('Name', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Clocking', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Last execution', 'wp-reminder')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            {events.value.map((event : APIEvent, index : number) => (
                                <Table.Row key={`event_${index}`}>
                                    <Table.Cell>{event.name}</Table.Cell>
                                    <Table.Cell>{get_clocking_str(event.clocking)}</Table.Cell>
                                    <Table.Cell>{event.last_execution === 0 ? __('not executed yet', 'wp-reminder') : moment(event.last_execution).format('LLLL')}</Table.Cell>
                                </Table.Row>
                            ))}
                            </Table.Body>
                        </Table>
                    </Card.Content>
                    <Card.Content extra>
                        <a href='admin.php?page=wp-reminder-events' className='wp-reminder-link'>{__('Go to events', 'wp-reminder')}</a>
                    </Card.Content>
                </Fragment>
            )
        }
    }

    return (
        <Fragment>
            <h3>{__('Dashboard', 'wp-reminder')}</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Card fluid>
                            {renderSubscribers()}
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Card fluid>
                            {renderEvents()}
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Fragment>
    )

}