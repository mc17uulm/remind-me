import React, {Fragment, useEffect} from "react";
import "../styles/main.scss";
import {APIEvent, EventHandler, get_clocking_str} from "../api/handler/EventHandler";
import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {__, _n, sprintf} from "@wordpress/i18n";
import {useInitializer} from "../hooks/useInitializer";
import {Button, Card, Grid, Label, Table} from "semantic-ui-react";
import {LoadingContent} from "../components/LoadingContent";
import dayjs from "dayjs";
import localized from "dayjs/plugin/localizedFormat";

dayjs.extend(localized);

export const Dashboard = () => {

    const [subscribers, loadSubscribers] = useInitializer<APISubscriber[]>();
    const [events, loadEvents] = useInitializer<APIEvent[]>();

    const load = async () : Promise<void> => {
        await loadSubscribers(SubscriberHandler.get_all);
        await loadEvents(EventHandler.get_all);
    }

    useEffect(() => {
        load();
    }, []);

    const renderSubscribers = () => {
        return (
            <LoadingContent
                state={subscribers}
                header={__('No subscriber found', 'wp-reminder')}
                icon='users'
                button={
                    <Button
                        color='green'
                        onClick={() => window.location.href = 'admin.php?page=wp-reminder-subscribers'}
                    >
                        {__('Add Subscriber', 'wp-reminder')}
                    </Button>
                }
            >
                {(val : APISubscriber[]) => (
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
                                    {val.map((subscriber : APISubscriber, index : number) => (
                                        <Table.Row key={`subscriber_${index}`}>
                                            <Table.Cell>{subscriber.email}</Table.Cell>
                                            <Table.Cell>{sprintf(_n('%d Event', '%d Events', subscriber.events.length, 'wp-reminder'), subscriber.events.length)}</Table.Cell>
                                            <Table.Cell>{subscriber.active ? (<Label color="green">{__('Active', 'wp-reminder')}</Label>) : (<Label color="red">{__('Inactive', 'wp-reminder')}</Label>)}</Table.Cell>
                                            <Table.Cell>{dayjs(subscriber.registered).format('LLLL')}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card.Content>
                        <Card.Content extra>
                            <a href='admin.php?page=wp-reminder-subscribers' className='wp-reminder-link floated right'>{__('Go to subscribers', 'wp-reminder')}</a>
                        </Card.Content>
                    </Fragment>
                )}
            </LoadingContent>
        );
    }

    const renderEvents = () => {
        return (
            <LoadingContent
                state={events}
                header={__('No event found', 'wp-reminder')}
                icon='calendar times'
                button={
                    <Button
                        color='green'
                        onClick={() => window.location.href = 'admin.php?page=wp-reminder-events'}
                    >
                        {__('Add Event', 'wp-reminder')}
                    </Button>
                }
            >
                {(val : APIEvent[]) => (
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
                                    {val.map((event : APIEvent, index : number) => (
                                        <Table.Row key={`event_${index}`}>
                                            <Table.Cell>{event.name}</Table.Cell>
                                            <Table.Cell>{get_clocking_str(event.clocking)}</Table.Cell>
                                            <Table.Cell>{event.last === 0 ? __('not executed yet', 'wp-reminder') : dayjs(event.last).format('LLLL')}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card.Content>
                        <Card.Content extra>
                            <a href='admin.php?page=wp-reminder-events' className='wp-reminder-link'>{__('Go to events', 'wp-reminder')}</a>
                        </Card.Content>
                    </Fragment>
                )}
            </LoadingContent>
        );
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