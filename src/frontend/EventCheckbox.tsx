import {APIEvent} from "../api/handler/EventHandler";
import React from "react";
import {__} from "@wordpress/i18n";

interface EventCheckboxProps {
    block: boolean,
    event: APIEvent,
    error: string | null,
    checked: boolean,
    index: number,
    update: (index : number) => void,
    submitting: boolean
}

const ClockingMap : {id: number, text: string}[] = [
    {id : 1, text : __('monthly', 'remind-me')},
    {id: 2, text: __('2-monthly', 'remind-me')},
    {id: 3, text: __('quarterly', 'remind-me')},
    {id: 4, text: __('4-monthly', 'remind-me')},
    {id: 6, text: __('half-yearly', 'remind-me')},
    {id: 12, text: __('yearly', 'remind-me')},
];

export const clockingToStr = (clocking : number) : string => {
    const elem = ClockingMap.filter((elem : {id : number, text: string}) => {
        return elem.id === clocking;
    });
    if(elem.length !== 1) return "";
    return elem[0].text;
}

export const EventCheckbox = (props : EventCheckboxProps) => {

    const className = (props.block ? 'block' : '') + (props.error === null ? '' : ' error');

    return (
        <div className='checkbox-container'>
            <div className='checkbox'>
                <input
                    className={className}
                    readOnly
                    disabled={props.submitting}
                    tabIndex={0}
                    type='checkbox'
                    onChange={() => props.update(props.index)}
                    checked={props.checked}
                />
            </div>
            <div className='checkbox-label'>
                <label>{props.event.name}</label>
                <p>{clockingToStr(props.event.clocking)}</p>
            </div>
            <div className='checkbox-description'>{props.event.description}</div>
        </div>
    )

}