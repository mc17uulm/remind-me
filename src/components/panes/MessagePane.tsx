import {FormikProps} from "formik";
import {APISettings} from "../../api/handler/SettingsHandler";
import {Form, Message, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React from "react";

export const MessagePane = (props : FormikProps<APISettings>) => {

    return (
        <Tab.Pane attached={false}>
            <h2>{__('Messages', 'wp-reminder')}</h2>
            <Form.Input
                value={props.values.messages.signin}
                onChange={props.handleChange}
                name='messages.signin'
                disabled={props.isSubmitting}
                error={props.errors.messages?.signin && props.touched.messages?.signin ? props.errors.messages?.signin : null}
                label={__('Sign in success message', 'wp-reminder')}
            />
            <Form.Input
                value={props.values.messages.double_opt_in}
                disabled={props.isSubmitting}
                onChange={props.handleChange}
                name='messages.double_opt_in'
                error={props.errors.messages?.double_opt_in && props.touched.messages?.double_opt_in ? props.errors.messages?.double_opt_in : null}
                label={__('Double-opt-in success message', 'wp-reminder')}
            />
            <Form.Input
                value={props.values.messages.signout}
                disabled={props.isSubmitting}
                name='messages.signout'
                onChange={props.handleChange}
                error={props.errors.messages?.signout && props.touched.messages?.signout ? props.errors.messages?.signout : null}
                label={__('Signout success message', 'wp-reminder')}
            />
            <h2>{__('Texts', 'wp-reminder')}</h2>
            <Form.Input
                value={props.values.privacy_text}
                disabled={props.isSubmitting}
                name='privacy_text'
                onChange={props.handleChange}
                error={props.errors.privacy_text && props.touched.privacy_text ? props.errors.privacy_text : null}
                label={__('Privacy text for shortcode', 'wp-reminder')}
            />
        </Tab.Pane>
    )

}