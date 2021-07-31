import {FormikProps} from "formik";
import {Templates} from "../../../api/handler/TemplatesHandler";
import {Form, List, Message, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {Info} from "../../Info";
import {Editor} from "../../editor/Editor";
import React from "react";

export const ConfirmTemplatePane = (props : FormikProps<Templates>) => {
    
    return (
        <Tab.Pane attached={false}>
            <h3>{__('Confirm email address', 'wp-reminder')}</h3>
            <Form.Input
                value={props.values.confirm.subject}
                onChange={props.handleChange}
                name='confirm.subject'
                disabled={props.isSubmitting}
                error={props.errors.confirm?.subject && props.touched.confirm?.subject ? props.errors.confirm?.subject : null}
                label={__('Subject | Confirm email address', 'wp-reminder')}
            />
            <Form.Field error={!!(props.errors.confirm?.html && props.touched.confirm?.html)}>
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
                    value={props.values.confirm.html}
                    error={!!(props.errors.confirm?.html && props.touched.confirm?.html)}
                    onChange={(val) => props.setFieldValue('confirm.html', val)}
                />
                {!!(props.errors.confirm?.html && props.touched.confirm?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.confirm.html}</div>
                ) : ""}
            </Form.Field>
        </Tab.Pane>
    )
    
}