import React, {Fragment, useEffect } from "react";
import {APISettings, SettingsHandler} from "../api/handler/SettingsHandler";
import {Loader} from "../components/Loader";
import {SettingsForm} from "../components/SettingsForm";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Error} from "../components/Error";
import {__} from "@wordpress/i18n";

export const SettingsView = () => {

    const [initObject, _load] = useInitializer<APISettings>();

    useEffect(() => {
        _load(async () => {
            return await SettingsHandler.get();
        });
    }, []);

    const loadContent = () => {
        switch (initObject.state) {
            case InitializeStates.Loading: return <Loader />;
            case InitializeStates.Error: return (
                <Error>
                    {__('There was an internal error', 'wp-reminder')}
                </Error>
            );
            case InitializeStates.Success: return <SettingsForm settings={initObject.value} />
        }
    }

    return (
        <Fragment>
            <h3>{__('Settings', 'wp-reminder')}</h3>
            {loadContent()}
        </Fragment>
    )

}