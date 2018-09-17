import React from "react";
import { Login, Register } from "./";
import hero from "../assets/hero.svg";
import odoor from "../assets/odoor.svg";
import "../css/Landing.css";

class Landing extends React.Component {
    state = {
        login: true
    }

    changeComponent = () => {
        this.setState({ login: !this.state.login });
    }

    render() {
        const { login } = this.state;
        return (
            <div className="landing-page">
                <div>
                    <h1>Open Jobs</h1>
                    <img class="logo" src={odoor} draggable={false} alt="door logo"/>
                    {/* <h2>No Degree, No Problem.<br/>Your next job is just a click away.</h2> */}
                    <img src={hero} draggable={false} alt="hero illustration"/>
                </div>
                <div>
                    {/* login toggles the display of Login or Register components */}
                    {login ? (
                        <Login />
                    ) : (
                        <Register />
                        )}
                        <a onClick={this.changeComponent}>
                            {login ? (`Register`) : ( `Login` )}
                        </a>
                </div>
            </div>
        );
    }
}

export default Landing;