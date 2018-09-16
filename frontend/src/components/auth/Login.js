import React from "react";
import axios from "axios";

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        error: null
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_LOGIN_API}`, this.state)
            .then(response => {
                this.setState({ error: null });
                localStorage.setItem('token', response.data.token);
                // if user is an employee
                // this.props.history.push('/jobs');
                // if use is an employer
                // this.props.history.push('/dashboard');
            })
            .catch(err => {
                this.setState({ error: `Error processing your request. Please try again.`});
            });
    }

    render() {
        const { email, password, error } = this.state;
        return (
            <form className="form">
                <div className="message">
                    <p className="error">{error}</p>
                </div>

                <h3>Login</h3>

                <input type="text" name="email"  autoComplete="email" value={email} placeholder="email" onChange={this.handleChange}/>
                <input type="password" name="password"  autoComplete="password" value={password} placeholder="password" onChange={this.handleChange}/>
                <button onClick={this.handleSubmit}>Sign In</button>
            </form>
        );
    }
}

export default Login;