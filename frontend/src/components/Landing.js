import React from 'react';
import { Login, Register } from './';
import { Button } from 'antd';
import { withRouter, NavLink } from 'react-router-dom';
import '../css/Landing.css';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true
        };
    }

    changeComponent = () => {
        this.setState({ login: !this.state.login });
    };

    render() {
        const { login, error, loading } = this.state;
        return (
            <div className="landing">
                <div className="hero-div">
                    <h1 className="landing-title">Open Jobs</h1>
                    <h2 className="landing-copy">
                    No Degree, No Problem.<br />Your next job is just a click
                    away.
                    </h2>
                </div>

                {/* login toggles the display of Login or Register components */}

                <div>
                {login ? (
                    <div className="landing-form">
                        <Login {...this.props} />
                    </div>
                ) : (
                    <div className="landing-form">
                        <Register {...this.props} />
                    </div>
                )}
                <a onClick={this.changeComponent}>
                    {login ? `Register` : `Login`}
                </a>
                </div>
            </div>
        );
    }
}

export default withRouter(Landing);
