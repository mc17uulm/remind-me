import React, {Fragment, useEffect, useState, MouseEvent} from "react";
import {__} from "@wordpress/i18n";
import {Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import {toast} from "react-toastify";
import {Editor} from "../components/editor/Editor";
import {Loader} from "../components/Loader";
import {Button, Form} from "semantic-ui-react";

export const SettingsView = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [settings, setSettings] = useState<Settings>();

    const loadSettings = async () => {
        const resp = await SettingsHandler.get();
        if(resp.has_error()) {
            toast.error(resp.get_error());
            return;
        }
        setSettings(resp.get_value());
        setLoading(false);
    }

    useEffect(() => {
        loadSettings();
    }, []);

    const updateSettings = (key : keyof Settings, value : any) => {
        if(typeof settings !== "undefined") {
            let _settings : Settings = settings;
            _settings[key] = value;
            setSettings(_settings);
        }
    }

    const onSubmit = async (e : MouseEvent) => {
        e.preventDefault();
        if(typeof settings === "undefined") return;
        const resp = await SettingsHandler.update(settings);
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
            return;
        }
        toast.success('Saved settings');
    }

    const renderSettings = () => {
        return (
            <Fragment>
                <h2>{__('Email templates', 'wp-reminder')}</h2>
                <h3>{__('Confirm email address', 'wp-reminder')}</h3>
                <Editor value={settings?.template_check ?? ""} onBlur={(val) => updateSettings('template_check', val)}/>
                <h3>{__('Success message for subscription', 'wp-reminder')}</h3>
                <Editor value={settings?.template_accept ?? ""} onBlur={(val) => updateSettings('template_accept', val)}/>
                <h3>{__('Signout email', 'wp-reminder')}</h3>
                <Editor value={settings?.template_signout ?? ""} onBlur={(val) => updateSettings('template_signout', val)}/>
                <h2>{__('Messages', 'wp-reminder')}</h2>
                <Form>
                    <Form.Input
                        value={settings?.signin_msg}
                        onChange={(e) => updateSettings('signin_msg', e.target.value)}
                        label={__('Sign in success message', 'wp-reminder')}
                    />
                    <Form.Input
                        value={settings?.double_opt_in_msg}
                        onChange={(e) => updateSettings('double_opt_in_msg', e.target.value)}
                        label={__('Double-opt-in success message', 'wp-reminder')}
                    />
                    <Form.Input
                        value={settings?.signout_msg}
                        onChange={(e) => updateSettings('signout_msg', e.target.value)}
                        label={__('Signout success message', 'wp-reminder')}
                    />
                </Form>
                <h2>{__('Texts', 'wp-reminder')}</h2>
                <Form>
                    <Form.Input
                        value={settings?.text_privacy}
                        onChange={(e) => updateSettings('text_privacy', e.target.value)}
                        label={__('Privacy text for shortcode', 'wp-reminder')}
                    />
                </Form>
                <br />
                <Button onClick={onSubmit} floated={"right"}>{__('Submit', 'wp-reminder')}</Button>
            </Fragment>
        )
    }

    const renderLoading = () => {
        return <Loader />
    }

    return loading ? renderLoading() : renderSettings();
}