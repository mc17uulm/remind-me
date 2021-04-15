import React, {Fragment, useEffect, useState} from "react"
import {Template, TemplateHandler} from "../api/handler/TemplateHandler";
import {toast} from "react-toastify";
import {Card} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {HandleTemplateModal} from "../components/modals/AddTemplateModal";
import "./../styles/template.scss";
import {DeleteTemplateModal} from "../components/modals/DeleteTemplateModal";

export const Templates = () => {

    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
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

    return (
        <Fragment>
            <a className="wp-reminder-add-link" onClick={(e) => {e.preventDefault(); setAddOpen(true);}}>{__('Add Template', 'wp-reminder')}</a>
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
                            onClick={() => {setSelected(template); setAddOpen(true)}}
                        >{__('Edit', 'wp-reminder')}</a>
                        <span className="right floated">
                            <a
                                className="wp-reminder-delete-link"
                                onClick={() => {setSelected(template); setDeleteOpen(true)}}
                            >
                                {__('Delete', 'wp-reminder')}
                            </a>
                        </span>
                    </Card.Content>
                </Card>
            ))}
            </Card.Group>
            <HandleTemplateModal
                open={addOpen}
                template={selected}
                onClose={() => setAddOpen(false)}
                onSuccess={async () => {await loadTemplates(); setAddOpen(false);}}
            />
            <DeleteTemplateModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onSuccess={async () => {await loadTemplates(); setDeleteOpen(false)}}
                template={selected}
            />
        </Fragment>
    )
}