import React, { useEffect } from "react";
import {Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import {Loader} from "../components/Loader";
import {SettingsForm} from "../components/SettingsForm";
import {InitializeStates, useInitializer} from "../hooks/useInitializer";

export const SettingsView = () => {

    const [initObject, load] = useInitializer<Settings>();

    useEffect(() => {
        load(async () => {
            return await SettingsHandler.get();
        });
    }, []);

    switch (initObject.state) {
        case InitializeStates.Loading: return <Loader />;
        case InitializeStates.Error: return <div>Error</div>;
        case InitializeStates.Success: return <SettingsForm settings={initObject.value} />
    }

}