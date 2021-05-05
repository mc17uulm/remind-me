import React, {useEffect, useState} from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

interface EditorProps {
    value : string,
    onChange: (value : string) => void,
    error?: boolean
}

const ToolbarOptions = [
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{font: []}],
    [{list: "ordered"}, {list: "bullet"}],
    ["bold", "italic", "underline"],
    [{color: []}, {background: []}],
    [{script: "sub"}, {script: "super"}],
    [{align: []}],
    ["image", "blockquote"],
    ["clean"]
]

export const Editor = (props : EditorProps) => {

    const [state, setState] = useState<string>("");

    useEffect(() => {
        setState(props.value);
    }, []);

    const onChange = (content : string) => {
        setState(content);
        props.onChange(content);
    }

    return (
        <ReactQuill className={(props.error) ? "error" : ""} theme="snow" modules={{toolbar: ToolbarOptions}} value={state} onChange={onChange} />
    )
}