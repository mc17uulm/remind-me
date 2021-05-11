import {Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import {Errors, useForm} from "../hooks/useForm";
import {useLoader} from "../hooks/useLoader";
import {Button, Form, List, Message} from "semantic-ui-react";
import {__, _n, sprintf} from "@wordpress/i18n";
import {Info} from "./Info";
import {Editor} from "./editor/Editor";
import React, {FormEvent, Fragment, MouseEvent, useEffect} from "react";
import {toast} from "react-toastify";
import * as yup from "yup";

const RequiredKeywords : {id : keyof Settings, keywords : string[]}[] = [
    {id: 'template_check', keywords: ['${event_list}', '${confirm_link}', '${unsubscribe_link}']},
    {id: 'template_accept', keywords: ['${unsubscribe_link}']},
    {id: 'template_signout', keywords: []},
]

const SettingsSchema : yup.SchemaOf<Settings> = yup.object({
    text_privacy: yup.string().required(__('Please insert a text for the privacy notice', 'wp-reminder')),
    template_check: yup.string().required(),
    template_accept: yup.string().required(),
    template_signout: yup.string().required(),
    signin_msg: yup.string().required(),
    double_opt_in_msg: yup.string().required(),
    signout_msg: yup.string().required(),
    settings_page: yup.string().required()
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

    const getMissingKeywords = (content : string, keywords : string[]) : string[] => {
        return keywords.filter((keyword : string) => {
            return !content.includes(keyword);
        });
    }

    const customValidate = (_state : Settings, errors : Errors<Settings>) : Errors<Settings> => {
        RequiredKeywords.map((el) => {
            const missing = getMissingKeywords(_state[el.id], el.keywords);
            if(missing.length > 0) {
                errors[el.id] = sprintf(__('Required keywords are missing: %s', 'wp-reminder'), missing.join(','));
            }
        });
        return errors;
    }

    const onSubmit = async (e: MouseEvent | FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await doSubmitting(async () => {
            const validate = await form.validate(SettingsSchema, customValidate);
            if(validate.has_error()) return;
            const resp = await SettingsHandler.update(validate.get_value());
            if(resp.has_error()) {
                console.error(resp.get_error());
                toast.error(resp.get_error());
                return;
            }
            toast.success('Saved settings');
        })
    }

    const renderError = () => {
        const _errors = form.getErrors();
        if(_errors.length > 0) {
            return (
                <Message negative>
                    <Message.Header>{__('Error', 'wp-reminder')}</Message.Header>
                    {_n(
                        'There is an error:',
                        'There are multiple errors:',
                        _errors.length,
                        'wp-reminder'
                    )}
                    <List bulleted>
                        {_errors.map((error : string, index : number) => (
                            <List.Item key={`error_${index}`}>{error}</List.Item>
                        ))}
                    </List>
                </Message>
            )
        }
        return null;
    }

    return (
        <Fragment>
            <Form onSubmit={onSubmit}>
                <h2>{__('Email templates', 'wp-reminder')}</h2>
                <Message info>
                    {__('The email templates need some placeholders, marked with the ', 'wp-reminder')}<code>{'${}'}</code>{__(' identifier, to work correctly', 'wp-reminder')}
                </Message>
                <Form.Field error={form.hasError('template_check')}>
                    <label>
                        {__('Confirm email address', 'wp-reminder') + " "}
                         <Info>{__('This email template is send to the user if they subscribed to some events on the site. They have to activate their subscription by a click to the given link.')}</Info>
                    </label>
                    <Message info>
                        {__('Required placeholders:', 'wp-reminder')}
                        <List bulleted>
                            <List.Item><code>{'${event_list}'}</code>{__('Lists the subscribed events', 'wp-reminder')}</List.Item>
                            <List.Item><code>{'${confirm_link}'}</code>{__('Link to confirm the subscription', 'wp-reminder')}</List.Item>
                            <List.Item><code>{'${unsubscribe_link}'}</code>{__('Link to unsubscribe from subscription', 'wp-reminder')}</List.Item>
                        </List>
                    </Message>
                    <Editor
                        value={form.values.template_check}
                        error={form.hasError('template_check')}
                        onChange={(val) => form.setValue('template_check', val)}
                    />
                    {form.hasError('template_check') ? (
                        <div className='ui pointing prompt label'>{form.errors.template_check}</div>
                    ) : ""}
                </Form.Field>
                <Form.Field error={form.hasError('template_accept')}>
                    <label>
                        {__('Success message for subscription', 'wp-reminder') + " "}
                         <Info>{__('Is the user confirmed the subscription this success mail is send')}</Info>
                    </label>
                    <Message info>
                        {__('Required placeholders:', 'wp-reminder')}
                        <List bulleted>
                            <List.Item><code>{'${unsubscribe_link}'}</code>{__('Link to edit/unsubscribe from subscription', 'wp-reminder')}</List.Item>
                        </List>
                    </Message>
                    <Editor
                        value={form.values.template_accept}
                        error={form.hasError('template_accept')}
                        onChange={(val) => form.setValue('template_accept', val)}
                    />
                    {form.hasError('template_accept') ? (
                        <div className='ui pointing prompt label'>{form.errors.template_accept}</div>
                    ) : ""}
                </Form.Field>
                <Form.Field error={form.hasError('template_signout')}>
                    <label>
                        {__('Signout email', 'wp-reminder') + " "}
                         <Info>{__('If the user signed out, this confirm message is send.')}</Info>
                    </label>
                    <Editor
                        value={form.values.template_signout}
                        error={form.hasError('template_signout')}
                        onChange={(val) => form.setValue('template_signout', val)}
                    />
                    {form.hasError('template_signout') ? (
                        <div className='ui pointing prompt label'>{form.errors.template_signout}</div>
                    ) : ""}
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
                <h2>{__('Edit subscription page')}</h2>
                <Message info>
                    {__('This site requires an [wp-reminder-settings] shortcode as content', 'wp-reminder')}
                </Message>
                <Form.Input
                    value={form.values.settings_page}
                    disabled={submitting}
                    name='settings_page'
                    onChange={form.onChange}
                    error={form.errors.settings_page}
                    label={__('WordPress page to display edit subscription page', 'wp-reminder')}
                />
                {renderError()}
                <Button color='green' loading={submitting} onClick={onSubmit} floated={"right"}>{__('Submit', 'wp-reminder')}</Button>
            </Form>
        </Fragment>
    );

}
