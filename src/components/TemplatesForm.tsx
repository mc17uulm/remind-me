import React, {useState} from "react";
import {Templates, TemplatesHandler} from "../api/handler/TemplatesHandler";
import {Button, Form, Tab} from "semantic-ui-react";
import {__, sprintf} from "@wordpress/i18n";
import {SubmitBtnContainer} from "./SubmitBtnContainer";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {IMessage} from "../frontend/Message";
import * as yup from "yup";
import {ConfirmTemplatePane} from "./panes/templates/ConfirmTemplatePane";
import {ActivationTemplatePane} from "./panes/templates/ActivationTemplatePane";
import { SignoutTemplatePane } from "./panes/templates/SignoutTemplatePane";
import {ReminderTemplatePane} from "./panes/templates/ReminderTemplatePane";
import { toast } from "react-toastify";

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
});

const TemplatesSchema : yup.SchemaOf<Templates> = yup.object({
    confirm: TemplateSchema(['${event_list}', '${confirm_link}', '${unsubscribe_link}']),
    success: TemplateSchema(['${unsubscribe_link}']),
    signout: TemplateSchema([]),
    reminder: TemplateSchema(['${event_list}', '${unsubscribe_link}'])
});

export const TemplatesForm = (props : {templates : Templates}) => {

    const [message, setMessage] = useState<IMessage | null>(null);
    const [templates, setTemplates] = useState<Templates>(props.templates);

    const update = async () => {
        const resp = await TemplatesHandler.get();
        if(resp.has_error()) {
            console.error(resp.get_error());
            toast.error(resp.get_error());
        } else {
            console.log("set settings");
            setTemplates(resp.get_value());
            console.log("after set");
        }
    }

    const onSubmit = async (templates: Templates, actions: FormikHelpers<Templates>) => {
        const resp = await TemplatesHandler.update(templates);
        if(resp.has_error()) {
            console.error(resp.has_error());
            toast.error(resp.get_error());
        } else {
            await update();
            setMessage({type: "success", msg: __('Saved templates', 'wp-reminder')})
            toast.success(__('Saved settings', 'wp-reminder'));
        }
        actions.setSubmitting(false);
    }

    return (
        <Formik
            initialValues={templates}
            enableReinitialize
            validationSchema={TemplatesSchema}
            onSubmit={onSubmit}
        >
            {(_props : FormikProps<Templates>) => (
                <Form onSubmit={_props.handleSubmit}>
                    <Tab
                        menu={{
                            secondary: true,
                            pointing: true
                        }}
                        panes={[
                            {menuItem: __('Registration confirmation', 'wp-reminder'), render: () => <ConfirmTemplatePane {..._props} />},
                            {menuItem: __('Activation confirmation', 'wp-reminder'), render: () => <ActivationTemplatePane {..._props} />},
                            {menuItem: __('Signout', 'wp-reminder'), render: () => <SignoutTemplatePane {..._props} />},
                            {menuItem: __('Reminder', 'wp-reminder'), render: () => <ReminderTemplatePane {..._props} />}
                        ]}
                    />
                    <SubmitBtnContainer message={message}>
                        <Button color='green' disabled={_props.isSubmitting} loading={_props.isSubmitting} type='submit' floated='right'>{__('Save', 'wp-reminder')}</Button>
                    </SubmitBtnContainer>
                </Form>
            )}
        </Formik>
    )

}