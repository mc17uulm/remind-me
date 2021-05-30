import React, { useEffect } from "react";
import {APISettings, SettingsHandler} from "../api/handler/SettingsHandler";
import {Loader} from "../components/Loader";
import {SettingsForm} from "../components/SettingsForm";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";
import {Error} from "../components/Error";
import {__} from "@wordpress/i18n";

export const SettingsView = () => {

    const [initObject, load] = useInitializer<APISettings>();

    useEffect(() => {
        load(async () => {
            return await SettingsHandler.get();
        });
    }, []);

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