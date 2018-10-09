import React from "react";
import axios from "axios";
import { Alert } from "antd";
import { withRouter } from "react-router-dom";
import { Form, Icon, Input, Button } from 'antd';
import "../../css/Login.css";

const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'test@test.com',
            password: 'TESTACCOUNT',
            message: null,
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
                this.props.logIn(response.data);
            })
            .catch(err => {
                this.setState({ error: `Wrong email and/or password. Try again or click forgot password to reset it.`});
            });
    }

    render() {
        const { email, password, error, message } = this.state;
        return (
            <Form className="form">
                {error ? (
                    <Alert message={error} type="error" closable showIcon banner />
                    ) : (null)}
                {message ? (
                    <Alert message={message} type="success" closable showIcon />
                    ) : (null)}
                
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