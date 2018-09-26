import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: null
        }
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
                this.props.logIn();
                this.props.history.push('/jobs');
                // if use is an employer
                // this.props.history.push('/dashboard');
            })
            .catch(err => {
                this.setState({ error: `Error processing your request. Please try again.`});
            });
    }

    render() {
        const { email, password } = this.state;
        return (
            <Form className="form">

                <h3>Login</h3>

                <FormItem>
                    <Input type="text" name="email" prefix={<Icon type="user" />} value={email} autoComplete="email" placeholder="Email" onChange={this.handleChange} />
                </FormItem>
                <FormItem>
                    <Input type="password" name="password" prefix={<Icon type="lock" />} value={password} autoComplete="password" placeholder="Password" onChange={this.handleChange} />
                </FormItem>

                <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSubmit}>Sign In</Button>
            </Form>
        );
    }
}

export default Form.create()(withRouter(Login));