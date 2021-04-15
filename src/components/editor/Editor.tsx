import {
    ContentBlock,
    Editor as MainEditor,
    EditorState,
    RichUtils,
    DraftHandleValue, getDefaultKeyBinding
} from "draft-js";
import React from "react";
import {useState} from "react";
import {__} from "@wordpress/i18n";
import "draft-js/dist/Draft.css";
import "./../../styles/RichEditor.css";
import {BlockStyleControl} from "./BlockStyleControl";
import {InlineStyleControl} from "./InlineStyleControl";
import {stateToHTML} from "draft-js-export-html";

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
}

interface EditorProps {
    update: (value : string) => void
}

export const Editor = (props : EditorProps) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const editor = React.useRef<MainEditor>(null);

    const focus = () => {
        editor.current?.focus();
    }

    const change = (state : EditorState) => {
        setEditorState(state);
        props.update(stateToHTML(state.getCurrentContent()));
    }

    const toggleBlock = (style : string) => {
        setEditorState(RichUtils.toggleBlockType(
            editorState,
            style
        ));
    }

    const toggleStyle = (style : string) => {
        setEditorState(RichUtils.toggleInlineStyle(
            editorState,
            style
        ));
    }

    const getClassName = () : string => {
        let className = 'RichEditor-editor';
        const content = editorState.getCurrentContent();
        if(!content.hasText()) {
            if(content.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        return className;
    }

    const getBlockStyle = (block : ContentBlock) : string => {
        switch(block.getType()) {
            case 'blockquote': return 'RichEditor-blockquote';
            default: return '';
        }
    }

    const handleKeyCommand = (command : string, editorState : EditorState) : DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if(newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    const mapKeyToEditorCommand = (e : React.KeyboardEvent) => {
        if(e.keyCode === 9) {
            const newState = RichUtils.onTab(e, editorState, 4);
            if(newState !== editorState) {
                setEditorState(newState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }

    return (
        <div className="RichEditor-root">
            <BlockStyleControl editorState={editorState} onToggle={toggleBlock} />
            <InlineStyleControl editorState={editorState} onToggle={toggleStyle} />
            <div className={getClassName()} onClick={focus}>
                <MainEditor
                    blockStyleFn={getBlockStyle}
                    onChange={change}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    //@ts-ignore
                    keyBindingFn={mapKeyToEditorCommand}
                    placeholder={__('write an email', 'wp-reminder')}
                    ref={editor}
                    spellCheck={true}
                />
            </div>
        </div>
    )

}