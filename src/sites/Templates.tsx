import React, {Fragment, MouseEvent, useEffect, useState} from "react"
import {Template, TemplateHandler} from "../api/handler/TemplateHandler";
import {toast} from "react-toastify";
import {Card} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {HandleTemplateModal} from "../components/modals/HandleTemplateModal";
import "./../styles/template.scss";
import {HandableModalType} from "../components/modals/HandableModal";


export const Templates = () => {

    const [modal, setModal] = useState<HandableModalType>(HandableModalType.HIDE);
    const [selected, setSelected] = useState<Template | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);

    const loadTemplates = async () : Promise<void> => {
        const resp = await TemplateHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setTemplates(resp.get_value());
        }
    }

    useEffect(() => {
        loadTemplates();
    }, []);

    const onAdd = (e : MouseEvent) => {
        e.preventDefault();
        setSelected(null);
        setModal(HandableModalType.ADD)
    }

    const onSuccess = async () => {
        await loadTemplates();
        setModal(HandableModalType.HIDE);
    }

    const onClose = () => {
        setSelected(null);
        setModal(HandableModalType.HIDE);
    }

    return (
        <Fragment>
            <a className="wp-reminder-add-link" onClick={onAdd}>{__('Add Template', 'wp-reminder')}</a>
            <br />
            <Card.Group>
            {templates.map((template: Template, index : number) => (
                <Card key={`template_${index}`}>
                    <Card.Content>
                        <div
                            dangerouslySetInnerHTML={{__html: template.html}}
                            className="wp-reminder-template-preview">
                        </div>
                        <Card.Header>{template.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <a
                            className="wp-reminder-edit-link"
                            onClick={() => {setSelected(template); setModal(HandableModalType.ADD)}}
                        >{__('Edit', 'wp-reminder')}</a>
                        <span className="right floated">
                            <a
                                className="wp-reminder-delete-link"
                                onClick={() => {setSelected(template); setModal(HandableModalType.DELETE)}}
                            >
                                {__('Delete', 'wp-reminder')}
                            </a>
                        </span>
                    </Card.Content>
                </Card>
            ))}
            </Card.Group>
            <HandleTemplateModal
                open={modal !== HandableModalType.HIDE}
                element={selected}
                type={modal}
                onClose={onClose}
                onSuccess={onSuccess}
            />
        </Fragment>
    )
}