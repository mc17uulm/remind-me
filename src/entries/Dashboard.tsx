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
import {View} from "../View";

dayjs.extend(localized);

const Dashboard = () => {

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
                header={__('No subscriber found', 'remind-me')}
                icon='users'
                button={
                    <Button
                        color='green'
                        onClick={() => window.location.href = 'admin.php?page=remind-me-subscribers'}
                    >
                        {__('Add Subscriber', 'remind-me')}
                    </Button>
                }
            >
                {(val : APISubscriber[]) => (
                    <Fragment>
                        <Card.Content header={__('Subscribers', 'remind-me')} />
                        <Card.Content>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{__('Email address', 'remind-me')}</Table.HeaderCell>
                                        <Table.HeaderCell>{__('Events', 'remind-me')}</Table.HeaderCell>
                                        <Table.HeaderCell>{__('Active', 'remind-me')}</Table.HeaderCell>
                                        <Table.HeaderCell>{__('Registered', 'remind-me')}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {val.map((subscriber : APISubscriber, index : number) => (
                                        <Table.Row key={`subscriber_${index}`}>
                                            <Table.Cell>{subscriber.email}</Table.Cell>
                                            <Table.Cell>{sprintf(subscriber.events.length === 1 ? __('%d Event', 'remind-me') : __('%d Events', 'remind-me'), subscriber.events.length)}</Table.Cell>
                                            <Table.Cell>{subscriber.active ? (<Label color="green">{__('Active', 'remind-me')}</Label>) : (<Label color="red">{__('Inactive', 'remind-me')}</Label>)}</Table.Cell>
                                            <Table.Cell>{dayjs(subscriber.registered).format('LLLL')}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card.Content>
                        <Card.Content extra>
                            <a href='admin.php?page=remind-me-subscribers' className='remind-me-link floated right'>{__('Go to subscribers', 'remind-me')}</a>
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
                header={__('No event found', 'remind-me')}
                icon='calendar times'
                button={
                    <Button
                        color='green'
                        onClick={() => window.location.href = 'admin.php?page=remind-me-events'}
                    >
                        {__('Add Event', 'remind-me')}
                    </Button>
                }
            >
                {(val : APIEvent[]) => (
                    <Fragment>
                        <Card.Content header={__('Events', 'remind-me')} />
                        <Card.Content>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{__('Name', 'remind-me')}</Table.HeaderCell>
                                        <Table.HeaderCell>{__('Clocking', 'remind-me')}</Table.HeaderCell>
                                        <Table.HeaderCell>{__('Last execution', 'remind-me')}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {val.map((event : APIEvent, index : number) => (
                                        <Table.Row key={`event_${index}`}>
                                            <Table.Cell>{event.name}</Table.Cell>
                                            <Table.Cell>{get_clocking_str(event.clocking)}</Table.Cell>
                                            <Table.Cell>{event.last === 0 ? __('not executed yet', 'remind-me') : dayjs(event.last).format('LLLL')}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card.Content>
                        <Card.Content extra>
                            <a href='admin.php?page=remind-me-events' className='remind-me-link'>{__('Go to events', 'remind-me')}</a>
                        </Card.Content>
                    </Fragment>
                )}
            </LoadingContent>
        );
    }

    return (
        <Fragment>
            <h3>{__('Dashboard', 'remind-me')}</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Card fluid>
                            {renderEvents()}
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Card fluid>
                            {renderSubscribers()}
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Fragment>
    );

}

View(<Dashboard />);