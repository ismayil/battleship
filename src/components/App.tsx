import * as React from "react";
import "./../assets/scss/App.scss";
import axios from "axios";
import Div from "./Div";
const reactLogo = require("./../assets/img/react_logo.svg");

type MyProps = {};
type MyState = { grid: Array<Array<string>>, end: Boolean };
export default class App extends React.Component<MyProps, MyState> {
    constructor(props) {
        super(props);
    }
    startGame = () => {
        this.initGame();
        axios.get('http://localhost:3000/start')
            .then(response => {
                //this.initGame();
            })

    }
    componentWillMount() {
        //this.startGame();
        this.startGame();
    }
    initGame = () => {
        let tempRows = [];
        let tempGrid = [];
        for (let i = 0; i < 10; i++) {
            tempRows = [];
            for (let j = 0; j < 10; j++) {
                tempGrid.push([i, j, "backgroundBlue"]);
            }

            //tempGrid.push(tempRows);
        }
        this.setState({
            grid: tempGrid,
            end: false
        });
    }
    checkShip = (className, x, y) => {
        if (!this.state.end) {
            //console.log(className);
            let tempGrid = this.state.grid;

            axios.post('http://localhost:3000/check', { coords: [x, y] })
                .then(response => {
                    //console.log("backgroundRed")
                    //className = "backgroundRed"
                    if (response.data.end) {
                        this.setState({
                            end: true
                        })
                    }
                    if (response.data) {
                        tempGrid.map((item, key) => {
                            if (item[0] == x && item[1] == y) {
                                item[2] = "backgroundRed";
                            }
                            return item;
                        })
                        this.setState({
                            grid: tempGrid
                        })
                    } else {
                        tempGrid.map((item, key) => {
                            if (item[0] == x && item[1] == y) {
                                item[2] = "backgroundGrey";
                            }
                            return item;
                        })
                        this.setState({
                            grid: tempGrid
                        })
                    }

                })
        }
    }
    render() {
        const lastGrid = this.state.grid;
        return (
            <div className="container">
                <div className="grid">
                    {this.state.grid.map((item, key) => {

                        return (<Div className={item[2]} key={key} x={Number(item[0])} y={Number(item[1])} checkShip={this.checkShip} />)
                    })}
                </div>
                <div className="start" >
                    <div onClick={() => this.startGame()}>Start New Game</div>
                    {this.state.end && <div><strong>You WIN !!!</strong></div>}
                </div>
            </div>

        );
    }
}
