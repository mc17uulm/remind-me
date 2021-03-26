import React, {Fragment} from "react";
import ReactDOM from "react-dom";

const App = () => {

    return (
        <Fragment>

        </Fragment>
    );

}

export const run = () => {
    const elem = document.getElementById("");
    elem ? ReactDOM.render(<App />, elem) : false;
}