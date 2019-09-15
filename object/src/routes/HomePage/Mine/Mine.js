import React from 'react'
import ReactDOM from "react-dom"
export default class Mine extends React.Component {
    constructor() {
        super()
        this.state = {
            value: "wzy"
        }
    };
    handleChange(e) {
        console.log(e.target.value);
        console.log(e.target);
        console.log(e);
        this.setState({
            value: e.target.value


        })
    }


    render() {
        return (
            <div>
                <input value={this.state.value} onChange={this.handleChange.bind(this)}></input>
                <p>{this.state.value}</p>
            </div>
        )
    }
}