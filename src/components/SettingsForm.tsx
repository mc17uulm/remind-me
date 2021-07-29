import {APISettings, Settings, SettingsHandler, Templates} from "../api/handler/SettingsHandler";
import {Button, Form, Tab} from "semantic-ui-react";
import {__, sprintf} from "@wordpress/i18n";
import React, {Fragment, useState} from "react";
import {toast} from "react-toastify";
import * as yup from "yup";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {TemplatesPane} from "./panes/TemplatesPane";
import {MessagePane} from "./panes/MessagePane";
import {LicensePane} from "./panes/LicensePane";
import {SubmitBtnContainer} from "./SubmitBtnContainer";
import {IMessage} from "../frontend/Message";

const getMissingKeywords = (content : string, keywords : string[]) : string[] => {
    return keywords.filter((keyword : string) => {
        return !content.includes(keyword);
    });
}

yup.addMethod(yup.string, 'contains_keywords', function(keywords : string[]) {
    return this.test('contain', 'does not contain keywords', function(value : string | undefined) {
        const {path, createError} = this;
        if(typeof value === "undefined") {
            return createError({path, message: __('Given string is empty', 'wp-reminder')});
        }
        const missing = getMissingKeywords(value, keywords);
        if(missing.length > 0) {
            return createError({
                path,
                message: sprintf(__('Required keywords are missing: %s', 'wp-reminder'), missing.join(','))
            });
        }
        return true;
    });
});

const TemplateSchema = (keywords : string[]) => yup.object({
    //@ts-ignore
    html: yup.string().contains_keywords(keywords).required(),
    subject: yup.string().required()
})


const SettingsSchema : yup.SchemaOf<Settings> = yup.object({
    templates: yup.object({
        confirm: TemplateSchema(['${event_list}', '${confirm_link}', '${unsubscribe_link}']),
        success: TemplateSchema(['${unsubscribe_link}']),
        signout: TemplateSchema([]),
        reminder: TemplateSchema(['${event_list}', '${unsubscribe_link}'])
    }),
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
            templates: settings.templates,
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
                                {menuItem: __('Templates', 'wp-reminder'), render: () => <TemplatesPane {..._props} />},
                                {menuItem: __('Messages', 'wp-reminder'), render: () => <MessagePane {..._props} />},
                                {menuItem: __('License', 'wp-reminder'), render: () => <LicensePane {..._props} update={update} />}
                            ]}
                        />
                        <SubmitBtnContainer message={message}>
                            <Button color='green' disabled={_props.isSubmitting} loading={_props.isSubmitting} type='submit' floated={"right"}>{__('Submit', 'wp-reminder')}</Button>
                        </SubmitBtnContainer>
                    </Form>
                )}
            </Formik>

        </Fragment>
    );

}
