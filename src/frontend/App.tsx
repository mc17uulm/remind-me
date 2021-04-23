import React from "react";
import ReactDOM from "react-dom";
import "../styles/frontend.scss";

interface AppProps {
    list: number[]
}

const App = (props : AppProps) => {

    return (
        <div>
            <ul>
            {props.list.map((index : number) => (
                <li key={index}>{index}</li>
            ))}
            </ul>
        </div>
    )
}

export const run = () => {
    const elem = document.getElementById('wp-reminder-frontend-form');
    if(elem !== null) {
        const datalist = elem.getAttribute('datalist-events');
        let list : number[] = [];
        if(datalist !== null) {
            const parts = datalist.split(',');
            list = parts.map((val : string) => parseInt(val)).filter((val : number) => !isNaN(val));
        }
        ReactDOM.render(<App list={list} />, elem);
    }
}