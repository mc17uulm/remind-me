import {Icon, List} from "semantic-ui-react";
import {APIEvent, get_repetition} from "../api/handler/EventHandler";
import React, {useState, MouseEvent, Fragment} from "react";
import {__, sprintf} from "@wordpress/i18n";

interface EventsListProps {
    events : APIEvent[],
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
            <a className='remind-me-link' onClick={toggle}>
                <Icon name='list' />{" "}
                {sprintf(props.events.length === 1 ? __('%d Event', ' remind-me') : __('%d Events', 'remind-me'), props.events.length)}
            </a>
            <List>
                {open ? props.events.map((event : APIEvent, _index : number) => (
                    <List.Item key={`${props.index}_event_${_index}`}>
                        <List.Icon name='calendar' />
                        <List.Content>
                            <List.Header>{event.name}</List.Header>
                            <List.Description>{get_repetition(event.start, event.clocking)}</List.Description>
                        </List.Content>
                    </List.Item>
                ))  : ""}
            </List>
        </Fragment>
    )
}