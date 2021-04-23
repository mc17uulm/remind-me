import React, {Fragment, useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Dimmer,
    Form,
    Grid,
    Label,
    Loader, Placeholder,
    Segment,
    Table
} from "semantic-ui-react";
import {APIEvent, Event, EventHandler, get_next_executions, get_repetition} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {toast} from "react-toastify";
import moment from "moment";
import {HandleEventModal} from "../components/modals/HandleEventModal";
import {HandableModalType} from "../components/modals/HandableModal";
import "../styles/events.scss";
import {Icon} from "../components/Icon";
import CopyToClipboard from "react-copy-to-clipboard";
import {useCheck} from "../hooks/Check";
import {useModalSelect} from "../hooks/ModalSelect";

export const Events = () => {

    const [modalType, selectedElements, handleModalSelect] = useModalSelect<APIEvent>();
    const [checked, handleCheck] = useCheck<APIEvent>();
    const [events, setEvents] = useState<APIEvent[]>([]);

    console.log(selectedElements);

    const loadEvents = async () : Promise<void> => {
        const resp = await EventHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setEvents(resp.get_value());
            handleCheck.set(resp.get_value());
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    const onSuccess = async () => {
        handleModalSelect.hide();
        await loadEvents();
    }

    const renderRepetition = (event : Event) => {
        return (
            <Fragment>
                <Label color={event.active ? 'green' : 'red'} horizontal>
                    {event.active ? __('active', 'wp-reminder') : __('not-active', 'wp-reminder')}
                </Label>
                {get_repetition(event.clocking, new Date(event.start * 1000).getDate())}<br />
            </Fragment>
        );
    }

    const generateShortcode = () : string => {
        let shortcode = "[wp-reminder events='";
        let added = false;
        checked.forEach((is_checked : boolean, index : number) => {
            if(is_checked) {
                shortcode += events[index].id + ",";
                added = true;
            }
        });
        if(added) {
            shortcode = shortcode.slice(0, -1);
        }
        return shortcode + "']";
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

    const renderLoader = () => {
        return (
            <Segment style={{height: "250px"}}>
                <Dimmer active>
                    <Loader>{__('Loading', 'wp-reminder')}</Loader>
                </Dimmer>

                <Placeholder />
            </Segment>
        );
    }

    const renderTable = () => {
        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            <Checkbox
                                indeterminate={handleCheck.indeterminate()}
                                checked={handleCheck.all()}
                                onChange={(e, d) => handleCheck.update_all(d.checked ?? false)}
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
                            <Table.Cell><Checkbox checked={handleCheck.get(index)} onChange={() => handleCheck.update(index)} /></Table.Cell>
                            <Table.Cell>
                                <strong>{event.name}</strong><br />
                                <a className="wp-reminder-edit-link wp-reminder-small" onClick={(e) => handleModalSelect.onEdit(e, event)} color="blue">
                                    <Icon class="cog" /> Edit
                                </a>   <a className="wp-reminder-delete-link wp-reminder-small" onClick={(e) =>  handleModalSelect.onDelete(e, event)} color="red">
                                <Icon class="trash" /> Delete
                            </a>
                            </Table.Cell>
                            <Table.Cell>
                                {renderRepetition(event)}
                            </Table.Cell>
                            <Table.Cell>
                                <code>{moment(get_next_executions(event.last_execution, event.start * 1000, event.clocking)[0]).format('LLLL')}</code>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }

    return (
        <Fragment>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column floated={"left"}>
                        <h2>{__('Events', 'wp-reminder')}</h2>
                    </Grid.Column>
                    <Grid.Column floated={"right"}>
                        <label>{__('Shortcode', 'wp-reminder')}</label>
                        {renderShortcode()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <a className="wp-reminder-add-link" onClick={handleModalSelect.onAdd}>{__('Add Event', 'wp-reminder')}</a>
            {events.length === 0 ? renderLoader() : renderTable()}
            <HandleEventModal
                open={modalType !== HandableModalType.HIDE}
                onClose={handleModalSelect.onClose}
                onSuccess={onSuccess}
                elements={selectedElements}
                element={selectedElements[0]}
                type={modalType}
            />
            <a 
                className={"wp-reminder-delete-link" + (handleCheck.filtered().length === 0 ? " wp-reminder-disabled" : "")} 
                onClick={(e) => handleModalSelect.onMultipleDelete(e, events.filter((event, index) => handleCheck.get(index)))}>
                {__('Delete selected', 'wp-reminder')}
            </a>
        </Fragment>
    );


}