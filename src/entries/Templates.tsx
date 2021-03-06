import React, {Fragment, useEffect} from "react";
import {__} from "@wordpress/i18n";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Templates, TemplatesHandler} from "../api/handler/TemplatesHandler";
import {Loader} from "../components/Loader";
import {Error} from "../components/Error";
import { TemplatesForm } from "../components/TemplatesForm";
import {View} from "../View";

const TemplateSite = () => {

    const [initObject, _load] = useInitializer<Templates>();

    useEffect(() => {
        _load(TemplatesHandler.get);
    }, []);

    const loadContent = () => {
        switch(initObject.state) {
            case InitializeStates.Loading: return <Loader />;
            case InitializeStates.Error: return (
                <Error>
                    {__('There was an internal error', 'remind-me')}
                </Error>
            );
            case InitializeStates.Success: return <TemplatesForm templates={initObject.value} />
        }
    }

    return (
        <Fragment>
            <h3>{__('Email templates', 'remind-me')}</h3>
            {loadContent()}
        </Fragment>
    );

}

View(<TemplateSite />);