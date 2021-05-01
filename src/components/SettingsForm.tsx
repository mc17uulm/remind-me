import {Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import {useForm} from "../hooks/useForm";
import {useLoader} from "../hooks/useLoader";
import {Button, Form} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {Info} from "./Info";
import {Editor} from "./editor/Editor";
import React, {MouseEvent, useEffect} from "react";
import {toast} from "react-toastify";
import * as yup from "yup";

const SettingsSchema : yup.SchemaOf<Settings> = yup.object({
    text_privacy: yup.string().required(__('Please insert a text for the privacy notice', 'wp-reminder')),
    template_check: yup.string().required(),
    template_accept: yup.string().required(),
    template_signout: yup.string().required(),
    signin_msg: yup.string().required(),
    double_opt_in_msg: yup.string().required(),
    signout_msg: yup.string().required(),
});

interface SettingsFormProps {
    settings : Settings
}

export const SettingsForm = (props : SettingsFormProps) => {

    const [form, setForm] = useForm<Settings>(props.settings);
    const [submitting, doSubmitting] = useLoader();

    useEffect(() => {
        setForm(props.settings);
    }, [props.settings]);

    const onSubmit = async (e: MouseEvent) => {
        e.preventDefault();
        await doSubmitting(async () => {
            const validate = await form.validate(SettingsSchema);
            if(validate.has_error()) {
                return;
            }
            const resp = await SettingsHandler.update(validate.get_value());
            if(resp.has_error()) {
                console.error(resp.get_error());
                toast.error(resp.get_error());
                return;
            }
            toast.success('Saved settings');
        })
    }

    return (
        <Form>
            <h2>{__('Email templates', 'wp-reminder')}</h2>
            <Form.Field>
                <label>{__('Confirm email address', 'wp-reminder')} <Info>{__('This email template is send to the user if they subscribed to some events on the site. ')}</Info></label>
                <Editor value={form.values.template_check} onBlur={(val) => form.setValue('template_check', val)}/>
            </Form.Field>
            <Form.Field>
                <label>{__('Success message for subscription', 'wp-reminder')}</label>
                <Editor value={form.values.template_accept} onBlur={(val) => form.setValue('template_accept', val)}/>
            </Form.Field>
            <Form.Field>
                <label>{__('Signout email', 'wp-reminder')}</label>
                <Editor value={form.values.template_signout} onBlur={(val) => form.setValue('template_signout', val)}/>
            </Form.Field>
            <h2>{__('Messages', 'wp-reminder')}</h2>
            <Form.Input
                value={form.values.signin_msg}
                onChange={form.onChange}
                name='signin_msg'
                disabled={submitting}
                error={form.errors.signin_msg}
                label={__('Sign in success message', 'wp-reminder')}
            />
            <Form.Input
                value={form.values.double_opt_in_msg}
                disabled={submitting}
                onChange={form.onChange}
                name='double_opt_in_msg'
                error={form.errors.double_opt_in_msg}
                label={__('Double-opt-in success message', 'wp-reminder')}
            />
            <Form.Input
                value={form.values.signout_msg}
                disabled={submitting}
                name='signout_msg'
                onChange={form.onChange}
                error={form.errors.signout_msg}
                label={__('Signout success message', 'wp-reminder')}
            />
            <h2>{__('Texts', 'wp-reminder')}</h2>
            <Form.Input
                value={form.values.text_privacy}
                disabled={submitting}
                name='text_privacy'
                onChange={form.onChange}
                error={form.errors.text_privacy}
                label={__('Privacy text for shortcode', 'wp-reminder')}
            />
            <br />
            <Button color='green' loading={submitting} onClick={onSubmit} floated={"right"}>{__('Submit', 'wp-reminder')}</Button>
        </Form>
    );

}