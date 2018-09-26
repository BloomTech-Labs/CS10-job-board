import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Tooltip, Form, Icon, Input, Button } from 'antd';

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
                    // #TODO: how Djoser handles registration tokens/confirmation emails
                    // localStorage.setItem('token', response.data.token);
                    
                    // BELOW: axios post for dev purposes
                    axios.post(`${process.env.REACT_APP_LOGIN_API}`, { email, password })
                        .then(response => {
                            this.setState({ error: `Success`});
                            localStorage.setItem('token', response.data.token);
                            this.props.logIn(response.data.token);
                            this.props.history.push('/jobs'); 
                            // once jobs component is built, need to incorporate withRouter() from react-router-dom to access history object
                        })
                        .catch(err => {
                            this.setState({ error: `Error logging in. Please log in.`});
                        })
                })
                .catch(err => {
                    this.setState({ error: `Error processing your request. Please try again.`})
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
        const { email, password, repeatpassword, firstName, lastName, error } = this.state;
        return (
            <Form className="form">
                <div className="message">
                    <p className="error">{error}</p>
                </div>
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