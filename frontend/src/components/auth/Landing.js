import React from "react";
import { Login, Register } from "./";
// import hero from "../../assets/hero.svg";

class Landing extends React.Component {
    constructor() {
        super()
        this.state = {
            login: true
        }
    }

    changeComponent = () => {
        this.setState({ login: !this.state.login });
    }

    render() {
        const { login } = this.state;
        return (
            <div className="landing-page">
                <div>
                    <h2>No Degree, No Problem.</h2>
                    <h2>Your next job is just a click away.</h2>
                    
                </div>
                <div>
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