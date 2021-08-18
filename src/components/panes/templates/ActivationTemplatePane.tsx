import {FormikProps} from "formik";
import {Templates} from "../../../api/handler/TemplatesHandler";
import {Form, List, Message, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {Info} from "../../Info";
import {Editor} from "../../editor/Editor";
import React from "react";

export const ActivationTemplatePane = (props : FormikProps<Templates>) => {
    
    return (
        <Tab.Pane attached={false}>
            <h3>{__('Success message for subscription', 'remind-me')}</h3>
            <Form.Input
                value={props.values.success.subject}
                onChange={props.handleChange}
                name='success.subject'
                disabled={props.isSubmitting}
                error={props.errors.success?.subject && props.touched.success?.subject ? props.errors.success?.subject : null}
                label={__('Subject | Success message for subscription', 'remind-me')}
            />
            <Form.Field error={!!(props.errors.confirm?.html && props.touched.confirm?.html)}>
                <label>
                    {__('Template | Success message for subscription', 'remind-me') + " "}
                    <Info>{__('Is the user confirmed the subscription this success mail is send')}</Info>
                </label>
                <Message info>
                    {__('Required placeholders:', 'remind-me')}
                    <List bulleted>
                        <List.Item><code>{'${unsubscribe_link}'}</code>{__('Link to edit/unsubscribe from subscription', 'remind-me')}</List.Item>
                    </List>
                </Message>
                <Editor
                    value={props.values.success.html}
                    error={!!(props.errors.success?.html && props.touched.success?.html)}
                    onChange={(val) => props.setFieldValue('success.html', val)}
                />
                {!!(props.errors.confirm?.html && props.touched.confirm?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.confirm.html}</div>
                ) : ""}
            </Form.Field>
        </Tab.Pane>
    )
    
}