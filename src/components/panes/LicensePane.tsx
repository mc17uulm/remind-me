import {FormikProps} from "formik";
import {APISettings, SettingsHandler} from "../../api/handler/SettingsHandler";
import {Button, Form, Header, Icon, Message, Modal, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React, {useState} from "react";
import {toast} from "react-toastify";

export const LicensePane = (props : FormikProps<APISettings> & {update: () => Promise<void>}) => {

    const [open, updateOpen] = useState<boolean>(false);

    const renderInfo = (active : boolean) => {
        return active ? (
            <span className='remind-me-text green'><Icon name='check circle' /> {__('Active', 'remind-me')}</span>
        ) : (
            <span className='remind-me-text red'><Icon name='times circle' /> {__('Inactive', 'remind-me')}</span>
        )
    }

    const onRemove = async () => {
        const response = await SettingsHandler.remove_license();
        if(response.has_error()) {
            console.error(response.get_error());
            toast.error(response.get_error());
        } else {
            await props.update();
            toast.info(__('Removed license', 'remind-me'));
        }
        updateOpen(false);
    }

    return (
        <Tab.Pane attached={false}>
            <h2>{__('License', 'remind-me')}</h2>
            <Message info>
                <Message.Header>{__('License info', 'remind-me')}</Message.Header>
                {__('With a license you can add multiple events, add and export subscribers and use the reliable backend of our service. More information at: ', 'remind-me')}
                <a href='https://code-leaf.de'>CodeLeaf</a>
            </Message>
            <h3>{__('Your license', 'remind-me')}</h3>
            <Form.Group inline>
                <Form.Field>
                    <label>{__('License code', 'remind-me')}</label>
                </Form.Field>
                <Form.Input
                    value={props.values.license.code}
                    width={12}
                    disabled={props.values.license.active || props.isSubmitting}
                    name='license.code'
                    onChange={props.handleChange}
                    error={props.errors.license?.code && props.touched.license?.code ? props.errors.license.code : null}
                />
                <Form.Field
                    width={2}
                >
                    <a
                        className={'remind-me-delete-link' + (props.values.license.active ? '' : ' remind-me-disabled')}
                        onClick={() => {
                            props.values.license.active ? updateOpen(true) : null;
                        }}
                    >
                        <Icon name='trash alternate outline' /> {__('Remove license', 'remind-me')}
                    </a>
                </Form.Field>
            </Form.Group>
            <Form.Group inline>
                <Form.Field>
                    <label>{__('License info', 'remind-me')}</label>
                </Form.Field>
                <Form.Field>
                    {renderInfo(props.values.license.active)}
                </Form.Field>
            </Form.Group>
            <Modal
                closeIcon
                open={open}
                onClose={() => updateOpen(false)}
                onOpen={() => updateOpen(true)}
            >
                <Header>{__('Remove license code', 'remind-me')}</Header>
                <Modal.Content>
                    <p>
                        {__('Do you really want to remove your license code from this page?', 'remind-me')}
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => updateOpen(false)}>
                        {__('No', 'remind-me')}
                    </Button>
                    <Button color='red' onClick={onRemove}>
                        {__('Yes', 'remind-me')}
                    </Button>
                </Modal.Actions>
            </Modal>
        </Tab.Pane>
    )

}