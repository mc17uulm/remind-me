import {FormikProps} from "formik";
import {APISettings, Templates} from "../../api/handler/SettingsHandler";
import {Form, List, Message, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {Info} from "../Info";
import {Editor} from "../editor/Editor";
import React from "react";

export const TemplatesPane = (props : FormikProps<APISettings>) => {

    return (
        <Tab.Pane attached={false}>
            <h2>{__('Email templates', 'wp-reminder')}</h2>
            <Message info>
                {__('The email templates need some placeholders, marked with the ', 'wp-reminder')}<code>{'${}'}</code>{__(' identifier, to work correctly', 'wp-reminder')}
            </Message>
            <h3>{__('Confirm email address', 'wp-reminder')}</h3>
            <Form.Input
                value={props.values.templates.confirm.subject}
                onChange={props.handleChange}
                name='templates.confirm.subject'
                disabled={props.isSubmitting}
                error={props.errors.templates?.confirm?.subject && props.touched.templates?.confirm?.subject ? props.errors.templates?.confirm?.subject : null}
                label={__('Subject | Confirm email address', 'wp-reminder')}
            />
            <Form.Field error={!!(props.errors.templates?.confirm?.html && props.touched.templates?.confirm?.html)}>
                <label>
                    {__('Template | Confirm email address', 'wp-reminder') + " "}
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
                    value={props.values.templates.confirm.html}
                    error={!!(props.errors.templates?.confirm?.html && props.touched.templates?.confirm?.html)}
                    onChange={(val) => props.setFieldValue('templates.confirm.html', val)}
                />
                {!!(props.errors.templates?.confirm?.html && props.touched.templates?.confirm?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.templates.confirm.html}</div>
                ) : ""}
            </Form.Field>
            <h3>{__('Success message for subscription', 'wp-reminder')}</h3>
            <Form.Input
                value={props.values.templates.success.subject}
                onChange={props.handleChange}
                name='templates.success.subject'
                disabled={props.isSubmitting}
                error={props.errors.templates?.success?.subject && props.touched.templates?.success?.subject ? props.errors.templates?.success?.subject : null}
                label={__('Subject | Success message for subscription', 'wp-reminder')}
            />
            <Form.Field error={!!(props.errors.templates?.confirm?.html && props.touched.templates?.confirm?.html)}>
                <label>
                    {__('Template | Success message for subscription', 'wp-reminder') + " "}
                    <Info>{__('Is the user confirmed the subscription this success mail is send')}</Info>
                </label>
                <Message info>
                    {__('Required placeholders:', 'wp-reminder')}
                    <List bulleted>
                        <List.Item><code>{'${unsubscribe_link}'}</code>{__('Link to edit/unsubscribe from subscription', 'wp-reminder')}</List.Item>
                    </List>
                </Message>
                <Editor
                    value={props.values.templates.success.html}
                    error={!!(props.errors.templates?.success?.html && props.touched.templates?.success?.html)}
                    onChange={(val) => props.setFieldValue('templates.success.html', val)}
                />
                {!!(props.errors.templates?.confirm?.html && props.touched.templates?.confirm?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.templates.confirm.html}</div>
                ) : ""}
            </Form.Field>
            <h3>{__('Signout email', 'wp-reminder')}</h3>
            <Form.Input
                value={props.values.templates.signout.subject}
                onChange={props.handleChange}
                name='templates.signout.subject'
                disabled={props.isSubmitting}
                error={props.errors.templates?.signout?.subject && props.touched.templates?.signout?.subject ? props.errors.templates?.signout?.subject : null}
                label={__('Subject | Signout email', 'wp-reminder')}
            />
            <Form.Field error={!!(props.errors.templates?.signout?.html && props.touched.templates?.signout?.html)}>
                <label>
                    {__('Template | Signout email', 'wp-reminder') + " "}
                    <Info>{__('If the user signed out, this confirm message is send.')}</Info>
                </label>
                <Editor
                    value={props.values.templates.signout.html}
                    error={!!(props.errors.templates?.signout?.html && props.touched.templates?.signout?.html)}
                    onChange={(val) => props.setFieldValue('templates.signout.html', val)}
                />
                {!!(props.errors.templates?.signout?.html && props.touched.templates?.signout?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.templates.signout.html}</div>
                ) : ""}
            </Form.Field>
            <h3>{__('Reminder email', 'wp-reminder')}</h3>
            <Form.Input
                value={props.values.templates.reminder.subject}
                onChange={props.handleChange}
                name='templates.reminder.subject'
                disabled={props.isSubmitting}
                error={props.errors.templates?.reminder?.subject && props.touched.templates?.reminder?.subject ? props.errors.templates?.reminder?.subject : null}
                label={__('Subject | Reminder email', 'wp-reminder')}
            />
            <Form.Field error={!!(props.errors.templates?.reminder?.html && props.touched.templates?.reminder?.html)}>
                <label>
                    {__('Template | Reminder email', 'wp-reminder') + " "}
                    <Info>{__('The email template for your reminder messages', 'wp-reminder')}</Info>
                </label>
                <Message info>
                    {__('Required placeholders:', 'wp-reminder')}
                    <List bulleted>
                        <List.Item><code>{'${event_list}'}</code>{__('Lists of events to be reminded', 'wp-reminder')}</List.Item>
                        <List.Item><code>{'${unsubscribe_link}'}</code>{__('Link to unsubscribe from subscription', 'wp-reminder')}</List.Item>
                    </List>
                </Message>
                <Editor
                    value={props.values.templates.reminder.html}
                    error={!!(props.errors.templates?.reminder?.html && props.touched.templates?.reminder?.html)}
                    onChange={(val) => props.setFieldValue('templates.reminder.html', val)}
                />
                {!!(props.errors.templates?.reminder?.html && props.touched.templates?.reminder?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.templates.reminder.html}</div>
                ) : ""}
            </Form.Field>

        </Tab.Pane>
    )

}