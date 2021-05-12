import React, {Fragment, useEffect} from "react";
import "../styles/main.scss";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {APISubscriber, SubscriberHandler} from "../api/handler/SubscriberHandler";
import {__} from "@wordpress/i18n";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Loader} from "../components/Loader";
import {Error} from "../components/Error";
import {Card, Grid, List} from "semantic-ui-react";

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
                        <List>
                            {subscribers.value.map((subscriber : APISubscriber, index : number) => (
                                <List.Item key={`subscriber_${index}`}>
                                    {subscriber.email}
                                </List.Item>
                            ))}
                        </List>
                    </Card.Content>
                    <Card.Content extra>
                        <a href=''>{__('Subscribers', 'wp-reminder')}</a>
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
                <Card>

                </Card>
            )
        }
    }

    return (
        <Fragment>
            <div className='wp-reminder-header-container'>
                <h3 className='wp-reminder-float-left'>
                    {__('Dashboard', 'wp-reminder')}
                </h3>
            </div>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Card>
                            {renderSubscribers()}
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Card>
                            {renderEvents()}
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Fragment>
    )

}