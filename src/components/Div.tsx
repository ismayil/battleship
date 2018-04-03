import * as React from "react";
import "./../assets/scss/App.scss";

type MyProps = { x: Number, y: Number, checkShip: Function, className: string };
type MyState = { className: string };
export default class Div extends React.Component<MyProps, MyState> {
    constructor(props) {
        super(props);
        this.state = {
            className: props.className
        }
    }

    render() {
        const { x, y, checkShip, className } = this.props;
        console.log(this.state.className)
        return (
            <div className={className} onClick={() => { className == "backgroundRed" ? null : checkShip(this.state.className, x, y) }}></div>
        );
    }
}
