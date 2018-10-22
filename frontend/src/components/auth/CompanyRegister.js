import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Alert, Tooltip, Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;
const PassTool = <span>8 Characters Minimum</span>

class CompanyRegister extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            repeatpassword: '',
            is_employer: true,
            error: null,
            message: null
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { email, password, repeatpassword } = this.state;
        this.setState({ error: null, message: null });
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
                        axios.post(`${process.env.REACT_APP_LOGIN_API}`, { email, password })
                            .then(response => {
                                localStorage.setItem('token', response.data.token);
                                const registerCompany = true;
                                this.props.logIn(response.data, registerCompany);
                            })
                            .catch(err => {
                                this.setState({ error: `Wrong email and/or password. Try again or click forgot password to reset it.`});
                            });
                    }, 1000);
                })
                .catch(err => {

                    this.setState({ error: `Email already exists. Please choose another.`});
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
        const { email, password, repeatpassword, error, message } = this.state;
        return (
            <Form className="form">

                {error ? (
                  <Alert message={error} type="error" closable showIcon />
                  ) : (null)}
                {message ? (
                  <Alert message={message} type="success" closable showIcon />
                ) : (null)}

                <h3>Company Signup</h3>
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
                <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSubmit}>Sign Up</Button>
            </Form>
        );
    }
}

export default Form.create()(withRouter(CompanyRegister));
