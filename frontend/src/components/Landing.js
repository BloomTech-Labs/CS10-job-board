import React from 'react';
import { Login, Register } from './';
import axios from 'axios';
import { Alert } from 'antd';
import { withRouter } from 'react-router-dom';
import hero from '../assets/hero.svg';
import '../css/Landing.css';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true
        };
    }

    componentDidMount() {
        // Prevents calling a GET request every time component is rendered
        // jobs is inherited from App.js
        if (!this.props.jobs) {
            this.fetchJobs();
        }
    }

    changeComponent = () => {
        this.setState({ login: !this.state.login });
    };

    fetchJobs = () => {
        this.setState({ loading: true });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` } };
        axios
            .get(
                `${process.env.REACT_APP_API}${
                    this.props.history.location.pathname
                }`,
                requestOptions
            )
            .then(response => {
                // setJobs is inherited from App.js
                this.props.setJobs(response.data);
            })
            .catch(err => {
                this.setState({
                    error: `Error processing request. Try Again.`
                });
            });
        this.setState({ loading: false });
    };

    render() {
        const { login, error, loading } = this.state;
        return (
            <div className="landing-page">
                <div className="hero-div">
                    <h1>Open Jobs</h1>
                    <h2>
                    No Degree, No Problem.<br />Your next job is just a click
                    away.
                    </h2>
                </div>
                {/* <img src={hero} draggable={false} alt="hero illustration" /> */}
                {/* login toggles the display of Login or Register components */}
                <div>
                {login ? (
                    <Login {...this.props} />
                ) : (
                    <Register {...this.props} />
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
