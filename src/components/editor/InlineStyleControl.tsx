import {EditorState} from "draft-js";
import React from "react";
import {Styles} from "./BlockStyleControl";
import {StyleButton} from "./StyleButton";

interface InlineStyleControlProps {
    editorState: EditorState,
    onToggle: (style : string) => void
}

const INLINE_STYLES : Styles[] = [
    {label: 'Bold', style: 'BOLD', icon: 'bold'},
    {label: 'Italic', style: 'ITALIC', icon: 'italic'},
    {label: 'Underline', style: 'UNDERLINE', icon: 'underline'},
    {label: 'Monospace', style: 'CODE', icon: 'code'},
]

export const InlineStyleControl = (props : InlineStyleControlProps) => {

    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type : Styles) => (
                <StyleButton
                    label={type.label}
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    onToggle={props.onToggle}
                    style={type.style}
                    icon={type.icon}
                />
            ))}
        </div>
    )

}