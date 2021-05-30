import {FormikProps} from "formik";
import {APISettings} from "../../api/handler/SettingsHandler";
import {Form, Message, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React from "react";

export const LicensePane = (props : FormikProps<APISettings>) => {

    return (
        <Tab.Pane attached={false}>
            <h2>{__('License', 'wp-reminder')}</h2>
            <Message info>
                <Message.Header>{__('License info')}</Message.Header>
                {__('With a license you can add multiple events, add and export subscribers, and use the reliable backend of our service. More information at: ', 'wp-reminder')}
                <a href='https://code-leaf.de'>CodeLeaf</a>
            </Message>
            The license is <strong className={'wp-reminder-text ' + (props.values.license.active ? 'green' : 'red')}>{props.values.license.active ? __('active', 'wp-reminder') : __('not active', 'wp-reminder')}</strong><br />
            <strong>{__('Status', 'wp-reminder')}:</strong> {props.values.license.status}<br />
            <br />
            <Form.Input
                value={props.values.license.code}
                disabled={props.isSubmitting}
                name='license.code'
                onChange={props.handleChange}
                error={props.errors.license?.code && props.touched.license?.code ? props.errors.license.code : null}
                label={__('Activation code')}
            />
        </Tab.Pane>
    )

}