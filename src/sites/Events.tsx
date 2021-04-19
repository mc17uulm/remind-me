import React, {Fragment, useEffect, useState} from "react";
import {Checkbox, Label, Table} from "semantic-ui-react";
import {Event, EventHandler, get_repetition, is_event_active} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {toast} from "react-toastify";
import {AddEventModal} from "../components/modals/AddEventModal";
import set = Reflect.set;
import {Icon} from "../components/Icon";
import moment from "moment";

export const Events = () => {

    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

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

    const handleAllCheck = (_checked : boolean) => {
        setChecked(checked.map((val : boolean) => {
            return !_checked;
        }))
    }

    const handleCheck = (index : number) => {
        setChecked(checked.map((val : boolean, _index : number) => {
            return (_index === index) ? val : !val;
        }));
    }

    const renderRepetition = (event : Event) => {
        const active = is_event_active(event);
        return (
            <Fragment>
                <Label color={active ? 'green' : 'red'} horizontal>
                    {active ? __('active', 'wp-reminder') : __('not-active', 'wp-reminder')}
                </Label>
                {get_repetition(event)}<br />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <a href="" style={{color: "green"}} onClick={(e) => {e.preventDefault(); setAddOpen(true)}}>{__('Add Event', 'wp-reminder')}</a>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell><Checkbox onChange={(e, d) => handleAllCheck(d.checked ?? false)} /></Table.HeaderCell>
                        <Table.HeaderCell>{__("Event", "wp-reminder")}</Table.HeaderCell>
                        <Table.HeaderCell>{__("Status", "wp-reminder")}</Table.HeaderCell>
                        <Table.HeaderCell>{__('Next Execution', 'wp-reminder')}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {events.map((event: Event, index : number) => (
                        <Table.Row key={`event_${index}`}>
                            <Table.Cell><Checkbox checked={checked[index]} onChange={() => handleCheck(index)} /></Table.Cell>
                            <Table.Cell>
                                <strong>{event.name}</strong><br />
                                <a href="#" color="blue">Edit</a> <a href="#" color="red">Delete</a>
                            </Table.Cell>
                            <Table.Cell>
                                {renderRepetition(event)}
                            </Table.Cell>
                            <Table.Cell>
                                <code>{moment(event.start * 1000).format('LLLL')}</code>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <AddEventModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={() => setAddOpen(false)} />
        </Fragment>
    );


}