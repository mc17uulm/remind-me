import React, {Fragment, useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Form,
    Label,
    Table
} from "semantic-ui-react";
import {APIEvent, Event, EventHandler, get_next_executions, get_repetition} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {toast} from "react-toastify";
import moment from "moment";
import {HandleEventModal} from "../components/modals/HandleEventModal";
import "../styles/events.scss";
import {Icon} from "../components/Icon";
import CopyToClipboard from "react-copy-to-clipboard";
import {useCheckbox} from "../hooks/useCheckbox";
import {useModal} from "../hooks/useModal";
import {LoadingContent} from "../components/LoadingContent";

export const Events = () => {

    const [modal] = useModal<APIEvent>();
    const [checkbox] = useCheckbox<APIEvent>();
    const [events, setEvents] = useState<APIEvent[]>([]);
    const [initialized, setInitialized] = useState<boolean>(false);

    const loadEvents = async () : Promise<void> => {
        const resp = await EventHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setEvents(resp.get_value());
            checkbox.set(resp.get_value());
            setInitialized(true);
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    const onSuccess = async () => {
        modal.hide();
        checkbox.update_all(false);
        await loadEvents();
    }

    const renderRepetition = (event : Event) => {
        return (
            <Fragment>
                <Label color={event.active ? 'green' : 'red'} horizontal>
                    {event.active ? __('active', 'wp-reminder') : __('not-active', 'wp-reminder')}
                </Label>
                {get_repetition(event.clocking, new Date(event.start).getDate())}<br />
            </Fragment>
        );
    }

    const generateShortcode = () : string => {
        return "[wp-reminder events='" +
            checkbox.filtered().map((_, index : number) => events[index].id).join(',') +
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

    const renderTable = () => {
        return (
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
                        <Table.HeaderCell>{__("Event", "wp-reminder")}</Table.HeaderCell>
                        <Table.HeaderCell>{__("Status", "wp-reminder")}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Next Execution', 'wp-reminder')}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {events.map((event: APIEvent, index : number) => (
                        <Table.Row key={`event_${index}`}>
                            <Table.Cell><Checkbox checked={checkbox.get(index)} onChange={() => checkbox.update(index)} /></Table.Cell>
                            <Table.Cell>
                                <strong>{event.name}</strong><br />
                                <a
                                    className="wp-reminder-edit-link wp-reminder-small"
                                    onClick={(e) => modal.edit(e, event)}
                                >
                                    <Icon class="cogs" /> Edit
                                </a> <a
                                    className="wp-reminder-delete-link wp-reminder-small"
                                    onClick={(e) =>  modal.delete(e, [event])} color="red"
                                >
                                    <Icon class="trash" /> Delete
                                </a>
                            </Table.Cell>
                            <Table.Cell>
                                {renderRepetition(event)}
                            </Table.Cell>
                            <Table.Cell>
                                <code>{moment(get_next_executions(event.last_execution, event.start, event.clocking)[0]).format('LLLL')}</code>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
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
            <a className="wp-reminder-add-link" onClick={modal.add}>{__('Add Event', 'wp-reminder')}</a>
            <LoadingContent
                initialized={initialized}
                hasContent={events.length !== 0}
                header={__('No event found', 'wp-reminder')}
                icon='calendar times'
                button={
                    <Button color='green' onClick={modal.add}>{__('Add Event', 'wp-reminder')}</Button>
                }
            >
                {renderTable()}
            </LoadingContent>
            <a
                className={"wp-reminder-delete-link" + (checkbox.filtered().length === 0 ? " wp-reminder-disabled" : "")}
                onClick={(e) => modal.delete(e, events.filter((event, index) => checkbox.get(index)))}>
                {__('Delete selected', 'wp-reminder')}
            </a>
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