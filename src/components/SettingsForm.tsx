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
    privacy_text: yup.string().required(__('Please insert a text for the privacy notice', 'remind-me')),
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
            setSettings(resp.get_value());
        }
    }

    const onSubmit = async (settings : APISettings, actions : FormikHelpers<APISettings>) => {
        const resp = await SettingsHandler.update({
            messages: settings.messages,
            license: {
                code: settings.license.code
            },
            privacy_text: settings.privacy_text
        });
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
        } else {
            await update();
            setMessage({type: "success", msg: __('Saved settings', 'remind-me')})
            toast.success(__('Saved settings', 'remind-me'));
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
                                {menuItem: __('Messages', 'remind-me'), render: () => <MessagePane {..._props} />},
                                {menuItem: __('License', 'remind-me'), pane: {active: false}}
                            ]}
                        />
                        <SubmitBtnContainer message={message}>
                            <Button color='green' disabled={_props.isSubmitting} loading={_props.isSubmitting} type='submit' floated={"right"}>{__('Save', 'remind-me')}</Button>
                        </SubmitBtnContainer>
                    </Form>
                )}
            </Formik>

        </Fragment>
    );

}
