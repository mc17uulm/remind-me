import React, {Fragment, MouseEvent, useEffect, useRef, useState} from "react";
import {Button, Checkbox, Form, FormField, Grid, Input, Label, Ref, Segment, Table} from "semantic-ui-react";
import {APIEvent, Event, EventHandler, get_next_executions, get_repetition} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {toast} from "react-toastify";
import moment from "moment";
import {HandleEventModal} from "../components/modals/HandleEventModal";
import {HandableModalType} from "../components/modals/HandableModal";
import "../styles/events.scss";
import {Icon} from "../components/Icon";
import CopyToClipboard from "react-copy-to-clipboard";

export const Events = () => {

    const [modal, setModal] = useState<HandableModalType>(HandableModalType.HIDE);
    const [selected, setSelected] = useState<APIEvent | null>(null);
    const [checked, setChecked] = useState<boolean[]>([]);
    const [events, setEvents] = useState<APIEvent[]>([]);

    const loadEvents = async () : Promise<void> => {
        const resp = await EventHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setEvents(resp.get_value());
            setChecked(resp.get_value().map(() => false));
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    const onAdd = (e : MouseEvent) => {
        e.preventDefault();
        setSelected(null);
        setModal(HandableModalType.ADD);
    }

    const onDelete = (e : MouseEvent, event : APIEvent) => {
        e.preventDefault();
        setSelected(event);
        setModal(HandableModalType.DELETE);
    }

    const onEdit = (e : MouseEvent, event : APIEvent) => {
        e.preventDefault();
        setSelected(event);
        setModal(HandableModalType.EDIT);
    }

    const onSuccess = async () => {
        setModal(HandableModalType.HIDE);
        await loadEvents();
    }

    const onClose = () => {
        setSelected(null);
        setModal(HandableModalType.HIDE);
    }

    const handleAllCheck = (_checked : boolean) => {
        setChecked(checked.map((val : boolean) => {
            return _checked;
        }))
    }

    const handleCheck = (index : number) => {
        setChecked(checked.map((val : boolean, _index : number) => {
            return (_index === index) ? !val : val;
        }));
    }

    const getChecked = () : number => {
        return checked.filter((val : boolean) => {
            return val;
        }).length;
    }

    const indeterminate = () : boolean => {
        const _checked = getChecked();
        return (_checked > 0) && (_checked < checked.length);
    }

    const allChecked = () : boolean => {
        return getChecked() === checked.length;
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

    return (
        <Fragment>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column floated={"left"}>
                        <a className="wp-reminder-add-link" onClick={onAdd}>{__('Add Event', 'wp-reminder')}</a>
                    </Grid.Column>
                    <Grid.Column floated={"right"}>
                        <label>{__('Shortcode', 'wp-reminder')}</label>
                        {renderShortcode()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            <Checkbox
                                indeterminate={indeterminate()}
                                checked={allChecked()}
                                onChange={(e, d) => handleAllCheck(d.checked ?? false)}
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
                            <Table.Cell><Checkbox checked={checked[index]} onChange={() => handleCheck(index)} /></Table.Cell>
                            <Table.Cell>
                                <strong>{event.name}</strong><br />
                                <a className="wp-reminder-edit-link wp-reminder-small" onClick={(e) => onEdit(e, event)} color="blue">
                                    <Icon class="cog" /> Edit
                                </a>   <a className="wp-reminder-delete-link wp-reminder-small" onClick={(e) => onDelete(e, event)} color="red">
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
            <HandleEventModal
                open={modal !== HandableModalType.HIDE}
                onClose={onClose}
                onSuccess={onSuccess}
                element={selected}
                type={modal}
            />
        </Fragment>
    );


}