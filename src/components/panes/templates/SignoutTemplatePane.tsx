import {FormikProps} from "formik";
import {Templates} from "../../../api/handler/TemplatesHandler";
import {Form, Tab} from "semantic-ui-react";
import React from "react";
import {__} from "@wordpress/i18n";
import {Info} from "../../Info";
import {Editor} from "../../editor/Editor";

export const SignoutTemplatePane = (props : FormikProps<Templates>) => {

    return (
        <Tab.Pane attached={false}>
            <h3>{__('Signout email', 'wp-reminder')}</h3>
            <Form.Input
                value={props.values.signout.subject}
                onChange={props.handleChange}
                name='signout.subject'
                disabled={props.isSubmitting}
                error={props.errors.signout?.subject && props.touched.signout?.subject ? props.errors.signout?.subject : null}
                label={__('Subject | Signout email', 'wp-reminder')}
            />
            <Form.Field error={!!(props.errors.signout?.html && props.touched.signout?.html)}>
                <label>
                    {__('Template | Signout email', 'wp-reminder') + " "}
                    <Info>{__('If the user signed out, this confirm message is send.')}</Info>
                </label>
                <Editor
                    value={props.values.signout.html}
                    error={!!(props.errors.signout?.html && props.touched.signout?.html)}
                    onChange={(val) => props.setFieldValue('signout.html', val)}
                />
                {!!(props.errors.signout?.html && props.touched.signout?.html) ? (
                    <div className='ui pointing prompt label'>{props.errors.signout.html}</div>
                ) : ""}
            </Form.Field>
        </Tab.Pane>
    )

}