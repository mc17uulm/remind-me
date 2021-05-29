import {FormikProps} from "formik";
import {APISettings} from "../../api/handler/SettingsHandler";
import {Form, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React from "react";

export const LicensePane = (props : FormikProps<APISettings>) => {

    return (
        <Tab.Pane attached={false}>
            <h2>{__('License', 'wp-reminder')}</h2>
            <strong style={{color: props.values.license.active ? 'green' : 'red'}}>{props.values.license.active ? __('Activated', 'wp-reminder') : __('Inactive', 'wp-reminder')}</strong><br />
            <strong>{__('Status', 'wp-reminder')}:</strong> {props.values.license.status}<br />
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