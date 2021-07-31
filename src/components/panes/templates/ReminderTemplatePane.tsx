import {FormikProps} from "formik";
import {Templates} from "../../../api/handler/TemplatesHandler";
import {Form, List, Message, Tab} from "semantic-ui-react";
import React from "react";
import {__} from "@wordpress/i18n";
import {Info} from "../../Info";
import {Editor} from "../../editor/Editor";

export const ReminderTemplatePane = (props : FormikProps<Templates>) => {
    
    return (
        <Tab.Pane attached={false}>
            <h3>{__('Reminder email', 'wp-reminder')}</h3>
            <Form.Input
                value={props.values.reminder.subject}
                onChange={props.handleChange}
                name='reminder.subject'
                disabled={props.isSubmitting}
                error={props.errors.reminder?.subject && props.touched.reminder?.subject ? props.errors.reminder?.subject : null}
                label={__('Subject | Reminder email', 'wp-reminder')}
            />
            <Form.Field error={!!(props.errors.reminder?.html && props.touched.reminder?.html)}>
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
                    value={props.values.reminder.html}
                    error={!!(props.errors.reminder?.html && props.touched.reminder?.html)}
                    onChange={(val) => props.setFieldValue('reminder.html', val)}
                />
                {!!(props.errors.reminder?.html && props.touched.reminder?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.reminder.html}</div>
                ) : ""}
            </Form.Field>
        </Tab.Pane>
    )
    
}