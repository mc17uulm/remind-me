import React, {Fragment, useContext, useEffect} from "react";
import {Button, Checkbox, Form, Icon, Label, Table} from "semantic-ui-react";
import {APIEvent, Event, EventHandler, get_repetition} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {toast} from "react-toastify";
import {HandleEventModal} from "../components/modals/HandleEventModal";
import "../styles/events.scss";
import CopyToClipboard from "react-copy-to-clipboard";
import {useCheckbox} from "../hooks/useCheckbox";
import {useModal} from "../hooks/useModal";
import {LoadingContent} from "../components/LoadingContent";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {DescriptionView} from "../components/DescriptionView";
import {View} from "../View";

const Events = () => {

    const [modal] = useModal<APIEvent>();
    const checkbox = useCheckbox<APIEvent>();
    const [events, loadEvents] = useInitializer<APIEvent[]>();

    const load = async () : Promise<void> => {
        const _events = await loadEvents(EventHandler.get_all);
        if(!_events.has_error()) {
            checkbox.set(_events.get_value());
        }
    }

    useEffect(() => {
        load();
    }, []);

    const onSuccess = async () => {
        modal.hide();
        checkbox.update_all(false);
        await load();
    }

    const renderRepetition = (event : APIEvent) => {
        return (
            <Fragment>
                <Label color={event.active ? 'green' : 'red'} horizontal>
                    {event.active ? __('active', 'remind-me') : __('not-active', 'remind-me')}
                </Label>
                {get_repetition(event.start, event.clocking)}<br />
            </Fragment>
        );
    }

    const generateShortcode = () : string => {
        const _events = events.state === InitializeStates.Success ? events.value : [];
        return "[remind-me name='" + __('Subscription Box title', 'remind-me') + "' events='" +
            checkbox.filtered().map((_, index : number) => _events[index].id).join(',') +
            "']";
    }

    const renderShortcode = () => {
        const shortcode = generateShortcode();
        return (
            <Form.Input
                disabled
                style={{width: "100%"}}
                value={shortcode}
                action={
                    <CopyToClipboard
                        text={shortcode}
                        onCopy={() => toast.success(__('Shortcode copied to clipboard', 'remind-me'))}
                    >
                        <Button>
                            <Icon name='copy' />
                        </Button>
                    </CopyToClipboard>
                }
            />
        )
    }

    const isDisabled = () : boolean => {
        if(events.state === InitializeStates.Success) {
            return events.value.length >= 5;
        }
        return false;
    }

    const renderTable = () => {
        return (
            <LoadingContent
                state={events}
                header={__('No events found', 'remind-me')}
                icon='calendar times'
                button={
                    <Button
                        color='green'
                        onClick={modal.add}
                    >{__('Add Event', 'remind-me')}</Button>
                }
            >
                {(val : APIEvent[]) => (
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
                                    <Table.HeaderCell>{__('Event', 'remind-me')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Description', 'remind-me')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Status', 'remind-me')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Next Execution', 'remind-me')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {val.map((event: APIEvent, index : number) => (
                                    <Table.Row key={`event_${index}`}>
                                        <Table.Cell><Checkbox checked={checkbox.get(index)} onChange={() => checkbox.update(index)} /></Table.Cell>
                                        <Table.Cell>
                                            <strong>{event.name}</strong><br />
                                            <a
                                                className="remind-me-edit-link remind-me-small"
                                                onClick={(e) => modal.edit(e, event)}
                                            >
                                                <Icon name="cogs" /> {__('Edit', 'remind-me')}
                                            </a> <a
                                            className="remind-me-delete-link remind-me-small"
                                            onClick={(e) =>  modal.delete(e, [event])} color="red"
                                        >
                                            <Icon name="trash" /> {__('Delete', 'remind-me')}
                                        </a>
                                        </Table.Cell>
                                        <Table.Cell className='remind-me-description'>
                                            <DescriptionView description={event.description} count={100} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {renderRepetition(event)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <code>{event.next.format('LL')}</code>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <a
                            className={"remind-me-delete-link" + (checkbox.filtered().length === 0 ? " remind-me-disabled" : "")}
                            onClick={(e) => modal.delete(e, val.filter((event, index) => checkbox.get(index)))}>
                            {__('Delete selected', 'remind-me')}
                        </a>
                    </Fragment>
                )}
            </LoadingContent>
        );
    }

    return (
        <Fragment>
            <div className="remind-me-header-container">
                <h3 className="remind-me-float-left">
                    {__('Events', 'remind-me')}
                </h3>
                <span className='remind-me-shortcode-container'>
                    <label>{__('Shortcode', 'remind-me')}</label>
                    {renderShortcode()}
                </span>
            </div>
            <a
                className={"remind-me-add-link" + (isDisabled() ? ' remind-me-disabled' : '')}
                onClick={modal.add}
            >{__('Add Event', 'remind-me')}</a>
            {renderTable()}
            <HandleEventModal
                open={modal.isOpen()}
                onClose={modal.hide}
                onSuccess={onSuccess}
                elements={modal.selected}
                element={modal.selected[0]}
                type={modal.state}
            />
        </Fragment>
    );

}

View(<Events />);