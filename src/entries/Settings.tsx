import React, {Fragment, useEffect } from "react";
import {APISettings, SettingsHandler} from "../api/handler/SettingsHandler";
import {Loader} from "../components/Loader";
import {SettingsForm} from "../components/SettingsForm";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Error} from "../components/Error";
import {__} from "@wordpress/i18n";
import {View} from "../View";

const SettingsView = () => {

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
                    {__('There was an internal error', 'remind-me')}
                </Error>
            );
            case InitializeStates.Success: return <SettingsForm settings={initObject.value} />
        }
    }

    return (
        <Fragment>
            <h3>{__('Settings', 'remind-me')}</h3>
            {loadContent()}
        </Fragment>
    );

}

View(<SettingsView />);