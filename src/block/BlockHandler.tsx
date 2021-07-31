import React, {ChangeEvent, Fragment, PropsWithChildren, useEffect} from "react";
import {BlockEditProps} from "@wordpress/blocks";
import {BlockAttributes} from "../block";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {useCheckbox} from "../hooks/useCheckbox";
import {Either} from "../api/Either";
import {clockingToStr} from "../frontend/SubscriptionForm";
import {Loader} from "../frontend/Loader";
import {Message} from "../frontend/Message";

export const BlockHandler = (props : PropsWithChildren<BlockEditProps<BlockAttributes>>) => {

    const [initObject, load] = useInitializer<APIEvent[]>();
    const checkbox = useCheckbox<APIEvent>();

    useEffect(() => {
        load(async () => {
            const events = await EventHandler.get_all();
            console.log(events);
            if(events.has_error()) return Either.error(events.get_error());
            let list : number[] = [];
            try {
                list = JSON.parse(props.attributes.events);
            } catch(e) {}
            const checked = events.get_value().map((event : APIEvent) => list.includes(event.id));
            checkbox.set(events.get_value(), checked);
            return Either.success(events.get_value());
        });
    }, []);

    const check = (index : number) : void => {
        if(initObject.state === InitializeStates.Success) {
            let list = checkbox.list();
            list[index] = !list[index];
            const events = JSON.stringify(list.filter(val => val).map((_, i) => initObject.value[i].id));
            props.setAttributes({events: events});
            checkbox.update(index);
        }
    }

    const renderEvents = (events : APIEvent[]) : JSX.Element => {
        return (events.length === 0)  ? (
            <Message msg={{type: 'error', msg: __('Please add first a event on the WPReminder page', 'wp-reminder')}} />
        ) : (
            <Fragment>
                {events.map((event: APIEvent, index: number) => (
                    <div className='checkbox-container' key={`event_${index}`}>
                        <div className='checkbox'>
                            <input
                                className={''}
                                readOnly
                                tabIndex={0}
                                type='checkbox'
                                onChange={() => check(index)}
                                checked={checkbox.get(index)}
                            />
                        </div>
                        <div className='checkbox-label'>
                            <label>{event.name}</label>
                            <p>{clockingToStr(event.clocking)}</p>
                        </div>
                    </div>
                ))}
            </Fragment>
        )
    }

    const render = () : JSX.Element => {
        switch(initObject.state) {
            case InitializeStates.Loading: return <Loader />;
            case InitializeStates.Error: return <Message msg={{type: 'error', msg: initObject.error}} />
            case InitializeStates.Success: return renderEvents(initObject.value);
        }
    }

    const handleTitleChange = (e : ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        props.setAttributes({
            title: e.target.value
        });
    }

    return (
        <div className='wp-reminder-container'>
            <h4>
                <input
                    onChange={handleTitleChange}
                    value={props.attributes.title}
                    placeholder={__('Title', 'wp-reminder')}
                />
            </h4>
            {render()}
        </div>
    )

}