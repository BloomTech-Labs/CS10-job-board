import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Alert, Tooltip, Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;
const PassTool = <span>8 Characters Minimum</span>

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            repeatpassword: '',
            firstName: '',
            lastName: '',
            error: null,
            message: null
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        const { email, password, repeatpassword } = this.state;
        e.preventDefault();
        if (!email.includes('@' && '.') || email.length < 6) {
            this.setState({ error: 'Please provide a valid email address.'});
        } else if (password.length < 8 || repeatpassword.length < 8) {
            this.setState({ error: `Passwords must be at least 8 characters long.`});
        } else if (password !== repeatpassword) {
            this.setState({ error: `Passwords must match.` });
        } else {
            axios.post(`${process.env.REACT_APP_REGISTER_API}`, this.state)
                .then(response => {
                    this.setState({ message: `Account Created! Redirecting... `});
                    setTimeout(() => {
                        this.props.logIn(response.data);
                    }, 2000);
                })
                .catch(err => {

                    this.setState({ error: `Wrong email and/or password. Try again or click forgot password to reset it.`});
                });
        }
    }

    passwordChange1 = e => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length >= 8) this.setState({ tooltip1: false });
        else this.setState({ tooltip1: true });
    }

    passwordChange2 = e => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length >= 8) this.setState({ tooltip2: false });
        else this.setState({ tooltip2: true });
    }

    render() {
        const { email, password, repeatpassword, firstName, lastName, error, message } = this.state;
        return (
            <Form className="form">

                {error ? (
                  <Alert message={error} type="error" closable showIcon />
                  ) : (null)}
                {message ? (
                  <Alert message={message} type="success" closable showIcon />
                ) : (null)}

                <h3>Register</h3>
                <FormItem>
                <Input type="text" name="email" prefix={<Icon type="user" />}  autoComplete="email" value={email} placeholder="email" onChange={this.onChange} required/>
                </FormItem>
                <FormItem>
                    <Tooltip placement="right" trigger="focus" title={PassTool}>
                        <Input type="password" name="password" prefix={<Icon type="lock" />}  autoComplete="off" value={password} placeholder="password" onChange={this.passwordChange1} required/>
                    </Tooltip>
                </FormItem>
                <FormItem>
                    <Tooltip placement="right" trigger="focus" title={PassTool}>
                        <Input type="password" name="repeatpassword" prefix={<Icon type="lock" />}  autoComplete="off" value={repeatpassword} placeholder="repeat password" onChange={this.passwordChange2} required/>
                    </Tooltip>
                </FormItem>
                <Input type="text" name="firstName" prefix={<Icon type="idcard" />} autoComplete="given-name" value={firstName} placeholder="First Name" onChange={this.onChange}/>
                <Input type="text" name="lastName" prefix={<Icon type="idcard" />} autoComplete="family-name" value={lastName} placeholder="Last Name" onChange={this.onChange}/>
                <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSubmit}>Sign Up</Button>
            </Form>
        );
    }
}

export default Form.create()(withRouter(Register));