import React, {ChangeEvent, Fragment, PropsWithChildren, useEffect} from "react";
import {BlockEditProps} from "@wordpress/blocks";
import {BlockAttributes} from "../block";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {APIEvent, EventHandler} from "../api/handler/EventHandler";
import {__} from "@wordpress/i18n";
import {useCheckbox} from "../hooks/useCheckbox";
import {Either} from "../api/Either";
import {EventCheckbox} from "../frontend/EventCheckbox";
import {Loader} from "../frontend/Loader";
import {Message} from "../frontend/Message";

export const BlockHandler = (props : PropsWithChildren<BlockEditProps<BlockAttributes>>) => {

    const [initObject, load] = useInitializer<APIEvent[]>();
    const checkbox = useCheckbox<APIEvent>();

    useEffect(() => {
        load(async () => {
            const events = await EventHandler.get_all();
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
            <Message msg={{type: 'error', msg: __('Please add first a event on the RemindMe page', 'remind-me')}} />
        ) : (
            <Fragment>
                {events.map((event: APIEvent, index: number) => (
                    <EventCheckbox
                        key={`event_${index}`}
                        block={true}
                        event={event}
                        error={null}
                        checked={checkbox.get(index)}
                        index={index}
                        update={() => check(index)}
                        submitting={false}
                    />
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
        <div className='remind-me-container'>
            <h4>
                <input
                    onChange={handleTitleChange}
                    value={props.attributes.title}
                    placeholder={__('Title', 'remind-me')}
                />
            </h4>
            <form>
                {render()}
            </form>
        </div>
    )

}