import React, {ChangeEvent, useEffect, useState} from "react";
import {Form, Popup, SemanticWIDTHS} from "semantic-ui-react";
import DayPicker from "react-day-picker";
import moment from "moment";
import 'react-day-picker/lib/style.css';

interface DatePickerProps {
    value: Date,
    onChange: (date: Date) => void,
    label: string,
    width: SemanticWIDTHS
}

export const DatePicker = (props : DatePickerProps) => {

    const [date, setDate] = useState<string>("");

    useEffect(() => {
        setDate(moment(props.value).format('YYYY-MM-DD'));
    }, [props.value]);

    const handleChange = () => {
        props.onChange(new Date(date));
    }

    return (
        <Form.Field width={props.width}>
            <label>{props.label}</label>
            <div className="ui input">
                <input
                    type="date"
                    value={date}
                    onBlur={handleChange}
                    onChange={(e : ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                    min={moment().format('YYYY-MM-DD')}
                />
            </div>
        </Form.Field>
    )
}