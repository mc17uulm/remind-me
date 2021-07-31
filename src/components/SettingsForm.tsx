import {APISettings, Settings, SettingsHandler} from "../api/handler/SettingsHandler";
import {Button, Form, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React, {Fragment, useState} from "react";
import {toast} from "react-toastify";
import * as yup from "yup";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {MessagePane} from "./panes/MessagePane";
import {LicensePane} from "./panes/LicensePane";
import {SubmitBtnContainer} from "./SubmitBtnContainer";
import {IMessage} from "../frontend/Message";

const SettingsSchema : yup.SchemaOf<Settings> = yup.object({
    messages: yup.object({
        signin: yup.string().required(),
        signout: yup.string().required(),
        double_opt_in: yup.string().required()
    }),
    license: yup.object({
        code: yup.string()
    }),
    privacy_text: yup.string().required(__('Please insert a text for the privacy notice', 'wp-reminder')),
    settings_page: yup.string().required()
});

interface SettingsFormProps {
    settings : APISettings
}

export const SettingsForm = (props : SettingsFormProps) => {

    const [message, setMessage] = useState<IMessage | null>(null);
    const [settings, setSettings] = useState<APISettings>(props.settings);

    const update = async () => {
        const resp = await SettingsHandler.get();
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
        } else {
            console.log("set settings");
            setSettings(resp.get_value());
            console.log("after set");
        }
    }

    const onSubmit = async (settings : APISettings, actions : FormikHelpers<APISettings>) => {
        const resp = await SettingsHandler.update({
            messages: settings.messages,
            license: {
                code: settings.license.code
            },
            privacy_text: settings.privacy_text,
            settings_page: settings.settings_page
        });
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
        } else {
            await update();
            setMessage({type: "success", msg: __('Saved settings', 'wp-reminder')})
            toast.success(__('Saved settings', 'wp-reminder'));
        }
        actions.setSubmitting(false);
    }

    return (typeof settings === "undefined") ? null : (
        <Fragment>
            <Formik
                initialValues={settings}
                validationSchema={SettingsSchema}
                enableReinitialize
                onSubmit={onSubmit}
            >
                {(_props: FormikProps<APISettings>) => (
                    <Form onSubmit={_props.handleSubmit}>
                        <Tab
                            menu={{
                                secondary: true,
                                pointing: true
                            }}
                            panes={[
                                {menuItem: __('Messages', 'wp-reminder'), render: () => <MessagePane {..._props} />},
                                {menuItem: __('License', 'wp-reminder'), render: () => <LicensePane {..._props} update={update} />}
                            ]}
                        />
                        <SubmitBtnContainer message={message}>
                            <Button color='green' disabled={_props.isSubmitting} loading={_props.isSubmitting} type='submit' floated={"right"}>{__('Save', 'wp-reminder')}</Button>
                        </SubmitBtnContainer>
                    </Form>
                )}
            </Formik>

        </Fragment>
    );

}
