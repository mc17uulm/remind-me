import React, {Fragment, useEffect} from "react";
import {__} from "@wordpress/i18n";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Templates, TemplatesHandler} from "../api/handler/TemplatesHandler";
import {Loader} from "../components/Loader";
import {Error} from "../components/Error";
import { TemplatesForm } from "../components/TemplatesForm";

export const TemplateSite = () => {

    const [initObject, _load] = useInitializer<Templates>();

    useEffect(() => {
        _load(TemplatesHandler.get);
    }, []);

    const loadContent = () => {
        switch(initObject.state) {
            case InitializeStates.Loading: return <Loader />;
            case InitializeStates.Error: return (
                <Error>
                    {__('There was an internal error', 'wp-reminder')}
                </Error>
            );
            case InitializeStates.Success: return <TemplatesForm templates={initObject.value} />
        }
    }

    return (
        <Fragment>
            <h3>{__('Email templates', 'wp-reminder')}</h3>
            {loadContent()}
        </Fragment>
    );

}