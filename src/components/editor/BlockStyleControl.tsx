import {EditorState} from "draft-js";
import React from "react";
import {StyleButton} from "./StyleButton";

export interface Styles {
    label: string,
    style: string,
    icon: string
}

const BLOCK_TYPES : Styles[] = [
    {label: 'H1', style: 'header-one', icon: 'heading'},
    {label: 'H2', style: 'header-two', icon: 'heading'},
    {label: 'H3', style: 'header-three', icon: 'heading'},
    {label: 'H4', style: 'header-four', icon: 'heading'},
    {label: 'H5', style: 'header-five', icon: 'heading'},
    {label: 'H6', style: 'header-six', icon: 'heading'},
    {label: 'Blockquote', style: 'blockquote', icon: 'quote-right'},
    {label: 'UL', style: 'unordered-list-item', icon: 'list-ul'},
    {label: 'OL', style: 'ordered-list-item', icon: 'list-ol'},
    {label: 'Code Block', style: 'code-block', icon: 'code'}
]

interface BlockStyleControlProps {
    editorState: EditorState
    onToggle: (style : string) => void
}

export const BlockStyleControl = (props : BlockStyleControlProps) => {

    const selection = props.editorState.getSelection();
    const blockType = props.editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type : Styles) => (
                <StyleButton
                    label={type.label}
                    key={type.label}
                    active={type.style === blockType}
                    onToggle={props.onToggle}
                    icon={type.icon}
                    style={type.style}
                />
            ))}
        </div>
    )

}