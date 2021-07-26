import React, {Fragment, useContext, useEffect} from "react";
import {Button, Checkbox, Form, Label, Table} from "semantic-ui-react";
import {APIEvent, Event, EventHandler, get_repetition} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {toast} from "react-toastify";
import {HandleEventModal} from "../components/modals/HandleEventModal";
import "../styles/events.scss";
import {Icon} from "../components/Icon";
import CopyToClipboard from "react-copy-to-clipboard";
import {useCheckbox} from "../hooks/useCheckbox";
import {useModal} from "../hooks/useModal";
import {LoadingContent} from "../components/LoadingContent";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {PluginContext, PluginSettings} from "../View";

export const Events = () => {

    const [modal] = useModal<APIEvent>();
    const checkbox = useCheckbox<APIEvent>();
    const [events, loadEvents] = useInitializer<APIEvent[]>();
    const settings : PluginSettings = useContext(PluginContext);

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
                    {event.active ? __('active', 'wp-reminder') : __('not-active', 'wp-reminder')}
                </Label>
                {get_repetition(event.start, event.clocking)}<br />
            </Fragment>
        );
    }

    const generateShortcode = () : string => {
        const _events = events.state === InitializeStates.Success ? events.value : [];
        return "[wp-reminder name='" + __('Subscription Box title', 'wp-reminder') + "' events='" +
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
                        onCopy={() => toast.success(__('Shortcode copied to clipboard', 'wp-reminder'))}
                    >
                        <Button>
                            <Icon class="copy" />
                        </Button>
                    </CopyToClipboard>
                }
            />
        )
    }

    const isDisabled = () : boolean => {
        if(events.state === InitializeStates.Success) {
            return !settings.active && events.value.length > 0;
        }
        return false;
    }

    const renderTable = () => {
        return (
            <LoadingContent
                state={events}
                header={__('No events found', 'wp-reminder')}
                icon='calendar times'
                button={
                    <Button
                        color='green'
                        onClick={modal.add}
                    >{__('Add Event', 'wp-reminder')}</Button>
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
                                    <Table.HeaderCell>{__('Event', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Status', 'wp-reminder')}</Table.HeaderCell>
                                    <Table.HeaderCell>{__('Next Execution', 'wp-reminder')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {val.map((event: APIEvent, index : number) => (
                                    <Table.Row key={`event_${index}`}>
                                        <Table.Cell><Checkbox checked={checkbox.get(index)} onChange={() => checkbox.update(index)} /></Table.Cell>
                                        <Table.Cell>
                                            <strong>{event.name}</strong><br />
                                            <a
                                                className="wp-reminder-edit-link wp-reminder-small"
                                                onClick={(e) => modal.edit(e, event)}
                                            >
                                                <Icon class="cogs" /> {__('Edit', 'wp-reminder')}
                                            </a> <a
                                            className="wp-reminder-delete-link wp-reminder-small"
                                            onClick={(e) =>  modal.delete(e, [event])} color="red"
                                        >
                                            <Icon class="trash" /> {__('Delete', 'wp-reminder')}
                                        </a>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {renderRepetition(event)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <code>{event.next.format()}</code>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <a
                            className={"wp-reminder-delete-link" + (checkbox.filtered().length === 0 ? " wp-reminder-disabled" : "")}
                            onClick={(e) => modal.delete(e, val.filter((event, index) => checkbox.get(index)))}>
                            {__('Delete selected', 'wp-reminder')}
                        </a>
                    </Fragment>
                )}
            </LoadingContent>
        );
    }

    return (
        <Fragment>
            <div className="wp-reminder-header-container">
                <h3 className="wp-reminder-float-left">
                    {__('Events', 'wp-reminder')}
                </h3>
                <span className='wp-reminder-shortcode-container'>
                    <label>{__('Shortcode', 'wp-reminder')}</label>
                    {renderShortcode()}
                </span>
            </div>
            <a
                className={"wp-reminder-add-link" + (isDisabled() ? ' wp-reminder-disabled' : '')}
                onClick={modal.add}
            >{__('Add Event', 'wp-reminder')}</a>
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