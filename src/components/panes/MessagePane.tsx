import {FormikProps} from "formik";
import {APISettings} from "../../api/handler/SettingsHandler";
import {Form, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React from "react";

export const MessagePane = (props : FormikProps<APISettings>) => {

    return (
        <Tab.Pane attached={false}>
            <h2>{__('Messages', 'remind-me')}</h2>
            <Form.Input
                value={props.values.messages.signin}
                onChange={props.handleChange}
                name='messages.signin'
                disabled={props.isSubmitting}
                maxLength={150}
                error={props.errors.messages?.signin && props.touched.messages?.signin ? props.errors.messages?.signin : null}
                label={__('Sign in success message', 'remind-me')}
            />
            <Form.Input
                value={props.values.messages.double_opt_in}
                disabled={props.isSubmitting}
                onChange={props.handleChange}
                maxLength={150}
                name='messages.double_opt_in'
                error={props.errors.messages?.double_opt_in && props.touched.messages?.double_opt_in ? props.errors.messages?.double_opt_in : null}
                label={__('Double-opt-in success message', 'remind-me')}
            />
            <Form.Input
                value={props.values.messages.signout}
                disabled={props.isSubmitting}
                name='messages.signout'
                maxLength={150}
                onChange={props.handleChange}
                error={props.errors.messages?.signout && props.touched.messages?.signout ? props.errors.messages?.signout : null}
                label={__('Signout success message', 'remind-me')}
            />
            <h2>{__('Texts', 'remind-me')}</h2>
            <Form.TextArea
                value={props.values.privacy_text}
                disabled={props.isSubmitting}
                maxLength={350}
                style={{resize: 'none'}}
                name='privacy_text'
                onChange={props.handleChange}
                error={props.errors.privacy_text && props.touched.privacy_text ? props.errors.privacy_text : null}
                label={__('Privacy text for shortcode', 'remind-me')}
            />
        </Tab.Pane>
    )

}