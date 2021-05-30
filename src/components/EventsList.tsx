import {List} from "semantic-ui-react";
import {Event} from "../api/handler/EventHandler";
import React, {useState, MouseEvent, Fragment} from "react";
import {_n, sprintf} from "@wordpress/i18n";
import {Icon} from "./Icon";

interface EventsListProps {
    events : Event[],
    index : number
}

export const EventsList = (props: EventsListProps) => {

    const [open, setOpen] = useState<boolean>(false);

    const toggle = (e : MouseEvent) => {
        e.preventDefault();
        setOpen(!open);
    }

    return (
        <Fragment>
            <a className='wp-reminder-link' onClick={toggle}><Icon class='arrow-circle-right' /> {sprintf(_n('%d Event', '%d Events', props.events.length, 'wp-reminder'), props.events.length)}</a>
            <List bulleted>
                {open ? props.events.map((event : Event, _index : number) => (
                    <List.Item key={`${props.index}_event_${_index}`}>{event.name}</List.Item>
                ))  : ""}
            </List>
        </Fragment>
    )
}