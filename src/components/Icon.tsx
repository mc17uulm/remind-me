import React, {Component} from "react";

interface IconProps {
    class: string;
    spin?: boolean;
    rotate?: "normal" | "90" | "180" | "270";
    flip?: "normal" | "horizontal" | "vertical";
    list?: boolean;
    fixedWith?: boolean;
    size?: "normal" | "lg" | "2x" | "3x" | "4x" | "5x";
}

interface IconState {}

export class Icon extends Component<IconProps, IconState>
{

    static defaultProps = {
        spin: false,
        rotate: "normal",
        flip: "normal",
        list: false,
        fixedWith: false,
        size: "normal"
    }

    constructor(props : IconProps)
    {
        super(props);
    }

    render() : JSX.Element {
        const {spin, rotate, flip, list, fixedWith, size} = this.props;

        return(
            <i className={
                `fa fa-${this.props.class}` +
                (spin ? " fa-spin" : "") +
                (rotate !== "normal" ? ` fa-rotate-${rotate}` : "") +
                (flip !== "normal" ? ` fa-flip-${flip}` : "") +
                (size !== "normal" ? ` fa-${size}` : "") +
                (fixedWith ? " fa-fw" : "") +
                (list ? " fa-li" : "") +
                (spin ? " fa-spin" : "")
            } />
        );
    }

}